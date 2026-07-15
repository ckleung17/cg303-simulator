// Original practice scenarios. Values are deterministic teaching models.
export const instruments = [
  { id: "voltage", name: "Two-pole voltage indicator" },
  { id: "continuity", name: "Low-resistance ohmmeter" },
  { id: "insulation", name: "Insulation-resistance tester" }
];
export const tests = [
  { id: "voltage", name: "Voltage AC", instrument: "voltage", unit: "V" },
  { id: "continuity", name: "Continuity", instrument: "continuity", unit: "ohm" },
  { id: "insulation", name: "Insulation resistance 500 V", instrument: "insulation", unit: "Mohm" }
];

const radialTerminals = terminals([["db-l","DB Line","l"],["db-n","DB Neutral","n"],["db-cpc","DB CPC","cpc"],["so1-l","SO1 Line","l"],["so1-n","SO1 Neutral","n"],["so1-cpc","SO1 CPC","cpc"],["so2-l","SO2 Line","l"],["so2-n","SO2 Neutral","n"],["so2-cpc","SO2 CPC","cpc"]]);
const ringTerminals = terminals([["db-l1","DB Line end 1","l"],["db-l2","DB Line end 2","l"],["db-n1","DB Neutral end 1","n"],["db-n2","DB Neutral end 2","n"],["db-c1","DB CPC end 1","cpc"],["db-c2","DB CPC end 2","cpc"],["so-l","Socket Line","l"],["so-n","Socket Neutral","n"],["so-c","Socket CPC","cpc"]]);
const lightingTerminals = terminals([["db-l","DB Line","l"],["db-n","DB Neutral","n"],["sw-com","Switch COM","l"],["sw-l1","Switch L1","sl"],["lamp-sl","Luminaire switched line","sl"],["lamp-n","Luminaire neutral","n"],["cpc-a","Switch CPC","cpc"],["cpc-b","Luminaire CPC","cpc"]]);
const dedicatedTerminals = terminals([["db-l","DB Line","l"],["db-n","DB Neutral","n"],["iso-l","Isolator Line","l"],["iso-n","Isolator Neutral","n"],["load-l","Load Line","l"],["load-n","Load Neutral","n"],["db-cpc","DB CPC","cpc"],["load-cpc","Load CPC","cpc"]]);
const controlTerminals = terminals([["ctl-l","Control Line","l"],["stop-out","Stop output","l"],["start-out","Start output","l"],["coil-a1","Coil A1","coil"],["coil-a2","Coil A2","n"],["aux-in","Auxiliary input","l"],["aux-out","Auxiliary output","l"],["ctl-n","Control Neutral","n"]]);
const threePhaseTerminals = terminals([["db-l1","DB L1","l1"],["db-l2","DB L2","l2"],["db-l3","DB L3","l3"],["motor-u","Motor U","l1"],["motor-v","Motor V","l2"],["motor-w","Motor W","l3"],["db-cpc","DB CPC","cpc"],["motor-cpc","Motor CPC","cpc"]]);

const catalogue = {
  radial: { circuit:"Radial socket circuit", supply:"230 V AC, TN-C-S", protection:"B20 30 mA RCBO", conductors:"2.5/1.5 mm2 T&E", lastResult:"R1+R2 0.41 ohm", terminals:radialTerminals, diagram:["DB1","SO1","SO2"], wires:["Line","Neutral","CPC"] },
  ring: { circuit:"Ring final circuit", supply:"230 V AC, TN-C-S", protection:"B32 30 mA RCBO", conductors:"2.5/1.5 mm2 T&E ring", lastResult:"r1 0.42, rn 0.43, r2 0.68 ohm", terminals:ringTerminals, diagram:["DB1 ends","Socket","Ring return"], wires:["Line ring","Neutral ring","CPC ring"] },
  lighting: { circuit:"One/two-way lighting circuit", supply:"230 V AC, TN-S", protection:"B6 RCBO", conductors:"1.5/1.0 mm2 T&E/3C&E", lastResult:"R1+R2 0.72 ohm", terminals:lightingTerminals, diagram:["DB1","Switching","Luminaire"], wires:["Permanent line","Switched line","Neutral/CPC"] },
  dedicated: { circuit:"Dedicated cooker/shower radial", supply:"230 V AC, TN-C-S", protection:"B40 30 mA RCBO", conductors:"6.0/2.5 mm2 T&E", lastResult:"R1+R2 0.28 ohm", terminals:dedicatedTerminals, diagram:["DB1","Local isolator","Fixed load"], wires:["Line","Neutral","CPC"] },
  control: { circuit:"Contactor control circuit", supply:"230 V AC control", protection:"B6 control MCB", conductors:"1.5 mm2 control wiring", lastResult:"Coil 4.8 kohm", terminals:controlTerminals, diagram:["Control supply","Stop/Start/Aux","Contactor coil"], wires:["Control line","Holding path","Neutral"] },
  threephase: { circuit:"Three-phase motor circuit", supply:"400/230 V AC, TN-S", protection:"3-pole C20 MCB + overload", conductors:"4.0 mm2 4C SWA", lastResult:"Phase resistances balanced", terminals:threePhaseTerminals, diagram:["3-phase DB","Contactor/overload","Motor"], wires:["L1","L2","L3/CPC"] }
};

