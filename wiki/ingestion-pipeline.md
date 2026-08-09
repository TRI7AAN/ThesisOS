# Ingestion Pipeline

## Why GROBID and not a generic PDF-to-text library

Academic PDFs have structure a generic extractor throws away: section boundaries,
reference lists, author affiliations, in-text citation markers. GROBID is trained
specifically on scholarly documents and returns structured TEI XML with that structure
intact — references come out as a parsed bibliography, not a wall of text you have to
regex apart. This is the single highest-leverage tooling decision in the pipeline;
don't swap it for `pypdf`/`unstructured` to save setup time.

## Pipeline steps

1. **Upload** — PDF hits `POST /papers/upload` (see `06-api-contracts.md`)
2. **GROBID parse** — backend sends the PDF to the GROBID container, gets back TEI XML:
   title, abstract, authors, section text, parsed reference list
3. **Chunking** — split section text into chunks (target ~500 tokens, split on
   paragraph boundaries where possible, not mid-sentence)
4. **Embedding** — each chunk embedded via Gemini's embedding endpoint
5. **Entity/concept extraction** — one Gemini call per chunk (or batched, if the API
   supports it cleanly) extracting candidate concepts as short canonical phrases, not
   full sentences
6. **Concept dedup** — each candidate concept resolved against existing `Concept`
   nodes per the strategy in `03-graph-schema.md`
7. **Graph write** — `Paper`, `Author`, `Chunk` nodes written with `owner_id`;
   `Concept` nodes written/merged into the shared layer; `DISCUSSES` and `CITES`
   relationships created. This step runs inside a single Neo4j transaction per paper —
   if any part fails, the whole paper's write rolls back rather than leaving a half-
   ingested `Paper` node with no chunks.

## Failure modes to handle explicitly, not silently swallow

- **GROBID fails to parse** (corrupted PDF, scanned image with no text layer, non-
  standard layout) — surface a clear error to the user ("couldn't extract text from
  this PDF") rather than silently ingesting an empty paper.
- **LLM extraction returns garbage** (hallucinated concepts, malformed JSON) — validate
  the LLM response against a strict schema before it touches Neo4j; on validation
  failure, retry once, then fail that chunk visibly rather than writing junk.
- **Embedding API timeout** — retry with backoff; if it still fails, fail the paper's
  ingestion cleanly rather than writing chunks with no embedding (they'd be invisible
  to search anyway, and silently broken is worse than visibly failed).
- **Duplicate paper** (same DOI, different user) — resolve to the existing `Paper`
  node for citation-graph purposes; still create a private `OWNS` edge so the new
  user's content access works correctly.

## What NOT to build in Phase 1

- No async job queue for ingestion — runs synchronously in the request. This is a real
  corner being cut deliberately: mark the ingestion endpoint with a `# ponytail:`
  comment noting the ceiling (large PDFs will block the request) and the upgrade path
  (move to a background task/queue once upload volume or PDF size makes this a real
  problem, not before).
- No batch upload UI — one PDF per upload call in Phase 1.
