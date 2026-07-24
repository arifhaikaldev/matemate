# OS Taxonomy Discussion Summary

## Source
Cloned from `https://github.com/withmarbleapp/os-taxonomy.git` — the **Marble Skill Taxonomy**, an open structured taxonomy of what children learn across primary/elementary years.

## Data Structure (4 JSON files)

### 1. `topics.json` — The Nodes
- **1,590 micro-topics** total, each is a single teachable idea
- **503 Mathematics topics**, split into **12 domains**
- Each topic has: `id`, `type`, `subject`, `domain`, `name`, `description`, `ageRangeStart`, `ageRangeEnd`, `centrality`, `evidence` (3 mastery criteria), `assessmentPrompt`, `standards`

### 2. `dependencies.json` — The Edges
- **3,221 prerequisite edges** forming a directed acyclic graph
- **985 edges** are Mathematics-to-Mathematics (722 hard, 263 soft)
- Each edge: `topicId` → `prerequisiteId`, `strength` (hard/soft), `reason`
- "Hard" = must know first, "Soft" = enriches understanding but not required
- 50 cross-subject edges (math depends on non-math skills like English vocabulary)

### 3. `clusters.json` — Human-Readable Summaries
- **183 clusters** (one per subject + domain + age band)
- Parent-friendly one-paragraph summaries — not part of the graph structure

### 4. `curriculum-standards.json` — Curriculum Tags
- 7 curricula included: `ccss-math`, `ccss-ela`, `uk-nc-2013`, `ngss-k5`, `ngss-ms`, `ib-pyp-pspe`, `c3-social-studies`
- Math topics link to **UK National Curriculum** and **US Common Core**
- Topics can link to 0, 1, or multiple standards

### 5. `manifest.json` — Metadata Only
- Dataset name, version, generation timestamp
- Counts (topics per subject, dependency count, etc.)
- SHA-256 checksums for integrity verification
- Not part of the graph structure

## Mathematics Domains (12)

| Domain | Topics | Age Range |
|---|---|---|
| Counting & Cardinality | 14 | 4–9 |
| Number Representation & Place Value | 52 | 5–14 |
| Addition & Subtraction | 52 | 4–13 |
| Multiplication & Division | 57 | 4–13 |
| Fractions | 67 | 5–13 |
| Ratio & Proportion | 18 | 9–14 |
| Algebra | 25 | 10–14 |
| Geometry | 69 | 4–15 |
| Measurement | 68 | 4–11 |
| Data & Statistics | 18 | 5–14 |
| Probability | 15 | 9–14 |
| Mathematical Thinking | 48 | 5–11 |

## 5 Topic Types

| Type | Purpose |
|---|---|
| CONCEPTUAL | Understanding an idea (e.g., "addition means combining") |
| PROCEDURAL | Executing a skill (e.g., "fluent adding within 5") |
| REPRESENTATIONAL | Using models/diagrams (e.g., "arrays", "bar models") |
| LANGUAGE | Vocabulary/language (e.g., "number words", "reading +, -, = symbols") |
| META | Metacognitive skills (e.g., "choosing the right strategy") — used for Mathematical Thinking domain |

## Key Design Decisions
- **Age ranges, not grades** — avoids tying to any single school system
- **Curriculum-agnostic core** — topics authored independently, then linked to standards
- **Hard + soft prerequisites** — distinguishes blocking from enriching connections
- **Centrality scoring** — identifies most critical topics (e.g., cardinality at 0.97)
- **Assessment prompts with `{{name}}`** — designed for natural conversational assessment

## Most Foundational Topic
- *"How Many in Total?"* (cardinality principle, centrality 0.97) — 9 other topics directly depend on it