export const faults = [
  make("radial","open-neutral-so2","Open neutral between SO1 and SO2","The first socket works, but the second does not. The RCBO remains set.","continuity:so1-n:so2-n","OL","ohm","Neutral continuity is absent.","Repair the neutral termination, then verify continuity, polarity and function."),
  make("radial","open-cpc-so2","Open CPC between SO1 and SO2","Both outlets supply equipment, but earth continuity is suspect at SO2.","continuity:so1-cpc:so2-cpc","OL","ohm","CPC continuity is absent.","Restore CPC continuity and verify the protective measures."),
  make("radial","low-ir-ln","Low insulation resistance line-neutral","The RCBO trips with all equipment unplugged.","insulation:db-l:db-n","0.18","Mohm","Line-neutral insulation resistance is low.","Locate and repair damaged wiring, then repeat insulation and functional tests."),
  make("radial","reversed-polarity-so2","Line and neutral reversed at SO2","SO2 powers a load but a socket indicator reports incorrect polarity.","continuity:so1-l:so2-n","0.12","ohm","Continuity follows a crossed conductor path.","Correct SO2 line and neutral terminations and verify polarity."),
  make("ring","ring-open-line","Ring line conductor discontinuity","All sockets work, but end-to-end testing shows an abnormal ring result.","continuity:db-l1:db-l2","OL","ohm","The line ring has no end-to-end continuity.","Locate and repair the open line conductor, then repeat ring continuity tests."),
  make("ring","ring-open-cpc","Ring CPC discontinuity","Socket operation appears normal, but the ring CPC result cannot be obtained.","continuity:db-c1:db-c2","OL","ohm","The CPC ring has no end-to-end continuity.","Repair the CPC discontinuity and repeat r1, rn, r2 and cross-connection tests."),
  make("lighting","lighting-open-switched-line","Open switched line to luminaire","The lamp does not illuminate although the protective device remains set.","continuity:sw-l1:lamp-sl","OL","ohm","The switched-line path is open.","Repair the switched-line connection and verify polarity and operation."),
  make("lighting","lighting-open-neutral","Open neutral at luminaire","The switch has a supply but the lamp does not illuminate with a known-good lamp.","continuity:db-n:lamp-n","OL","ohm","Neutral continuity to the luminaire is absent.","Restore the luminaire neutral and complete continuity, polarity and functional checks."),
  make("dedicated","isolator-high-resistance","High-resistance isolator line termination","The shower/cooker operates intermittently and the local isolator shows signs of heating.","continuity:iso-l:load-l","8.40","ohm","The line path has abnormally high resistance.","Replace damaged parts and correctly terminate the conductor, then verify and load-test."),
  make("control","contactor-open-coil","Open contactor coil","The start control operates but the contactor does not pull in.","continuity:coil-a1:coil-a2","OL","ohm","The contactor coil winding is open circuit.","Replace the compatible contactor/coil and verify control and power operation."),
  make("control","holding-contact-open","Open auxiliary holding contact","The contactor energises only while the start button is held.","continuity:aux-in:aux-out","OL","ohm","The auxiliary holding contact does not close.","Repair or replace the auxiliary contact and functionally test the control sequence."),
  make("threephase","lost-phase-l2","Open L2 conductor to motor","The motor will not start correctly and the overload operates; phase loss is suspected.","continuity:db-l2:motor-v","OL","ohm","L2 continuity to the motor is absent.","Repair the L2 path, verify all phases, phase sequence, CPC and motor operation."),
  make("threephase","motor-low-ir","Low motor-winding insulation resistance","The motor protective device trips when the motor circuit is energised.","insulation:motor-u:motor-cpc","0.22","Mohm","Motor winding insulation to earth is low.","Keep isolated and repair or replace the motor after appropriate further tests.")
];

function make(type,id,name,complaint,key,value,unit,evidence,action){
  const meta=catalogue[type];
  return { ...meta,type,id,name,complaint,keyTests:[key],action,measure(test,a,b){
    const actual=`${test}:${a}:${b}`, reverse=`${test}:${b}:${a}`;
    if(actual===key||reverse===key) return {value,unit,evidence};
    return baseline(test,a,b,this.terminals);
  }};
}
function terminals(items){
  return items.map((item,index)=>{const column=Math.floor(index/3),row=index%3;return {id:item[0],label:item[1],conductor:item[2],x:[120,345,650][column]||650,y:[72,142,212][row]};});
}
function baseline(test,a,b,list){
  const ca=list.find(t=>t.id===a)?.conductor, cb=list.find(t=>t.id===b)?.conductor, same=ca===cb;
  if(test==="continuity") return same?{value:"0.12",unit:"ohm",evidence:"A low-resistance path is present."}:{value:"OL",unit:"ohm",evidence:"No conductor path is indicated."};
  if(test==="insulation") return !same?{value:">200",unit:"Mohm",evidence:"Insulation resistance is high."}:{value:"0.00",unit:"Mohm",evidence:"These points share a conductor."};
  return {value:"0",unit:"V",evidence:"The isolated circuit has no measured voltage."};
}
