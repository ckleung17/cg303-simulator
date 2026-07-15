# Technical architecture

## Decision summary

Use a static browser application with HTML, CSS, JavaScript, data and SVG assets
in separate folders. Keep a headless domain engine at the centre.

```text
Authored content + seeded generator
               |
               v
       validated Scenario
               |
               v
      headless SimulationEngine
       /          |           \
 readings     safety state   event log
       \          |           /
               v
        scoring/feedback
               |
               v
 HTML UI + JS controllers + SVG workbench + accessible controls
```

## Repository structure

`index.html` owns the app shell; `pages/` owns other HTML; `css/` owns
presentation; `js/` owns behaviour and domain rules; `data/` owns authored
learning content; `assets/` owns artwork; and `tests/` owns verification. Avoid
inline styles, inline event handlers and long HTML strings in JavaScript.

## Responsive interaction model

Use mobile-first CSS. At phone widths, present the circuit, instruments,
documents and notebook as switchable panels rather than squeezing them into
columns. Tablets may use two panels and larger screens the full workbench. Keep
learner state intact when orientation or layout changes.

Terminals must support direct touch and an accessible sequence: select an
instrument lead, then select a labelled terminal from the diagram or a terminal
list. Drag-and-drop must never be the only measurement method. Apply safe-area
padding with `env(safe-area-inset-*)` and avoid controls that browser chrome or
the on-screen keyboard can obscure.

## Proposed modules

### `domain`

Pure types and rules for conductors, nodes, terminals, circuits, supplies,
protective devices, instruments, faults, operating/isolation state and actions.
No React imports, browser storage or display strings.

### `simulation`

Builds effective topology from the base circuit plus fault modifiers and returns
measurements with units, resolution, tolerances and validity/safety metadata.
The initial model may use rule-based electrical calculations, but its limits
must be documented.

### `scenarios`

Validated authored templates, seeded generation, compatibility constraints and
scenario migration/versioning. Random generation selects only from declared
compatible combinations and runs a solvability validator.

### `workflow`

State machine for communication, risk controls, isolation, diagnostic testing,
correction, verification and restoration. Actions produce an append-only event
log suitable for replay and scoring.

### `assessment`

Versioned scoring policies and feedback derived from events and scenario truth.
It should support safety-critical gates without coupling policy to UI screens.

### `ui`

DOM adapters, SVG workbench composition, terminal targeting, instrument panels,
documents, notes and feedback. All graphical actions need accessible non-drag
equivalents.

### `persistence`

Local settings, progress and portable attempt exports. Persist scenario seed,
content version, engine version and scoring-policy version with each attempt.

## Core data contracts

Names are illustrative and should be refined before implementation:

```ts
type Scenario = {
  id: string;
  seed: string;
  rulesetVersion: string;
  installation: Installation;
  graph: CircuitGraph;
  hiddenFaults: Fault[];
  availableTools: InstrumentId[];
  documents: ScenarioDocument[];
  expectedEvidence: EvidenceRule[];
  curriculumTags: CurriculumTags;
};

type LearnerAction =
  | SafetyAction
  | CommunicationAction
  | InspectAction
  | MeasureAction
  | DiagnoseAction
  | CorrectAction
  | VerifyAction
  | RestoreAction;

type Measurement = {
  quantity: Quantity;
  value?: number;
  unit: Unit;
  display: string;
  validity: "valid" | "invalid-setup" | "out-of-range";
  safety: "permitted" | "unsafe" | "requires-justification";
  rationaleCode: string;
};
```

Do not expose hidden faults to the normal UI state tree or browser accessibility
labels. Development/debug tools must be disabled in exam-style mode and release
builds as appropriate.

## Determinism and versions

A seed is insufficient on its own: replay also requires generator/content,
engine and scoring versions. Avoid ambient randomness and time-dependent rules.

## Validation layers

1. Schema validation: required fields, references and units.
2. Compatibility validation: fault applies to topology and available tests.
3. Physical/rule validation: baseline and faulted readings are coherent.
4. Solvability validation: available evidence can discriminate the accepted
   diagnosis without requiring unsafe action.
5. Pedagogical validation: appropriate difficulty and curriculum coverage.
6. Human subject-matter review before “validated” status.

## Testing strategy

- Property-based tests for generated-scenario invariants.
- Golden tests for reviewed circuits and expected measurements.
- Unit tests for instrument validity, safety states and scoring rules.
- State-machine tests for isolation and restoration sequences.
- Browser tests for a small number of complete learner journeys.
- Responsive tests at representative phone portrait/landscape and tablet
  viewports, including touch-style terminal and instrument interaction.
- Automated accessibility checks plus manual keyboard review.

Visual snapshots alone are not evidence that the electrical simulation is
correct.
