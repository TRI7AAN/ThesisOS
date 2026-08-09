# Architecture

## Services

| Service | Role | Notes |
|---|---|---|
| React frontend | Library view, search, graph canvas | Talks only to the FastAPI backend |
| FastAPI backend | API, orchestrates ingestion, owns Neo4j access | Single service in Phase 1 — don't split into microservices yet, there's no load reason to |
| Neo4j 5.x | Graph store + native vector index | One database; per-user isolation is enforced at the query layer via `owner_id`, not via separate databases |
| GROBID | PDF → structured XML (text, sections, references, authors) | Runs as its own Docker container, called over HTTP by the backend |
| Gemini API | Entity/concept extraction, embeddings, concept-merge tie-breaks | External; backend is the only caller |

```
 ┌────────────┐      REST       ┌──────────────┐
 │   React    │ ───────────────▶│   FastAPI    │
 │  frontend  │◀─────────────── │   backend    │
 └────────────┘                  └──────┬───────┘
                                         │
                     ┌───────────────────┼───────────────────┐
                     ▼                   ▼                   ▼
               ┌───────────┐      ┌────────────┐      ┌────────────┐
               │  GROBID   │      │  Gemini    │      │   Neo4j    │
               │ (Docker)  │      │    API     │      │  5.x + VI  │
               └───────────┘      └────────────┘      └────────────┘
```

## Data flow (ingestion, high level)

Upload PDF → backend streams to GROBID → structured XML back → backend chunks text →
Gemini extracts entities/concepts per chunk → concept dedup pass (vector similarity
against existing `Concept` nodes, Gemini tie-break on ambiguous matches) → write
`Paper`, `Author`, `Concept`, `Chunk` nodes and relationships to Neo4j → embeddings
stored on `Chunk` nodes via the native vector index.

Full detail in `04-ingestion-pipeline.md`.

## Deployment — not yet decided

No production deployment target is locked in. Phase 1 development target is local
Docker Compose (FastAPI + Neo4j + GROBID containers). Don't build cloud-specific code
(no hardcoded S3 paths, no provider-specific SDKs) until this is decided — flag it in
implementationplan.md when it becomes a real blocker, not before.

## What NOT to build yet

- No message queue / async task runner — ingestion runs synchronously in Phase 1.
  If upload latency becomes a real problem, that's a Phase 3 hardening task, not now.
- No caching layer beyond what Neo4j and the vector index already give you for free.
- No API gateway, no service mesh — one backend service, don't over-architect this.
