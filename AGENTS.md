# Instructions for AI agents

These instructions apply to the entire repository. Read the linked design
documents before changing code or requirements.

## Mission

Create a safe, technically credible browser simulator that helps a learner
prepare for City & Guilds 2365-03 Unit 303. Optimise for learning and diagnostic
reasoning, not game mechanics or visual novelty.

## Source-of-truth order

When documents disagree, use this order and flag the conflict:

1. Maintainer/user instructions in the current task.
2. Published qualification requirements and applicable safety guidance.
3. `docs/product-requirements.md` and `docs/curriculum-map.md`.
4. `docs/scenario-specification.md`.
5. `docs/architecture.md` and architecture decision records.
6. Existing implementation and tests.

Do not silently change educational or electrical assumptions to make an
implementation easier.

## Mandatory constraints

- Do not claim that the simulator confers competence, certification or a pass.
- Do not copy, reconstruct or solicit live/protected assessment questions.
- Keep all questions and scenarios original and map them to published outcomes.
- Model unsafe actions explicitly; never reward unsafe shortcuts.
- Treat safe isolation, instrument suitability and post-work verification as
  first-class workflow states.
- Never present simulated readings as instructions to work live in the real
  world.
- Use UK terminology and configurable BS 7671-era assumptions. Record the
  assumed standard/version with authored content rather than scattering it in
  UI strings.
- Keep scenario generation deterministic when supplied with a seed.
- A generated scenario must be solvable, internally consistent and compatible
  with its circuit, supply, accessories and instruments.
- Separate domain rules from UI modules. UI code must not invent readings
  or decide the hidden fault.
- Preserve accessibility: semantic controls, keyboard operation, visible focus,
  non-colour status cues and text alternatives for diagrams.
- Design mobile-first for current iPhone, Android phone and tablet browsers.
  Do not require hover, right-click, precision pointing or drag-only interaction.
- Keep primary touch targets at least 44 by 44 CSS pixels and account for safe
  areas, browser chrome, orientation changes and on-screen keyboards.

## Preferred stack and file separation

- Semantic HTML in `.html` files; do not generate the full interface in JavaScript.
- Modular CSS in `css/`; do not put presentation rules in HTML or JavaScript.
- JavaScript ES modules in `js/`, using JSDoc and `// @ts-check`.
- Standalone SVG artwork in `assets/svg/`.
- No UI framework for the first vertical slice.
- Vitest for domain/unit tests and Playwright for critical learner journeys.
- Static hosting and offline-capable PWA behaviour where practical.

Adding a backend, Python service, database, analytics provider or heavy diagram
framework requires a recorded architectural decision and a demonstrated need.

## Change workflow

Before editing:

1. Identify the affected requirement and curriculum outcome.
2. State electrical assumptions and safety implications.
3. Inspect existing tests and preserve unrelated work.

When editing:

1. Update types/domain rules before UI behaviour.
2. Add deterministic tests for every new fault or measurement rule.
3. Include tests for invalid combinations and unsafe actions.
4. Update the relevant documentation in the same change.
5. Update both `docs/simulator-specification.md` and
   `docs/operation-manual.md` whenever behaviour visible to learners or
   maintainers changes. A feature amendment is incomplete without this update.
6. Treat the Markdown manuals as the source of truth for agents. After changing
   either source, run `python tools/generate_manual_pdfs.py`, render and inspect
   the PDFs, and commit the regenerated user copies under `output/pdf/`.

Before handing off:

1. Run formatting, type checking, unit tests and applicable browser tests.
2. Report what was verified and what was not.
3. List new assumptions, deferred risks and curriculum coverage changes.
4. Do not mark placeholders or visually plausible mock readings as complete
   simulation behaviour.

## Review checklist

- Electrical validity: Are topology, expected readings and fault effects
  credible under the documented assumptions?
- Safety: Does the workflow enforce or correctly score safe isolation, GS38-style
  instrument practice and restoration?
- Pedagogy: Does feedback explain evidence and reasoning without revealing the
  answer prematurely?
- Assessment integrity: Is content original and clearly presented as practice?
- Generator integrity: Can the seed reproduce the scenario? Can invalid or
  ambiguous combinations occur?
- Architecture: Are engine, content, scoring and presentation decoupled?
- Accessibility: Can the task be completed without drag-and-drop, fine pointer
  control or colour perception?
- Responsive behaviour: Are phone portrait, phone landscape and tablet layouts
  usable without clipped controls or horizontal page scrolling?
- Evidence: Do tests prove the new behaviour rather than merely render it?

## Expected handoff format

Summarise changes under: outcome, files changed, tests run, curriculum impact,
assumptions/risks, and recommended next action.
