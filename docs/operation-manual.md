# CG303 Fault Lab ? Operation Manual

Manual version: 1.0  
Applies to simulator baseline: commit `4b0c063`  
Last updated: 15 July 2026

## 1. Important notice

CG303 Fault Lab is an independent learning aid containing original practice
material. It is not affiliated with or endorsed by City & Guilds. It does not
certify competence and must not replace supervised practical training, approved
safe-isolation procedures or the instructions supplied with real test equipment.

Never use a simulated reading as evidence about a real installation.

## 2. Starting the simulator

### Online

Open the published simulator address in a current browser. No account is needed.

### Local copy

From the project directory, start a static server:

```powershell
python -m http.server 8000
```

Open `http://localhost:8000`. Opening `index.html` directly may prevent browser
modules and offline caching from operating.

### Installing on a phone or tablet

Use the browser's Add to Home Screen or Install App command. After the files have
been cached once, the installed simulator can normally reopen without a network
connection. Browser-specific installation wording varies.

## 3. Selecting a learning mode

Use the Mode selector at the top of the page:

- **Guided:** shows explanatory feedback after tests.
- **Practice:** reduces guidance while retaining the final report.
- **Exam-style:** minimises immediate teaching feedback.

Changing mode does not change the hidden fault. Select **New fault** to generate
a different seed and scenario.

## 4. Stage 1 ? Brief

1. Read the customer complaint.
2. Note the circuit type, supply, protective device, conductor details and
   previous result.
3. Select the information-gathering actions you completed.
4. Form at least two plausible initial hypotheses.
5. Select **Continue to safety**.

The scenario seed is displayed near the heading. Record it if you want to repeat
or discuss the same exercise.

## 5. Stage 2 ? Safety

Complete the displayed safe-isolation actions in order. The simulator expects:

1. Permission, circuit identification and communication.
2. Inspection and proving of the voltage indicator.
3. Switching off, isolation and lock-off.
4. Warning notice and control of the key.
5. Testing for dead between the required conductors.
6. Re-proving the voltage indicator.

Selecting a later step prematurely records an out-of-sequence safety action.
Testing remains locked until all six actions are complete.

## 6. Stage 3 ? Testing

1. Review the diagram and its labelled test terminals.
2. Select an instrument.
3. Select the instrument function.
4. Select two terminal buttons. They become the two meter leads.
5. Select **Take reading**.
6. Interpret the reading and add further discriminating tests if necessary.

Use **Clear leads** to cancel the selection. The terminal buttons are designed
for mouse, keyboard or touch and replace any need to drag graphical probes.

The available instruments are:

- Two-pole voltage indicator.
- Low-resistance ohmmeter.
- Insulation-resistance tester.

Results appear on the meter, in the test record and in the evidence notebook.
`OL` means the simulated meter indicates an open circuit or an out-of-range
resistance path in that test context.

## 7. Stage 4 ? Diagnosis

1. Compare the complaint with the recorded results.
2. Select the most likely fault.
3. Enter a sentence explaining which evidence supports the diagnosis.
4. Select the safest appropriate corrective-action category.
5. Select **Submit diagnosis**.

A correct fault name without useful testing, safe procedure or reasoning will
not receive the full score.

## 8. Stage 5 ? Report

The report displays:

- Overall percentage.
- Hidden fault and recommended action.
- Your submitted reasoning.
- Results mapped to Unit 303 learning-outcome themes.

Use **Repeat seed** to restart the exact scenario or **Generate new fault** for a
different exercise. Previous summary results may be retained only in the current
browser's local storage.

## 9. Circuit families

Random generation draws from radial, ring-final, lighting, dedicated-load,
contactor-control and three-phase motor scenarios. The diagram labels, supply,
protection, terminals and likely measurements change with the selected family.

Because the choice is seeded, several consecutive scenarios can occasionally
come from the same family. Continue selecting **New fault** to broaden coverage.

## 10. Mobile and accessibility operation

- Rotate the device if a larger circuit view is helpful.
- The layout changes to a single column on phones.
- Use browser zoom or text-size controls as required.
- All major controls meet touch-target sizing requirements.
- Use Tab and Shift+Tab to move through controls with a keyboard.
- Press Space or Enter to activate the focused button or selection.
- Terminal selection does not depend on colour or drag-and-drop.

## 11. Troubleshooting

### The application remains on loading

Serve the files over HTTP/HTTPS and confirm JavaScript is enabled. Refresh after
clearing an obsolete site cache if the application was recently updated.

### The offline version appears outdated

Reconnect, open the online application, refresh it, then close and reopen the
installed version. This allows the new service-worker cache to activate.

### A reading cannot be taken

Confirm safe isolation is complete, an instrument/function is selected and two
different terminals have been selected.

### Progress disappeared

Attempt history is stored locally and can be removed by private browsing,
clearing site data or changing device/browser. It is not synchronised online.

## 12. Suggested study method

1. Begin in Guided mode and record why each test is useful.
2. Repeat the seed in Practice mode using fewer tests.
3. Use Exam-style mode only after you can justify instrument choice and sequence.
4. Practise every circuit family and compare symptoms that appear similar.
5. Discuss unexpected results with a qualified tutor.

## 13. Manual maintenance

This manual must be updated in the same commit whenever simulator controls,
workflow, modes, circuit families, instruments, scoring, storage, installation or
device support changes. Amend the version, date and applicable simulator baseline
when preparing a release.
