# Phase 2 Agent Design — REFERENCE ONLY, NOT ACTIVE

Do not build against this doc until `implementationplan.md` explicitly says Phase 2
has started. This is preserved from the original ThesisOS concept so the design isn't
lost, not a current task list.

## The six sub-agents (LangGraph)

1. **Ingestion agent** — reuses the Phase 1 ingestion pipeline (`04-ingestion-pipeline.md`)
   as a graph node rather than rebuilding it
2. **Entity extraction agent** — reuses Phase 1 extraction logic
3. **Contradiction detection agent** — traverses the shared `Concept` layer to find
   papers (potentially from different users) whose claims about the same concept
   conflict. This is the agent that benefits most from the hybrid data model —
   contradiction signal is stronger with more users' papers touching the same concept
4. **Gap analysis agent** — identifies concepts with sparse connections or one-sided
   citation patterns in the shared graph, suggesting under-explored areas
5. **Synthesis agent** — combines findings from contradiction + gap agents into a
   coherent narrative
6. **Structured report generation agent** — produces the final literature review
   document from the synthesis agent's output

## Why this waits

Contradiction detection and gap analysis are only as good as the shared concept
layer's density and dedup quality. Building these agents before Phase 1's concept
dedup has been validated against a real corpus means building on an unproven
foundation — the dependency runs Phase 1 → Phase 2, not the reverse.
