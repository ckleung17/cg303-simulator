// @ts-check
import { faults, instruments, tests } from "../data/scenarios/radial-scenarios.js";

const safetySteps = [
  "Obtain permission, identify the circuit and inform affected persons",
  "Inspect the voltage indicator and prove it on the proving unit",
  "Switch off, isolate and lock off the correct protective device",
  "Display a warning notice and retain control of the key",
  "Test line-neutral, line-earth and neutral-earth for dead",
  "Re-prove the voltage indicator on the proving unit"
];
const correctionOptions = [
  "Repair the affected conductor or termination and complete appropriate verification",
  "Increase the protective-device rating without further investigation",
  "Reset the RCBO and return the installation to service",
  "Leave the circuit energised and advise the customer to monitor it"
];
const state = { seed:"", fault:faults[0], mode:"guided", stage:"brief", safetyIndex:0, safetyErrors:0, observations:new Set(), leads:[], readings:[], evidence:[], diagnosis:[], reasoning:"", action:null };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function makeSeed(){ return Math.floor(Math.random()*0xffffff).toString(16).toUpperCase().padStart(6,"0"); }
function seededRandom(seed){ let value=parseInt(seed,16)>>>0; return ()=>{value=(value*1664525+1013904223)>>>0;return value/4294967296;}; }
function shuffle(items,random){ const result=[...items]; for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];} return result; }
function buildScenario(seed){
  const random=seededRandom(seed), types=[...new Set(faults.map(f=>f.type))], type=types[Math.floor(random()*types.length)];
  const compatible=shuffle(faults.filter(f=>f.type===type),random), maximum=Math.min(3,compatible.length), count=1+Math.floor(random()*maximum), active=compatible.slice(0,count), primary=active[0];
  return {...primary,id:active.map(f=>f.id).join("+"),name:active.map(f=>f.name).join(" + "),complaint:active.map(f=>f.complaint).join(" Additional symptom: "),action:active.map(f=>f.action).join(" "),keyTests:active.flatMap(f=>f.keyTests),componentFaults:active,optionFaults:shuffle(faults.filter(f=>f.type===type),random),measure(test,a,b){const key=`${test}:${a}:${b}`,reverse=`${test}:${b}:${a}`,owner=active.find(f=>f.keyTests.includes(key)||f.keyTests.includes(reverse));return (owner||primary).measure(test,a,b);}};
}

function newScenario(seed=makeSeed()){
  state.seed=seed; state.fault=buildScenario(seed); state.stage="brief"; state.safetyIndex=0; state.safetyErrors=0;
  state.observations.clear(); state.leads=[]; state.readings=[]; state.evidence=[]; state.diagnosis=[]; state.reasoning=""; state.action=null;
  $("#seed-display").textContent=seed; $("#complaint").textContent=`"${state.fault.complaint}"`;
  $("#circuit-chip").textContent=state.fault.circuit; $("#fact-supply").textContent=state.fault.supply;
  $("#fact-protection").textContent=state.fault.protection; $("#fact-conductors").textContent=state.fault.conductors; $("#fact-result").textContent=state.fault.lastResult;
  $$("[data-observation]").forEach(el=>{ if(el instanceof HTMLInputElement) el.checked=false; });
  renderSafety(); renderTerminals(); renderMeterOptions(); renderChoices(); renderReadings(); renderEvidence();
  $("#test-feedback").textContent=""; $("#diagnosis-feedback").textContent=""; $("#reasoning").value="";
  $("#outcome-scene").innerHTML=""; $("#outcome-scene").className="outcome-scene";
  showStage("brief"); logEvent("Scenario opened",`Seed ${seed} - ${state.fault.componentFaults.length} hidden fault${state.fault.componentFaults.length===1?"":"s"}`);
  triggerEffect($("#new-scenario"),"spark",650);
}

