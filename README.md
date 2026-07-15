# CG303 Fault Diagnosis Simulator

An online graphical training simulator for City & Guilds 2365-03 Unit 303,
**Electrical installations: fault diagnosis and rectification**.

The application is intended to help learners practise safe, logical fault
diagnosis using original simulated scenarios. It is not an official City &
Guilds product, does not reproduce live assessment material, and cannot replace
supervised practical training or workplace competence.

## Project status

Working first release. The simulator provides four seeded radial-circuit fault
scenarios, safe-isolation sequencing, calculated instrument readings, diagnosis
and correction choices, curriculum-mapped scoring, local attempt history and an
offline-capable mobile interface. It uses separate semantic HTML, modular CSS,
JavaScript ES modules, data and SVG assets without a build framework.

## Run locally

ES modules and offline caching require HTTP rather than opening `index.html`
directly from the filesystem:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`. Any static web server can be used. The app is
also suitable for GitHub Pages.

Run the dependency-free project verification with:

```powershell
python tests/verify_project.py
```

## Design goals

- Generate valid scenarios from combinations of installations, circuits,
  accessories, symptoms, hidden faults and available test instruments.
- Calculate measurements from circuit state rather than selecting canned
  answers.
- Teach a safe and repeatable diagnostic process.
- Provide guided, practice and exam-style modes.
- Track curriculum coverage so randomisation does not leave learning gaps.
- Remain usable with a keyboard and on common laptop and tablet screen sizes.
- Keep curriculum, simulation and presentation concerns independent.

## Documentation map

- [AGENTS.md](AGENTS.md): operating instructions for AI agents and contributors.
- [Product requirements](docs/product-requirements.md): users, modes, features,
  acceptance criteria and non-goals.
- [Curriculum mapping](docs/curriculum-map.md): Unit 303 learning-outcome coverage.
- [Technical architecture](docs/architecture.md): proposed modules and design
  constraints.
- [Scenario specification](docs/scenario-specification.md): circuits, faults,
  tools, measurements and generation rules.
- [Contributing](CONTRIBUTING.md): review, testing and change-management workflow.
- [Decisions](docs/decisions/0001-typescript-browser-app.md): why TypeScript is
  the primary implementation language.

## Implemented first milestone

The current release provides a complete single-phase radial-circuit workflow:

1. A customer complaint and circuit documentation.
2. Safe isolation using a voltage indicator and proving unit.
3. A hidden open-circuit or insulation-resistance fault.
4. Interactive test-point selection and calculated readings.
5. Diagnosis, recommended correction and post-work verification.
6. A report mapped to Unit 303 outcomes.

This vertical slice establishes the domain model and scoring contract before
additional circuit families are added.

## Repository layout

```text
index.html       Application entry point
pages/           Additional HTML pages
css/             Tokens, layouts and component styles
js/              Application, domain and simulation modules
data/            Scenario and curriculum content
assets/svg/      Circuit symbols and diagrams
assets/images/   Raster images where needed
tests/           Unit, scenario and browser tests
docs/            Requirements and design references
```

## Licensing and attribution

Before public release, maintainers must select a software licence and review all
terminology, diagrams and learning content for intellectual-property and
trademark compliance. “City & Guilds” is used only to identify the qualification
being studied; no endorsement or affiliation is implied.
