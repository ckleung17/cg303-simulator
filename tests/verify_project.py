"""Dependency-free structural checks for the static simulator."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

required = [
    "index.html", "manifest.webmanifest", "service-worker.js",
    ".github/workflows/pages.yml", ".nojekyll",
    "css/tokens.css", "css/base.css", "css/layout.css",
    "css/components/simulator.css", "js/app.js",
    "data/scenarios/radial-scenarios.js", "assets/svg/app-icon.svg",
    "assets/svg/diagrams/simulator-workflow.svg",
    "docs/simulator-specification.md", "docs/operation-manual.md",
    "output/pdf/CG303-Fault-Lab-Specification.pdf",
    "output/pdf/CG303-Fault-Lab-Operation-Manual.pdf",
]
missing = [path for path in required if not (ROOT / path).is_file()]
assert not missing, f"Missing required files: {missing}"

html = (ROOT / "index.html").read_text(encoding="utf-8")
assert 'name="viewport"' in html
assert 'type="module" src="js/app.js"' in html
assert 'aria-label="Diagnostic stages"' in html
assert 'aria-labelledby="workflow-heading"' in html
assert 'assets/svg/diagrams/simulator-workflow.svg' in html
assert 'output/pdf/CG303-Fault-Lab-Specification.pdf" download' in html
assert 'output/pdf/CG303-Fault-Lab-Operation-Manual.pdf" download' in html
assert "data-stage=\"report\"" in html

scenario_source = (ROOT / "data/scenarios/radial-scenarios.js").read_text(encoding="utf-8")
fault_ids = re.findall(r'make\("[a-z]+","([a-z0-9-]+)"', scenario_source)
assert len(set(fault_ids)) >= 13, "Expected at least thirteen unique faults"
for circuit_type in ["radial", "ring", "lighting", "dedicated", "control", "threephase"]:
    assert f'{circuit_type}:' in scenario_source, f"Missing {circuit_type} circuit catalogue"

app = (ROOT / "js/app.js").read_text(encoding="utf-8")
for workflow in ["renderSafety", "takeReading", "submitDiagnosis", "finishAttempt"]:
    assert f"function {workflow}" in app
for combination_rule in ["function seededRandom", "function shuffle", "function buildScenario", "componentFaults", "optionFaults"]:
    assert combination_rule in app, f"Missing combination rule: {combination_rule}"
assert "1+Math.floor(random()*maximum)" in app
assert 'type="checkbox" name="diagnosis"' in app

css = (ROOT / "css/components/simulator.css").read_text(encoding="utf-8")
assert "@media(max-width:40rem)" in css
assert ".terminal-button" in css

print("Project structure, core scenarios, workflow and responsive rules verified.")
