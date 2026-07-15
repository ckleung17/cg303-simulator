# Contributing

## Principles

Contributions should improve technical credibility, curriculum coverage,
accessibility or learner feedback. A larger catalogue of faults is not useful if
the generated cases are ambiguous or the readings are canned.

## Proposing a change

For meaningful changes, describe:

- The learner problem.
- The Unit 303 outcome or product requirement affected.
- Electrical assumptions and authoritative references used.
- Safety consequences and failure behaviour.
- Acceptance tests.

Use an architecture decision record under `docs/decisions/` for changes that
introduce a backend, replace the rendering approach, alter the simulation model
or add persistent learner data.

## Definition of done

A feature is complete only when:

- Its behaviour has deterministic automated coverage.
- Invalid combinations and safety-critical paths are tested.
- Learner-facing feedback is understandable and does not overstate competence.
- Keyboard and non-drag interaction are available.
- Curriculum and technical documents reflect the implementation.
- Checks pass, or remaining failures are explicitly documented.

## Content review

Electrical scenarios should be reviewed by a suitably knowledgeable person
before being labelled validated. Store review metadata with authored scenario
content: author, reviewer, review date, references and assumed regulation era.

Do not add copied examination questions or answer dumps. Original practice items
may target the same public learning outcomes but should use new wording, values,
layouts and reasoning paths.

## Commit hygiene

Keep changes focused. Do not combine formatting or dependency churn with new
electrical rules. Explain generated or updated fixtures in the change summary.
