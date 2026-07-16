/**
 * Agent corpus ingest — run whenever agent-corpus/*.md changes:
 *
 *   OPENAI_API_KEY=sk-... npm run agent:ingest
 *
 * Reads the corpus docs, chunks them by section, embeds each chunk with
 * text-embedding-3-small, and writes server/agent/corpus-index.json (committed to the
 * repo so deploys don't need an ingest step).
 */

import { readFile, writeFile } from "fs/promises";
import path from "path";

const EMBEDDING_MODEL = "text-embedding-3-small";
const CORPUS_DIR = "agent-corpus";
const OUT_FILE = "server/agent/corpus-index.json";

/** Docs to ingest → short source-chip label. (05/06 are agent instructions, not knowledge.) */
const DOCS: Record<string, string> = {
  "01-career-narrative.md": "career",
  "02-case-studies.md": "case studies",
  "03-faq-logistics.md": "faq",
  "04-philosophy-working-style.md": "philosophy",
  "07-resume.md": "cv",
};

type Chunk = { source: string; heading: string; text: string; embedding?: number[] };

function chunkDoc(label: string, content: string): Chunk[] {
  const chunks: Chunk[] = [];
  // Split on markdown H2 sections; keep doc preamble if it carries content.
  const sections = content.split(/^## /m);
  for (const [i, raw] of sections.entries()) {
    const section = raw.trim();
    if (!section) continue;
    const heading = i === 0 ? "intro" : section.split("\n")[0].trim();
    let body = i === 0 ? section : section.split("\n").slice(1).join("\n").trim();
    // Drop template scaffolding lines and unanswered prompts.
    body = body
      .split("\n")
      .filter((l) => !/^\[answer\]\s*$/.test(l.trim()))
      .join("\n")
      .trim();
    if (i === 0) continue; // doc preambles are instructions to Rohit, not knowledge
    if (body.length < 40) continue;
    chunks.push({ source: label, heading, text: body });
  }
  return chunks;
}

async function embedAll(texts: string[], apiKey: string): Promise<number[][]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: texts }),
  });
  if (!res.ok) {
    throw new Error(`Embedding request failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return data.data
    .sort((a: any, b: any) => a.index - b.index)
    .map((d: any) => d.embedding as number[]);
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is required. Usage: OPENAI_API_KEY=sk-... npm run agent:ingest");
    process.exit(1);
  }

  const chunks: Chunk[] = [];
  for (const [file, label] of Object.entries(DOCS)) {
    const content = await readFile(path.join(CORPUS_DIR, file), "utf-8");
    const docChunks = chunkDoc(label, content);
    console.log(`${file}: ${docChunks.length} chunks`);
    chunks.push(...docChunks);
  }

  console.log(`Embedding ${chunks.length} chunks with ${EMBEDDING_MODEL}...`);
  const embeddings = await embedAll(
    chunks.map((c) => `${c.source} — ${c.heading}\n\n${c.text}`),
    apiKey
  );
  chunks.forEach((c, i) => (c.embedding = embeddings[i]));

  const index = {
    model: EMBEDDING_MODEL,
    createdAt: new Date().toISOString(),
    chunks,
  };
  await writeFile(OUT_FILE, JSON.stringify(index));
  console.log(`Wrote ${OUT_FILE} (${chunks.length} chunks). Commit this file.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