function showStage(name){
  state.stage=name; $$(".stage-view").forEach(el=>el.classList.toggle("active",el.id===`stage-${name}`));
  $$(".stage-tab").forEach(el=>{ const stages=["brief","safety","test","diagnose","report"]; const pos=stages.indexOf(el.dataset.stage); const current=stages.indexOf(name); el.classList.toggle("active",pos===current); el.classList.toggle("done",pos<current); if(pos===current)el.setAttribute("aria-current","step");else el.removeAttribute("aria-current"); });
  const workflow=document.querySelector(".workflow-overview");
  if(workflow)window.scrollTo({top:workflow.getBoundingClientRect().bottom+window.scrollY-8,behavior:"smooth"});
}

function renderSafety(){
  const list=$("#isolation-list"); list.innerHTML="";
  safetySteps.forEach((text,index)=>{ const li=document.createElement("li"); if(index<state.safetyIndex) li.className="complete"; li.innerHTML=`<span class="sequence-number">${index<state.safetyIndex?"?":index+1}</span><span>${text}</span><button class="button" type="button" data-safety="${index}" ${index<state.safetyIndex?"disabled":""}>Complete</button>`; list.append(li); });
  $("#safety-continue").disabled=state.safetyIndex!==safetySteps.length;
  $("#isolation-state").textContent=state.safetyIndex===safetySteps.length?"Safely isolated":"Not isolated";
  $("#isolation-state").className=`status-chip ${state.safetyIndex===safetySteps.length?"safe":"warning"}`;
}

function renderTerminals(){
  const buttons=$("#terminal-buttons"), markers=$("#terminal-markers"); buttons.innerHTML=""; markers.innerHTML="";
  const terminals=state.fault.terminals;
  ["#device-a","#device-b","#device-c"].forEach((id,i)=>$(id).textContent=state.fault.diagram[i]); ["#wire-a","#wire-b","#wire-c"].forEach((id,i)=>$(id).textContent=state.fault.wires[i]);
  const paths={
    radial:["M120 72 H650","M120 142 H650","M120 212 H650"],
    ring:["M120 72 H650 Q710 72 710 112 Q710 152 650 152 H120","M120 142 H620 Q680 142 680 182 Q680 222 620 222 H120","M120 212 H580 Q640 212 640 252 Q640 278 580 278 H120"],
    lighting:["M120 72 H345 V112 H520","M345 142 H500 V72 H650","M120 212 H650"],
    dedicated:["M120 72 H650","M120 142 H650","M120 212 H650"],
    control:["M120 72 H300 V112 H420 V72 H650","M120 142 H345 V182 H520 V142 H650","M120 212 H650"],
    threephase:["M120 72 H650","M120 142 H650","M120 212 H650"]
  }[state.fault.type];
  ["#path-a path","#path-b path","#path-c path"].forEach((id,i)=>$(id).setAttribute("d",paths[i]));
  if(state.fault.type==="threephase"){ $("#path-b").className.baseVal="wires phase-two"; $("#path-c").className.baseVal="wires phase-three"; }
  else { $("#path-b").className.baseVal="wires neutral"; $("#path-c").className.baseVal="wires cpc"; }
  $("#circuit-title").textContent=state.fault.circuit; $("#circuit-desc").textContent=`Interactive ${state.fault.circuit} with labelled test terminals.`;
  terminals.forEach(t=>{ const button=document.createElement("button"); button.type="button"; button.className="terminal-button"; button.dataset.terminal=t.id; button.textContent=t.label; buttons.append(button);
    const ns="http://www.w3.org/2000/svg"; const circle=document.createElementNS(ns,"circle"); circle.setAttribute("cx",String(t.x));circle.setAttribute("cy",String(t.y));circle.setAttribute("r","10");circle.setAttribute("class","terminal"); markers.append(circle);
    const label=document.createElementNS(ns,"text");label.setAttribute("x",String(t.x+12));label.setAttribute("y",String(t.y-9));label.setAttribute("class","terminal-label");label.textContent=t.id.toUpperCase();markers.append(label);
  });
}

