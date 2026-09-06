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

