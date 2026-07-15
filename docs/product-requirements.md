# Product requirements

## Purpose

Help a Level 3 learner rehearse the complete process of electrical fault
diagnosis: gather information, work safely, test logically, interpret evidence,
recommend action, verify and report.

## Users

- Primary: learners preparing for the 2365-03 Unit 303 knowledge and practical
  assessments.
- Secondary: tutors demonstrating diagnostic reasoning and reviewing attempts.
- Maintainers: developers and electrical subject-matter reviewers authoring and
  validating simulation content.

## Learning modes

### Guided

Offers staged hints, instrument explanations and feedback after each meaningful
action. It should explain why evidence supports or contradicts a hypothesis.

### Practice

Provides minimal prompting and a structured report after completion. A learner
may repeat a scenario using its seed.

### Exam-style

Uses original timed scenarios, no instructional hints and delayed feedback. It
must be described as exam preparation, never an official mock or prediction of
live assessment content.

## Functional requirements

### Scenario setup

- Select or generate installation, supply, earthing arrangement, circuit,
  accessories, operating state, complaint and hidden fault.
- Support curated scenarios and compatible seeded random generation.
- Present circuit schedules, diagrams, certificates/history and customer
  information appropriate to the scenario.
- Guarantee a unique defensible diagnosis or explicitly allow multiple accepted
  diagnoses with evidence rules.

### Workbench

- Display a graphical circuit and accessible equivalent connection list.
- Allow inspection of accessories and terminal identification.
- Support tool selection, range/function selection and probe placement.
- Provide keyboard alternatives for every pointer/drag operation.
- Calculate readings from topology, parameters, state and fault modifiers.

### Safety workflow

- Represent permission/communication, risk controls, isolation, lock-off,
  warning notices, proving the indicator, dead confirmation and re-proving.
- Prevent physically impossible actions and record unsafe attempted actions.
- Require a deliberate justification for any simulated live test.
- Handle sensitive loads, alternate energy sources and restoration state.

### Diagnosis and rectification

- Let learners record hypotheses and select the next discriminating test.
- Capture diagnosis with supporting evidence.
- Ask for a recommended correction, considering repair/replacement constraints.
- Require appropriate verification and functional testing before restoration.
- Produce a clear work/report summary.

### Assessment and feedback

- Score safety, information gathering, test selection, sequence, interpretation,
  diagnosis, correction, verification, restoration and communication.
- Use safety gates: defined critical actions can stop a scenario or cap a score.
- Score the reasoning path, not only the final fault label.
- Show curriculum coverage by outcome, circuit, fault, tool and test.
- Keep scoring rules versioned and testable outside the UI.

## Non-functional requirements

- Deterministic replay from scenario seed plus content/ruleset version.
- Offline operation after first load where feasible.
- No account required for core practice.
- Responsive on typical student laptops and tablets.
- Fully usable on current iPhone and Android phone browsers in portrait and
  landscape, as well as common iPad and Android tablet sizes.
- Touch-first controls of at least 44 by 44 CSS pixels, with no feature dependent
  on hover, right-click, multi-touch or precise drag-and-drop.
- Respect display cut-outs and safe-area insets, browser zoom, text enlargement,
  orientation changes and the on-screen keyboard.
- WCAG-oriented semantic and keyboard-accessible interaction.
- Fast startup and no backend dependency for the initial release.
- Local progress export/import should be considered before cloud storage.

## Non-goals for the initial release

- Real-time physical circuit modelling at component/transient level.
- Certification, competence assessment or replacement of supervised practice.
- Multi-user classes, cloud accounts or tutor dashboards.
- Reproducing the visual layout or wording of protected assessments.
- Instructions for unsupervised work on energised real installations.

## Initial vertical-slice acceptance criteria

Given a seeded single-phase radial circuit with one compatible hidden fault:

1. The same seed and ruleset always recreate the same scenario.
2. The displayed symptom and every reading agree with the circuit state.
3. At least two plausible hypotheses exist initially, and a logical test can
   discriminate between them.
4. Unsafe instrument functions or isolation sequences receive explicit handling.
5. Correct diagnosis alone cannot earn full marks without safe procedure and
   verification.
6. The complete path is operable by keyboard.
7. The complete path is operable by touch at phone and tablet viewport sizes,
   using a selection-based alternative wherever probe dragging is offered.
8. The report identifies evidence, errors and covered Unit 303 outcomes.
