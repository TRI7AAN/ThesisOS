# Implementation Plan — ACTIVE

> This file contains ONLY the current phase's exact tasks. When every acceptance
> criterion below is met, **stop** and tell Tilak — don't roll into the next phase
> silently. Once he confirms, replace this file's entire content with the next phase's
> tasks pulled from `roadmap.md`. Do not append to this file across phases; git history
> is the log, this file is only ever "what's happening right now."

## Current phase: Phase 0 — Repo scaffold

### Task 1: Docker Compose skeleton

- `docker-compose.yml` with three services: `backend` (FastAPI), `neo4j` (5.x,
  official image), `grobid` (official GROBID image)
- Neo4j exposed on the standard bolt port, credentials via `.env`, not hardcoded
- Acceptance: `docker compose up` brings up all three services; `docker compose logs`
  shows no crash loops

### Task 2: Neo4j schema bootstrap

- One script (`scripts/bootstrap_schema.py` or a `.cypher` file run on startup) that
  creates the constraints and vector indexes from `wiki/03-graph-schema.md`
- Idempotent — safe to run twice, uses `IF NOT EXISTS`
- Acceptance: running it twice in a row produces no errors; querying
  `SHOW VECTOR INDEXES` shows both `chunk_embeddings` and `concept_embeddings`

### Task 3: FastAPI skeleton

- Project structure: `app/main.py`, `app/routers/`, `app/models/`, `app/db.py`
  (Neo4j driver connection, single shared driver instance, not one connection per
  request)
- One real endpoint: `GET /health` returning service status + Neo4j connectivity check
- Acceptance: `GET /health` returns 200 with Neo4j reachable, 503 with a clear message
  if Neo4j is down — this is the first real test of the "no silent failure" rule in
  `AGENTS.md`, get it right here

### Task 4: React frontend skeleton

- Vite + TypeScript + Tailwind configured with the design tokens from
  `wiki/05-frontend-design.md` (colors, fonts loaded, not yet applied to real
  components)
- Empty three-pane shell (library sidebar / graph canvas area / detail panel) — static
  layout, no data, no Cytoscape yet
- Acceptance: `npm run dev` shows the three-pane shell at `paper` background with the
  correct fonts loading, responsive down to a reasonable mobile width for the sidebar

### Explicitly not in this phase

No ingestion logic, no GROBID calls from the backend yet, no graph queries beyond the
health check, no Cytoscape integration. Task 1–4 above is the entire scope of Phase 0.
If you find yourself writing ingestion code while doing this phase, stop — that's
Phase 1, not now.
