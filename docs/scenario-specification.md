# Scenario specification

## Composition

A scenario is assembled from compatible layers:

1. Installation and supply assumptions.
2. Circuit topology and protective devices.
3. Accessories, loads and control components.
4. Normal component parameters and operating state.
5. One or more hidden fault modifiers.
6. Complaint, symptoms and supporting documents.
7. Available instruments and site constraints.
8. Accepted evidence, diagnoses, corrections and verification.

Start with single-fault scenarios. Multiple faults must be deliberately authored
or generated only when the validator can prove that the intended evidence and
diagnosis remain unambiguous.

## Initial circuit catalogue

Recommended order:

1. Single-phase radial socket/load circuit.
2. One-way and two-way lighting circuits.
3. Ring final circuit.
4. Fixed high-load radial circuit.
5. Contactor/relay control circuit.
6. Three-phase distribution or motor/control scenario.

Each circuit template declares nodes, terminals, conductors, loads, protective
devices, legal fault insertion points, normal expected readings and diagram
layout hints.

## Fault families

- Open circuit on line, neutral or protective conductor.
- Short circuit and line-to-earth fault.
- Neutral-to-earth fault where its effects can be modelled credibly.
- Insulation deterioration or breakdown.
- Incorrect/reversed connections and polarity.
- Loose or high-resistance termination.
- Excessive load or voltage drop.
- Failed accessory, load, protective device or control component.
- Ring discontinuity and incorrect interconnection on compatible circuits.
- Loss of phase or incorrect sequence on compatible three-phase circuits.

Every fault definition must declare prerequisites, excluded combinations,
affected topology/parameters, observable symptoms, discriminating tests,
accepted correction categories and post-correction tests.

## Instruments and tests

Represent instrument function, lead/terminal setup, range, energisation
requirements, proving/status checks, measurement limitations and safety rules.

Initial functions:

- Two-pole voltage indication and proving.
- Low-resistance continuity.
- Insulation resistance with selectable test voltage.
- Polarity.
- Earth-fault loop impedance and prospective fault current.
- RCD operation.
- Current/voltage measurement.
- Phase sequence when a three-phase scenario is available.
- Functional checks.

An action comprises instrument, function/range, probe terminals, circuit state
and learner justification where required. A reading without this context is not
a valid simulation event.

## Measurement result

Return more than a numeric value:

- Display value, unit and instrument-style resolution.
- Validity and out-of-range/open-circuit representation.
- Whether the setup is safe and appropriate.
- Underlying evidence code for scoring and explanation.
- Optional uncertainty/tolerance appropriate to the model.

Do not add random noise that changes diagnostic meaning. If variation is used,
derive it from the scenario seed and keep readings within reviewed bounds.

## Generation constraints

A generated scenario is publishable only if:

- All references and terminal connections resolve.
- The fault is compatible with the circuit and operating state.
- Complaint and visible symptoms follow from the fault.
- At least one safe available test path establishes the accepted diagnosis.
- No alternative fault in the candidate set produces indistinguishable required
  evidence unless both diagnoses are accepted.
- Required instruments are available and suitable.
- Correction and verification actions exist.
- Difficulty and curriculum tags are accurate.

Failed generation should retry with a bounded attempt count and surface a
developer-visible validation error, never silently fall back to fabricated
readings.

## Difficulty model

Difficulty should arise from reasoning, not hidden interface tricks:

- Beginner: one fault, focused documents, few accessible branches and hints.
- Intermediate: broader circuit, distractor hypotheses and choice of tests.
- Advanced: realistic documentation, site constraints, sensitive equipment or
  deliberately authored interacting symptoms.

## Authored scenario review record

Store alongside content:

```text
status: draft | technically-reviewed | released
author:
technicalReviewer:
reviewedOn:
references:
assumptions:
rulesetVersion:
```
