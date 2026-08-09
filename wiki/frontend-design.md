# Frontend Design

## Brief

Subject: a research workbench where the graph itself is the primary object, not a
decoration on a dashboard. Audience: researchers and students, including people who've
never used a graph-visualization tool before. Job: make an unfamiliar concept (a
personal knowledge graph) feel as approachable as a search bar on day one.

Direction: minimalist, professional, quiet. Nothing about this should look like a
marketing landing page or a flashy AI-product demo — it should look like a tool a
researcher trusts with their actual working library. Open, uncluttered, legible over
decorative.

## Design tokens

**Color** (5 named values, used with restraint):

| Token | Hex | Use |
|---|---|---|
| `paper` | `#FAF9F6` | Background — warm off-white, reads like paper, not clinical white |
| `ink` | `#1C1D1F` | Primary text, graph node borders |
| `graphite` | `#6B6E76` | Secondary text, metadata, inactive UI |
| `citation-blue` | `#2E4B8F` | Single accent — links, citation edges, active states, primary actions |
| `flag-amber` | `#C77D2E` | Reserved exclusively for contradiction/gap flags surfaced by Phase 2 agents — never used decoratively, so when it appears it means something |

Explicitly avoiding the default-AI-design palette: no warm cream + terracotta
combination, no near-black-with-neon-accent. `paper` + `citation-blue` reads as
academic/editorial rather than "AI product."

**Typography** (3 roles):

| Role | Face | Use |
|---|---|---|
| Display | Source Serif 4 | Paper titles, section headers — restrained serif, academic authority without being decorative |
| Body | Inter | UI text, body copy, search results |
| Utility/mono | IBM Plex Mono | Citation counts, DOIs, dates, node IDs — anything that's data rather than prose |

**Layout — three-pane research workbench:**

```
┌─────────────┬──────────────────────────────┬────────────────┐
│   Library    │                                │   Detail panel  │
│   sidebar    │       Graph canvas (main)      │  (paper/concept │
│              │                                │   metadata)     │
│  - search    │   the graph is always present  │                 │
│  - filters   │   even before you've asked      │  empty until    │
│  - paper     │   for it — it's the app's       │  something is   │
│    list      │   default view, not a feature   │  selected       │
│              │   you navigate to               │                 │
└─────────────┴──────────────────────────────┴────────────────┘
```

**Signature element**: the live graph canvas itself, always on screen, not gated
behind a "visualize" button. A first-time user uploads one paper and immediately sees
it appear as a node with its extracted concepts branching off — the graph is the
proof the product works, shown on day one with a single paper, not held back until
the library is large.

## UX principles for beginner-friendliness

- **Progressive disclosure**: a new user sees library + search first; graph
  interactions (filtering by concept, expanding citation chains) are discoverable, not
  front-loaded. Don't explain graph theory in the UI — show, don't lecture.
- **Plain-language empty states**: "Upload your first paper to start building your
  graph," not "No nodes found." Empty states are an invitation to act, written in the
  interface's voice, never apologetic, never vague.
- **Consistent action naming**: the button that says "Upload" produces a toast that
  says "Uploaded" — same verb, start to finish, never "Submit" → "Success."
- **No system-internals language exposed**: a user manages their "library," not their
  "Paper nodes." Cypher, Neo4j, embeddings — none of this vocabulary appears in the UI,
  ever, even in tooltips.
- **Errors name what happened and what to do**: "Couldn't read text from this PDF — try
  a text-based version if you have one," not "Ingestion failed: GROBID 500."

## Quality floor, not optional

Responsive down to mobile for the library/search views (the graph canvas itself can
assume desktop-first — it's fine if it says so and points to a summary list view
instead). Visible keyboard focus on every interactive element. Respect
`prefers-reduced-motion` — no animated graph physics for users who've opted out.

## Component inventory, Phase 1

- Library sidebar (list, search, upload button)
- Upload modal/flow (drag-drop, progress, error states per the failure modes in
  `04-ingestion-pipeline.md`)
- Graph canvas (Cytoscape.js) — node = paper or concept, edge = citation or discusses
- Detail panel (paper metadata view, concept detail view)
- Search results view

Nothing beyond this list in Phase 1 — no settings page, no user profile beyond auth,
no onboarding tour. If it's not in this list or `implementationplan.md`, it's not
Phase 1 frontend work.
