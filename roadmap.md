# Roadmap — ThesisOS

This is the full end-to-end plan. It does not tell an agent what to build today — that's
`implementationplan.md`. This doc changes rarely, only when the phase plan itself is
renegotiated with Tilak.

## Phase 0 — Repo scaffold

- Docker Compose: FastAPI backend, Neo4j 5.x, GROBID container, wired together locally
- Neo4j schema bootstrap: constraints + vector indexes from `wiki/03-graph-schema.md`
- Bare FastAPI app with health check, project structure per `wiki/02-architecture.md`
- Bare React + Vite + TypeScript app, Tailwind configured, empty three-pane shell per
  `wiki/05-frontend-design.md`
- No real feature work yet — this phase exists so Phase 1 starts on solid ground

## Phase 1 — Knowledge Graph Core (current phase)

- PDF ingestion pipeline: GROBID parse → chunk → embed → extract → dedup → graph write
- Neo4j schema live: `User`, `Paper`, `Author`, `Chunk`, `Concept` with the
  private/shared hybrid access model enforced at the query layer
- Semantic search over a user's own chunks via the vector index
- Frontend: library sidebar, upload flow, graph canvas (Cytoscape.js), detail panel,
  search results view
- Exit criteria: a user can upload a handful of real papers, see them appear as a
  graph, search semantically across them, and see shared concepts they didn't
  explicitly create connecting to other papers in their library

## Phase 2 — Autonomous Agent Layer

- LangGraph pipeline: contradiction detection, gap analysis, synthesis, structured
  report generation (full design in `wiki/07-phase2-agents-reference.md`)
- Depends on Phase 1's concept dedup being validated against a real corpus first —
  don't start Phase 2 on unproven concept-layer quality
- Report generation UI: request a literature review, watch agent progress, receive a
  structured document

## Phase 3 — Hardening

- Real auth (deferred from Phase 1's API contract stub)
- Rate limiting, request timeouts on the ingestion endpoint (the synchronous-ingestion
  corner cut in Phase 1 gets revisited here if upload volume justifies it)
- Multi-user scale testing on the shared concept layer — dedup precision/recall at
  real scale, not the untuned Phase 1 thresholds
- Deployment target decision + actual deployment (deferred in `wiki/02-architecture.md`)

## Phase 4 — Stretch

- Cross-institution graph federation
- Real-time collaborative graph editing
- Neither is scoped in detail yet — revisit after Phase 3 ships
