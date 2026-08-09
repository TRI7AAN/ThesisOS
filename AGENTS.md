# AGENTS.md — ThesisOS Coding Agent Instructions

You are working on ThesisOS, a knowledge-graph-native research platform. This file is
read first, every session, before you touch code. It does not change per phase — if you
think a rule here is wrong, say so to Tilak, don't quietly override it.

## Read order, every session

1. **This file** — non-negotiable rules, read in full
2. **wiki/00-index.md** — map of the project and its docs
3. **implementationplan.md** — the ONLY doc that tells you what to build *today*
4. Whichever `wiki/*.md` doc covers the module you're touching

`roadmap.md` tells you where the project is going. `implementationplan.md` tells you what
to do right now. Never start writing code from the roadmap directly — always resolve
today's task through implementationplan.md first, even if you remember the roadmap.

## Code philosophy: lean, not lazy

Write the least code that correctly solves the problem in front of you — not the least
code that merely looks done. Being lean is not permission to skip rigor.

**Stay fully rigorous on these, no exceptions, no matter how small the task looks:**

- Understand the problem before writing anything — trace the actual data flow through
  this system, don't pattern-match to a shape you've seen before. A diff you can't
  explain line-by-line is not a shortcut, it's a liability.
- Input validation at every trust boundary: anything crossing the API, anything parsed
  out of an uploaded PDF, anything returned by an LLM call (LLM output is untrusted
  input — validate it before it touches Neo4j).
- Error handling that prevents data loss: partial ingestion failures must not leave
  half-written graph state; Neo4j writes that fail mid-transaction must roll back
  cleanly; embedding/LLM API timeouts must not silently drop a paper.
- Security: parameterize every Cypher query, never string-concatenate user input into
  a query. Enforce the private/public boundary from wiki/03-graph-schema.md at the
  query layer, not just in the frontend.
- Accessibility on every frontend component — keyboard nav, visible focus states,
  reduced-motion respected. Not optional, not a later pass.
- Real-world calibration: PDFs are messy, GROBID output is imperfect, LLM extraction
  hallucinates sometimes. Code for that reality, not the happy path.
- Anything the current implementationplan.md task explicitly asks for, verbatim.

**Cut real corners deliberately, never accidentally.** If you take a shortcut with a
known ceiling — an in-memory cache instead of a real one, a linear scan instead of an
index, a single global lock — mark it inline with a `# ponytail:` comment naming the
ceiling and the upgrade path. Example:

```python
# ponytail: linear scan for concept dedup, fine under ~5k concepts,
# switch to the Neo4j vector index similarity query past that
```

Don't build for scale the project doesn't have yet. No config system for a value used
once. No abstraction layer for a second implementation that doesn't exist yet. No
premature generalization "for future flexibility" — flexibility you're not using yet
is just unread code.

**Every non-trivial piece of logic leaves one runnable check behind** — an assert-based
self-check or a small standalone test file. No test framework, no fixtures, no mocking
scaffolding at this project size; one file that fails when the logic breaks is enough.
Trivial one-liners need no test.

**No AI slop, specifically:**
- No unused abstractions "for future flexibility"
- No comment that just restates what the code already says
- No `except Exception: pass` — either handle it or let it surface
- No function that takes a bag of optional flags instead of being two functions
- No new dependency for something 15 lines of stdlib already does
- No mock data left in a code path that's supposed to hit a real service

## Stack — do not deviate without updating wiki/02-architecture.md first

- Backend: Python 3.12, FastAPI, Pydantic v2
- Graph DB: Neo4j 5.x — native vector index, no separate vector database
- PDF parsing: GROBID (dockerized service, not a generic PDF-to-text library)
- LLM: Gemini API — entity/concept extraction, concept-merge tie-breaks, embeddings
- Agent framework (Phase 2 only, not yet active): LangGraph
- Frontend: React + TypeScript + Vite, Tailwind, Cytoscape.js for the graph canvas

## Phase gates

When implementationplan.md's acceptance criteria are met, **stop**. Don't silently
roll into the next phase's work. Tell Tilak the phase is done and wait for him to pull
the next phase's tasks from roadmap.md into implementationplan.md. This is a gate, not
a formality — phase boundaries exist because Tilak reviews before the next phase starts.

## This file also applies to you when you're editing this file

If you're asked to update AGENTS.md itself, the same rules apply to the edit.
