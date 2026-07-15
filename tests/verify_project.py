"""Dependency-free structural checks for the static simulator."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

required = [
    "index.html", "manifest.webmanifest", "service-worker.js",
    "css/tokens.css", "css/base.css", "css/layout.css",
    "css/components/simulator.css", "js/app.js",
    "data/scenarios/radial-scenarios.js", "assets/svg/app-icon.svg",
    "docs/simulator-specification.md", "docs/operation-manual.md",
]
missing = [path for path in required if not (ROOT / path).is_file()]
assert not missing, f"Missing required files: {missing}"

html = (ROOT / "index.html").read_text(encoding="utf-8")
assert 'name="viewport"' in html
assert 'type="module" src="js/app.js"' in html
assert 'aria-label="Diagnostic stages"' in html
assert 'docs/simulator-specification.md" download' in html
assert 'docs/operation-manual.md" download' in html
assert "data-stage=\"report\"" in html

scenario_source = (ROOT / "data/scenarios/radial-scenarios.js").read_text(encoding="utf-8")
fault_ids = re.findall(r'make\("[a-z]+","([a-z0-9-]+)"', scenario_source)
assert len(set(fault_ids)) >= 13, "Expected at least thirteen unique faults"
for circuit_type in ["radial", "ring", "lighting", "dedicated", "control", "threephase"]:
    assert f'{circuit_type}:' in scenario_source, f"Missing {circuit_type} circuit catalogue"

app = (ROOT / "js/app.js").read_text(encoding="utf-8")
for workflow in ["renderSafety", "takeReading", "submitDiagnosis", "finishAttempt"]:
    assert f"function {workflow}" in app

css = (ROOT / "css/components/simulator.css").read_text(encoding="utf-8")
assert "@media(max-width:40rem)" in css
assert ".terminal-button" in css

print("Project structure, core scenarios, workflow and responsive rules verified.")
