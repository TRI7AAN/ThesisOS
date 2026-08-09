# Product Requirement Document (PRD)

## Vision

ThesisOS is a knowledge-graph-native research platform. A researcher uploads their PDF
library and gets a semantically searchable, visually explorable graph of their own
papers — with a shared, cross-user concept and citation layer that later powers
autonomous literature-review agents (contradiction detection, gap analysis) with more
signal than any single user's library alone could provide.

## Who it's for

A product intended to ship to other researchers and students — not a personal tool.
This shapes every architecture decision below: multi-tenancy, access control, and
onboarding all have to work for a stranger, not just for Tilak.

## Data isolation model — hybrid (locked decision)

- **Private layer**: `Paper` nodes and their full text/chunks are owned by a `User` and
  never readable by other users.
- **Shared public layer**: `Concept` and citation-graph structure (which paper cites
  which) are shared across all users, deduplicated so the same concept named
  differently across two users' papers resolves to one node.
- This shared concept/citation layer is the "Open Knowledge Fabric" — the substrate
  Phase 2 agents read and write against. A paper uploaded by one user can surface as
  contradicting a concept a different user's paper established, because the concept
  node is shared, not siloed.

## MVP wedge — Phase 1: Knowledge Graph Core

Ship first, agents later:

1. PDF ingestion via GROBID (see `04-ingestion-pipeline.md`)
2. Entity/concept extraction + cross-user concept deduplication
3. Neo4j graph construction (see `03-graph-schema.md`)
4. Vector embeddings + RAG semantic search over a user's own library
5. React frontend: library view, search, graph visualization

## Explicitly deferred to Phase 2

The LangGraph 6-agent literature review pipeline: contradiction detection, gap
analysis, synthesis, structured report generation. (Ingestion and entity extraction are
built once in Phase 1 and reused as agent nodes later — not rebuilt.) See
`07-phase2-agents-reference.md`.

## Explicitly out of scope for v1

- Structured report generation
- Cross-institution graph federation
- Real-time collaborative graph editing
- Anything not listed in the Phase 1 wedge above — if it's not in this doc or in
  `implementationplan.md`, it doesn't get built yet, no matter how small it looks.
