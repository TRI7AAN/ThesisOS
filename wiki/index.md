# ThesisOS Wiki — Index

Start here. This wiki is the living documentation layer a coding agent reads and a
human reviews — not a personal notes archive. Each doc below is authoritative for its
domain; if code and doc disagree, the doc wins until someone deliberately updates it.

| Doc | Covers | Read when |
|---|---|---|
| [prd.md](prd.md) | Vision, target user, MVP boundary, what's explicitly out of scope | Before any new feature decision |
| [architecture.md](architecture.md) | Services, data flow, deployment shape | Before touching cross-service code |
| [graph-schema.md](graph-schema.md) | Neo4j node/relationship schema, vector index, access control | Before any Cypher query or schema change |
| [ingestion-pipeline.md](ingestion-pipeline.md) | PDF → GROBID → extraction → dedup → graph write | Before touching the ingestion path |
| [frontend-design.md](frontend-design.md) | Design tokens, layout, UX principles | Before any UI work |
| [api-contracts.md](api-contracts.md) | Phase 1 REST endpoints | Before backend or frontend API work |
| [phase2-agents-reference.md](phase2-agents-reference.md) | LangGraph 6-agent design — **not active yet** | Only once Phase 2 begins |

Outside `wiki/`:

- **`AGENTS.md`** (repo root) — non-negotiable coding rules, read every session
- **`roadmap.md`** (repo root) — the full end-to-end phase plan
- **`implementationplan.md`** (repo root) — only the current phase's exact tasks; this
- **`logs.md`** (repo root) — after each coding session is done changes made in the codebase must be logged, read every session before starting next session.
  is the one doc that gets rewritten, not appended to, as phases complete

## How this wiki changes over time

`01`–`07` are living docs — update them when a real decision changes, and note the
change plainly (this isn't a changelog, don't over-engineer it — a one-line edit to the
relevant section is enough). `roadmap.md` changes rarely, only when the phase plan
itself is renegotiated. `implementationplan.md` changes every phase, on purpose.