function renderMeterOptions(){
  $("#instrument-select").innerHTML=instruments.map(x=>`<option value="${x.id}">${x.name}</option>`).join("");
  syncTestOptions(); updateLeads();
}
function syncTestOptions(){ const instrument=$("#instrument-select").value; const allowed=tests.filter(t=>t.instrument===instrument); $("#test-select").innerHTML=allowed.map(t=>`<option value="${t.id}">${t.name}</option>`).join(""); }
function updateLeads(){ $("#lead-a").textContent=terminalName(state.leads[0]); $("#lead-b").textContent=terminalName(state.leads[1]); $$(".terminal-button").forEach(el=>el.classList.toggle("selected",state.leads.includes(el.dataset.terminal))); }
function terminalName(id){ return state.fault.terminals.find(t=>t.id===id)?.label||"not set"; }

function takeReading(){
  const testId=$("#test-select").value, instrument=$("#instrument-select").value, feedback=$("#test-feedback");
  if(state.leads.length!==2){ setFeedback(feedback,"Select two different test terminals first.",false); return; }
  const test=tests.find(t=>t.id===testId); if(!test||test.instrument!==instrument){ setFeedback(feedback,"The selected instrument cannot perform that function.",false); return; }
  if(state.safetyIndex!==safetySteps.length){ state.safetyErrors++; setFeedback(feedback,"Testing is blocked: complete safe isolation first.",false); return; }
  const [a,b]=state.leads, result=state.fault.measure(testId,a,b); const record={test:test.name,a,b,...result}; state.readings.push(record);
  $("#meter-reading").textContent=result.value; $("#meter-unit").textContent=result.unit; renderReadings();
  triggerEffect($(".meter-screen"),"reading-pulse",550);
  const helpful=state.fault.keyTests.includes(`${testId}:${a}:${b}`)||state.fault.keyTests.includes(`${testId}:${b}:${a}`);
  const message=state.mode==="guided"?result.evidence:(helpful?"Reading recorded. Consider what this establishes.":"Reading recorded.");
  setFeedback(feedback,message,true); logEvent(`${test.name}: ${result.value} ${result.unit}`,`${terminalName(a)} ? ${terminalName(b)}`); state.leads=[]; updateLeads();
}

function renderReadings(){
  const body=$("#results-body"); if(!state.readings.length){body.innerHTML='<tr><td colspan="3">No readings recorded.</td></tr>';return;}
  body.innerHTML=state.readings.map(r=>`<tr><td>${escapeText(r.test)}</td><td>${escapeText(terminalName(r.a))} ? ${escapeText(terminalName(r.b))}</td><td><strong>${escapeText(r.value)} ${escapeText(r.unit)}</strong></td></tr>`).join("");
}

function renderChoices(){
  $("#diagnosis-options").innerHTML=state.fault.optionFaults.map(f=>`<label class="choice-card"><input type="checkbox" name="diagnosis" value="${f.id}"><span><strong>${f.name}</strong></span></label>`).join("");
  $("#action-options").innerHTML=correctionOptions.map((a,i)=>`<label class="choice-card"><input type="radio" name="action" value="${i}"><span>${a}</span></label>`).join("");
}

function submitDiagnosis(){
  const diagnoses=[...document.querySelectorAll('input[name="diagnosis"]:checked')], action=document.querySelector('input[name="action"]:checked');
  state.reasoning=$("#reasoning").value.trim(); const feedback=$("#diagnosis-feedback");
  if(!diagnoses.length||!(action instanceof HTMLInputElement)||state.reasoning.length<15){setFeedback(feedback,"Select every fault you diagnosed and an action, then explain your evidence in at least one sentence.",false);return;}
  state.diagnosis=diagnoses.map(el=>el.value); state.action=Number(action.value); const expected=state.fault.componentFaults.map(f=>f.id); const correct=state.diagnosis.length===expected.length&&expected.every(id=>state.diagnosis.includes(id));
  setFeedback(feedback,correct?"Diagnosis recorded. Complete the report to review your performance.":"Diagnosis recorded. Review the evidence in your report.",correct);
  logEvent("Diagnosis submitted",state.diagnosis.map(id=>faults.find(f=>f.id===id)?.name).filter(Boolean).join(", ")); setTimeout(()=>finishAttempt(),350);
}

