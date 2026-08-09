# API Contracts — Phase 1

Just enough to unblock frontend and backend work in parallel. Request/response bodies
are illustrative, not final Pydantic models — define the real models in code and treat
this table as the contract they must satisfy.

| Endpoint | Method | Purpose | Notes |
|---|---|---|---|
| `/auth/*` | — | Deferred to whatever auth approach is chosen in Phase 1 planning | Not designed yet — flag in implementationplan.md when this becomes the active task |
| `/papers/upload` | POST | Upload a PDF, triggers the ingestion pipeline synchronously | Returns the created `Paper` id + basic metadata once ingestion completes; long-running by design in Phase 1 (see `04-ingestion-pipeline.md`) |
| `/papers` | GET | List the current user's papers | Paginated, owner-scoped |
| `/papers/{id}` | GET | Full metadata + chunk list for one paper | Owner-scoped, 403 if not the owner |
| `/graph/concepts` | GET | Concept graph structure (shared layer) — nodes + edges for the canvas | No owner filter — this is the public layer |
| `/graph/papers/{id}/subgraph` | GET | The concept/citation subgraph anchored on one paper | Owner-scoped for the paper node itself, concept layer is public |
| `/search` | GET | `?q=` semantic search over the current user's chunks | Owner-scoped, uses the vector index |
| `/concepts/{id}/merge` | POST | Manual merge of two concept nodes | Admin/review tool for dedup mistakes, not user-facing in Phase 1 |

Update this table the moment an endpoint's actual shape is decided in code — don't let
it go stale while implementationplan.md tasks reference it.
