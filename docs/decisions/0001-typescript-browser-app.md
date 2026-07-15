# ADR 0001: Separated static browser application

- Status: accepted for initial design
- Date: 2026-07-15

## Context

The product needs interactive diagrams, instrument controls, immediate feedback,
offline/static deployment and deterministic domain logic. Python would require a
browser front end regardless and would introduce a server or a less mature
browser runtime for core features.

## Decision

Use semantic HTML, modular CSS, JavaScript ES modules and standalone SVG assets.
Implement simulation, generation and scoring as headless modules independent of
DOM code. TypeScript may be reconsidered if this separation remains intact.

## Consequences

- The first release can be hosted statically and work without accounts.
- Domain types and UI share compile-time contracts.
- Graphical behaviour still requires explicit accessibility alternatives.
- TypeScript does not guarantee electrical correctness; reviewed fixtures,
  invariants and subject-matter validation remain necessary.
- Python may be introduced later for a justified service such as offline content
  validation or analytics, but is not part of the runtime baseline.

## Reconsider when

- A required solver or validated scientific library cannot reasonably run in
  the browser.
- Multi-user persistence or institutional integrations become an approved
  product requirement.
- Performance measurements show that the selected browser model cannot meet a
  defined requirement.