function finishAttempt(){
  const expected=state.fault.componentFaults.map(f=>f.id), correct=state.diagnosis.length===expected.length&&expected.every(id=>state.diagnosis.includes(id));
  const evidenced=state.fault.componentFaults.filter(f=>f.keyTests.some(k=>{const [t,a,b]=k.split(":");return state.readings.some(r=>r.test===tests.find(x=>x.id===t)?.name&&((r.a===a&&r.b===b)||(r.a===b&&r.b===a)));})).length, useful=evidenced===state.fault.componentFaults.length;
  const safety=Math.max(0,25-state.safetyErrors*5), information=Math.min(15,state.observations.size*5), testing=Math.min(25,(useful?15:0)+Math.min(10,state.readings.length*2)), diagnosis=correct?20:0, correction=state.action===0?10:0, reasoning=state.reasoning.length>=40?5:2;
  const score=safety+information+testing+diagnosis+correction+reasoning; $("#score-ring").textContent=`${score}%`; $("#score-ring").style.setProperty("--score",`${score}%`);
  $("#report-summary").innerHTML=`<div class="feedback ${correct?"good":"bad"}"><strong>${correct?"Complete diagnosis":"Diagnosis needs review"}</strong><p>The ${state.fault.componentFaults.length===1?"hidden fault was":"hidden faults were"} <strong>${escapeText(state.fault.componentFaults.map(f=>f.name).join("; "))}</strong>. ${escapeText(state.fault.action)}</p></div><p><strong>Your reasoning:</strong> ${escapeText(state.reasoning)}</p><p><strong>Fault evidence found:</strong> ${evidenced} of ${state.fault.componentFaults.length}</p>`;
  const outcomes=[
    ["LO1","Health & safety",safety>=20,`${safety}/25`],["LO2","Communication",information>=10,`${information}/15`],["LO3","Fault characteristics",correct,`${diagnosis}/20`],["LO4","Diagnosis procedure",testing>=18,`${testing}/25`],["LO5","Correction",correction===10,`${correction}/10`],["LO6","Perform diagnosis",correct&&useful,correct&&useful?"Met":"Review"]
  ];
  const restored=correct&&useful&&state.action===0;
  $("#outcome-grid").innerHTML=outcomes.map(o=>`<div class="outcome-card ${o[2]?"pass":"review"}"><strong>${o[0]} ? ${o[1]}</strong><span>${o[3]}</span></div>`).join(""); renderOutcomeScene(restored); showStage("report"); saveAttempt(score,correct);
}

function renderOutcomeScene(correct){
  const type=state.fault.type, scene=$("#outcome-scene");
  const success={
    radial:["Socket circuit restored","The repaired radial circuit supplies the connected load.",'<div class="scene-socket"><i></i><i></i><b></b></div>'],
    ring:["Ring circuit restored","Both paths and socket outlets are available again.",'<div class="scene-ring"><i></i><i></i><b></b></div>'],
    lighting:["Lights restored","The luminaire comes back on after the supported repair.",'<div class="scene-lamp"><i></i><b></b></div>'],
    dedicated:["Oven operating","The dedicated load completes its cycle and delivers a grilled chicken.",'<div class="scene-oven"><i></i><b></b><em></em></div>'],
    control:["Control restored","The contactor pulls in and the controlled equipment runs.",'<div class="scene-contactor"><i></i><i></i><b></b></div>'],
    threephase:["Motor running","The three-phase motor returns to balanced operation.",'<div class="scene-motor"><i></i><b></b></div>']
  };
  const item=success[type]||success.radial;
  const title=correct?item[0]:"Unsafe outcome - review required";
  const detail=correct?item[1]:`The ${state.fault.circuit.toLowerCase()} remains unsafe or unavailable. Recheck the evidence before any simulated return to service.`;
  scene.className=`outcome-scene scene-${type} ${correct?"scene-success":"scene-failure"}`;
  scene.innerHTML=`<div class="scene-canvas" aria-hidden="true">${item[2]}<span class="scene-bolt"></span><span class="scene-blackout"></span></div><p><strong>${escapeText(title)}</strong><span>${escapeText(detail)}</span></p>`;
}

