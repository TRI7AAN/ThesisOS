# Graph Schema

## Node labels

| Label | Owned by | Properties |
|---|---|---|
| `User` | — | `id`, `email`, `created_at` |
| `Paper` | private, via `owner_id` | `id`, `owner_id`, `title`, `abstract`, `doi`, `year`, `raw_grobid_xml_ref`, `created_at` |
| `Author` | shared | `id`, `name`, `normalized_name` (for dedup) |
| `Chunk` | private, inherits owner from parent `Paper` | `id`, `paper_id`, `owner_id`, `text`, `embedding` (vector, indexed), `section` |
| `Concept` | **shared public layer** | `id`, `canonical_name`, `aliases` (list), `embedding` (vector, indexed), `merged_from` (list of superseded concept ids, if any) |

## Relationships

```
(:User)-[:OWNS]->(:Paper)
(:Paper)-[:AUTHORED_BY]->(:Author)
(:Paper)-[:CITES]->(:Paper)
(:Paper)-[:HAS_CHUNK]->(:Chunk)
(:Chunk)-[:DISCUSSES]->(:Concept)
(:Concept)-[:RELATED_TO {weight: float}]->(:Concept)
```

`CITES` can cross owner boundaries — citation structure is public even when paper
content isn't. If Paper A (User 1) cites Paper B, and User 2 later uploads Paper B
separately, the ingestion pipeline resolves to the same `Paper` node via DOI match
where possible, not a duplicate.

## Access control — enforced at the query layer, not the frontend

Every Cypher query touching `Paper` or `Chunk` content **must** filter on
`owner_id = $current_user_id`. Queries touching `Concept` or the citation graph
structure (paper-to-paper `CITES` edges, without content) do not filter by owner —
that's the shared layer by design. Never let a query implicitly leak `Chunk.text` or
`Paper.abstract` across owner boundaries because a join happened to touch a shared
`Concept` node along the way — check this explicitly in every query that traverses
from `Concept` back out to `Chunk`/`Paper`.

## Vector index (native Neo4j 5.x, no separate vector DB)

```cypher
CREATE VECTOR INDEX chunk_embeddings IF NOT EXISTS
FOR (c:Chunk) ON (c.embedding)
OPTIONS { indexConfig: {
  `vector.dimensions`: 768,
  `vector.similarity_function`: 'cosine'
}};

CREATE VECTOR INDEX concept_embeddings IF NOT EXISTS
FOR (c:Concept) ON (c.embedding)
OPTIONS { indexConfig: {
  `vector.dimensions`: 768,
  `vector.similarity_function`: 'cosine'
}};
```

Dimension count (768) assumes Gemini's embedding model — confirm against the actual
model chosen in `04-ingestion-pipeline.md` before running this in a real environment;
update this file if it changes, don't let the two docs drift.

## Concept deduplication strategy

1. New concept extracted from a chunk → embed it.
2. Vector similarity search against existing `Concept` nodes (top-k, cosine).
3. If top match similarity is above a high-confidence threshold → merge automatically,
   append the new name to `aliases`.
4. If similarity is in an ambiguous middle band → one Gemini call to confirm same-vs-
   different concept (cheap, only runs on the ambiguous band, not every extraction).
5. Below threshold → create a new `Concept` node.

Exact threshold values aren't locked yet — they get tuned empirically once there's a
real corpus to test dedup precision/recall against. Don't hardcode a "final" number in
Phase 1; keep it as a named constant with a `# ponytail:` comment noting it's
untuned.
