"""Cosmos + Key Vault access. Never logs secret values."""

from __future__ import annotations

import os
from functools import lru_cache
from typing import Any

from azure.cosmos import CosmosClient
from azure.identity import AzureCliCredential, DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from dotenv import load_dotenv

from scripts.common import ENV_PATH

DATABASE = "unit100"
CONTAINER = "tag_map"
PACKAGES = "packages"


def _load_env() -> None:
    load_dotenv(ENV_PATH)


def _secret_via_az(name: str) -> str:
    import subprocess

    vault = os.environ.get("KEY_VAULT_URL", "")
    vault_name = vault.split("//", 1)[-1].split(".", 1)[0] if vault else "kv-u100-rp0328"
    out = subprocess.check_output(
        [
            "az",
            "keyvault",
            "secret",
            "show",
            "--vault-name",
            vault_name,
            "--name",
            name,
            "--query",
            "value",
            "-o",
            "tsv",
        ],
        text=True,
        stderr=subprocess.DEVNULL,
    )
    return out.strip()


def _secret(name: str) -> str:
    """Resolve a secret from env (COSMOS_KEY) or Key Vault (COSMOS-KEY)."""
    env_name = name.replace("-", "_")
    val = os.environ.get(env_name)
    if val:
        return val
    try:
        return _secret_via_az(name)
    except Exception:
        pass
    vault = os.environ.get("KEY_VAULT_URL")
    if not vault:
        raise RuntimeError(f"{env_name} is empty and KEY_VAULT_URL is not set")
    try:
        cred = AzureCliCredential()
        client = SecretClient(vault_url=vault, credential=cred)
        return client.get_secret(name).value
    except Exception:
        cred = DefaultAzureCredential(exclude_interactive_browser_credential=True)
        client = SecretClient(vault_url=vault, credential=cred)
        return client.get_secret(name).value


@lru_cache(maxsize=1)
def _cosmos_db():
    _load_env()
    endpoint = os.environ["COSMOS_ENDPOINT"]
    key = _secret("COSMOS-KEY")
    client = CosmosClient(endpoint, credential=key)
    return client.get_database_client(DATABASE)


def cosmos_container():
    return _cosmos_db().get_container_client(CONTAINER)


def packages_container():
    return _cosmos_db().get_container_client(PACKAGES)


def upsert_docs(docs: list[dict[str, Any]]) -> int:
    container = cosmos_container()
    for doc in docs:
        container.upsert_item(doc)
    return len(docs)


def query_docs(sql: str, params: list[dict] | None = None) -> list[dict[str, Any]]:
    container = cosmos_container()
    return list(
        container.query_items(
            query=sql,
            parameters=params or [],
            enable_cross_partition_query=True,
        )
    )


def get_doc(item_id: str, pk: str) -> dict[str, Any] | None:
    try:
        container = cosmos_container()
        return container.read_item(item=item_id, partition_key=pk)
    except Exception:
        return None


def replace_doc(doc: dict[str, Any]) -> dict[str, Any]:
    container = cosmos_container()
    return container.replace_item(item=doc["id"], body=doc)


def package_id(ta_id: str, canonical: str) -> str:
    return f"{ta_id}-{canonical}"


def get_package(canonical: str, ta_id: str = "TA-2027") -> dict[str, Any] | None:
    try:
        return packages_container().read_item(item=package_id(ta_id, canonical), partition_key=ta_id)
    except Exception:
        return None


def upsert_package(doc: dict[str, Any]) -> dict[str, Any]:
    return packages_container().upsert_item(doc)


def list_packages(ta_id: str = "TA-2027") -> list[dict[str, Any]]:
    return list(
        packages_container().query_items(
            query="SELECT * FROM c WHERE c.taId = @ta",
            parameters=[{"name": "@ta", "value": ta_id}],
        )
    )


def delete_packages(ta_id: str = "TA-2027") -> int:
    container = packages_container()
    removed = 0
    for doc in list_packages(ta_id):
        try:
            container.delete_item(item=doc["id"], partition_key=ta_id)
            removed += 1
        except Exception:
            continue
    return removed


def delete_tag_map() -> int:
    container = cosmos_container()
    removed = 0
    for doc in query_docs("SELECT c.id, c.tagCanonical FROM c"):
        pk = doc.get("tagCanonical")
        if not pk:
            continue
        try:
            container.delete_item(item=doc["id"], partition_key=pk)
            removed += 1
        except Exception:
            continue
    return removed


def reset_mapping_doc(doc: dict[str, Any]) -> dict[str, Any]:
    variants = [doc.get("sap") or {}, doc.get("pi") or {}, doc.get("dwg") or {}]
    doc["aliases"] = []
    doc["reviewedBy"] = None
    doc["reviewedAt"] = None
    doc["reviewNote"] = None
    doc["overallStatus"] = "mapped" if all(v.get("status") == "mapped" for v in variants) else "review"
    confs = [float(v.get("confidence") or 0) for v in variants]
    doc["overallConfidence"] = round(min(confs) if confs else 0.0, 2)
    doc["flags"] = [v["rule"] for v in variants if v.get("rule") and v["rule"] != "exact_formula"]
    return doc


def reset_unmatched_doc(doc: dict[str, Any]) -> dict[str, Any]:
    doc["status"] = "open"
    doc["reviewedBy"] = None
    doc["reviewedAt"] = None
    doc["reviewNote"] = None
    doc.pop("llmSuggestion", None)
    return doc


def reset_tag_map_in_place() -> int:
    reset = 0
    for doc in query_docs("SELECT * FROM c"):
        kind = doc.get("docType")
        if kind == "mapping":
            reset_mapping_doc(doc)
        elif kind == "unmatched":
            reset_unmatched_doc(doc)
        else:
            continue
        replace_doc(doc)
        reset += 1
    return reset


def _can_rebuild_recon() -> bool:
    from apps.api.recon import DATA

    return (DATA / "sensor_daily.parquet").exists() or (DATA / "sensor_daily.csv").exists()


def reset_demo(ta_id: str = "TA-2027") -> dict[str, Any]:
    from apps.api.recon import build_recon_docs, summary

    packages_removed = delete_packages(ta_id)
    if _can_rebuild_recon():
        docs = build_recon_docs()
        mappings_removed = delete_tag_map()
        restored = upsert_docs(docs)
        stats = summary(docs)
        mode = "rebuild"
    else:
        mappings_removed = 0
        restored = reset_tag_map_in_place()
        stats = summary(query_docs("SELECT * FROM c"))
        mode = "inplace"
    return {
        "ok": True,
        "mode": mode,
        "packagesRemoved": packages_removed,
        "mappingsRemoved": mappings_removed,
        "mappingsRestored": restored,
        **stats,
    }