function logEvent(title,detail=""){ state.evidence.push({title,detail,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}); renderEvidence(); }
function renderEvidence(){ const list=$("#evidence-log"); $("#evidence-count").textContent=String(state.evidence.length); list.innerHTML=state.evidence.length?state.evidence.map(e=>`<li><strong>${escapeText(e.title)}</strong><small>${escapeText(e.detail)} - ${e.time}</small></li>`).join(""):'<li class="empty">Your actions and readings will appear here.</li>'; }
function setFeedback(el,message,good){el.textContent=message;el.className=`feedback ${good?"good":"bad"}`;triggerEffect(document.body,good?"action-correct":"action-wrong",520);}
function triggerEffect(element,className,duration){if(!element||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;element.classList.remove(className);void element.offsetWidth;element.classList.add(className);window.setTimeout(()=>element.classList.remove(className),duration);}
function escapeText(value){const d=document.createElement("div");d.textContent=String(value);return d.innerHTML;}
function saveAttempt(score,correct){try{const history=JSON.parse(localStorage.getItem("cg303-attempts")||"[]");history.unshift({seed:state.seed,score,correct,date:new Date().toISOString()});localStorage.setItem("cg303-attempts",JSON.stringify(history.slice(0,20)));}catch{ /* local storage is optional */ }}

$("#mode-select").addEventListener("change",e=>{state.mode=e.target.value;logEvent("Mode changed",state.mode);});
$("#new-scenario").addEventListener("click",()=>newScenario()); $("#report-new").addEventListener("click",()=>newScenario()); $("#repeat-scenario").addEventListener("click",()=>newScenario(state.seed));
$$(".stage-tab").forEach(el=>el.addEventListener("click",()=>showStage(el.dataset.stage)));
$$(".next-stage").forEach(el=>el.addEventListener("click",()=>showStage(el.dataset.next)));
$$("[data-observation]").forEach(el=>el.addEventListener("change",e=>{e.target.checked?state.observations.add(e.target.dataset.observation):state.observations.delete(e.target.dataset.observation);if(e.target.checked)logEvent("Information gathered",e.target.parentElement.textContent.trim());}));
$("#isolation-list").addEventListener("click",e=>{const button=e.target.closest("[data-safety]");if(!button)return;const index=Number(button.dataset.safety),feedback=$("#safety-feedback");if(index!==state.safetyIndex){state.safetyErrors++;setFeedback(feedback,"That step is out of sequence. Consider what must be established first.",false);return;}logEvent("Safety step completed",safetySteps[index]);state.safetyIndex++;setFeedback(feedback,state.safetyIndex===safetySteps.length?"Safe isolation completed and the indicator was re-proved.":"Step recorded. Continue in sequence.",true);renderSafety();});
$("#safety-continue").addEventListener("click",()=>showStage("test"));
$("#terminal-buttons").addEventListener("click",e=>{const button=e.target.closest("[data-terminal]");if(!button)return;const id=button.dataset.terminal;if(state.leads.includes(id)){state.leads=state.leads.filter(x=>x!==id);}else if(state.leads.length<2){state.leads.push(id);}else{state.leads=[state.leads[1],id];}updateLeads();});
$("#instrument-select").addEventListener("change",syncTestOptions); $("#clear-leads").addEventListener("click",()=>{state.leads=[];updateLeads();});
$("#meter-form").addEventListener("submit",e=>{e.preventDefault();takeReading();});
$("#diagnosis-form").addEventListener("submit",e=>{e.preventDefault();submitDiagnosis();});

const requestedSeed=new URLSearchParams(location.search).get("seed");
newScenario(requestedSeed&&/^[0-9a-f]{1,8}$/i.test(requestedSeed)?requestedSeed.toUpperCase():undefined);

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(() => {}));
}
