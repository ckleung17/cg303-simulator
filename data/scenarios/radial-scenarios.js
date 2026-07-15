export const terminals = [
  { id: "db-l", label: "DB Line", x: 120, y: 72 },
  { id: "db-n", label: "DB Neutral", x: 120, y: 142 },
  { id: "db-cpc", label: "DB CPC", x: 120, y: 212 },
  { id: "so1-l", label: "SO1 Line", x: 345, y: 72 },
  { id: "so1-n", label: "SO1 Neutral", x: 345, y: 142 },
  { id: "so1-cpc", label: "SO1 CPC", x: 345, y: 212 },
  { id: "so2-l", label: "SO2 Line", x: 650, y: 72 },
  { id: "so2-n", label: "SO2 Neutral", x: 650, y: 142 },
  { id: "so2-cpc", label: "SO2 CPC", x: 650, y: 212 }
];

export const instruments = [
  { id: "voltage", name: "Two-pole voltage indicator" },
  { id: "continuity", name: "Low-resistance ohmmeter" },
  { id: "insulation", name: "Insulation-resistance tester" }
];

export const tests = [
  { id: "voltage", name: "Voltage AC", instrument: "voltage", unit: "V", requiresLive: true },
  { id: "continuity", name: "Continuity", instrument: "continuity", unit: "?", requiresDead: true },
  { id: "insulation", name: "Insulation resistance 500 V", instrument: "insulation", unit: "M?", requiresDead: true }
];

export const faults = [
  {
    id: "open-neutral-so2",
    name: "Open neutral between SO1 and SO2",
    complaint: "The first socket works, but equipment connected to the second socket does not operate. The RCBO remains set.",
    action: "Repair and correctly terminate the neutral conductor between SO1 and SO2, then verify continuity, polarity and function.",
    keyTests: ["continuity:so1-n:so2-n"],
    measure(test, a, b) {
      if (test === "continuity" && pair(a,b,"so1-n","so2-n")) return { value: "OL", unit: "?", evidence: "Neutral continuity is absent between SO1 and SO2." };
      return baseline(test,a,b);
    }
  },
  {
    id: "open-cpc-so2",
    name: "Open CPC between SO1 and SO2",
    complaint: "Both socket outlets appear to supply equipment normally, but a recent check raised concern about earth continuity at the second outlet.",
    action: "Restore the CPC connection to SO2, then verify protective-conductor continuity, polarity and the relevant protective measures.",
    keyTests: ["continuity:so1-cpc:so2-cpc"],
    measure(test, a, b) {
      if (test === "continuity" && pair(a,b,"so1-cpc","so2-cpc")) return { value: "OL", unit: "?", evidence: "CPC continuity is absent between SO1 and SO2." };
      return baseline(test,a,b);
    }
  },
  {
    id: "low-ir-ln",
    name: "Low insulation resistance between line and neutral",
    complaint: "The circuit RCBO trips when the circuit is energised. Unplugging connected equipment does not clear the problem.",
    action: "Locate and repair or replace the damaged cable or accessory, then repeat insulation-resistance, polarity and functional verification.",
    keyTests: ["insulation:db-l:db-n"],
    measure(test, a, b) {
      if (test === "insulation" && pair(a,b,"db-l","db-n")) return { value: "0.18", unit: "M?", evidence: "Line-neutral insulation resistance is unacceptably low." };
      return baseline(test,a,b);
    }
  },
  {
    id: "reversed-polarity-so2",
    name: "Line and neutral reversed at SO2",
    complaint: "The second socket powers a load, but a plug-in indication suggested incorrect polarity. The first socket tests normally.",
    action: "Correct the line and neutral terminations at SO2, then verify polarity and function before restoration.",
    keyTests: ["continuity:so1-l:so2-n","continuity:so1-n:so2-l"],
    measure(test, a, b) {
      if (test === "continuity" && (pair(a,b,"so1-l","so2-n") || pair(a,b,"so1-n","so2-l"))) return { value: "0.12", unit: "?", evidence: "Continuity follows crossed line and neutral paths at SO2." };
      if (test === "continuity" && (pair(a,b,"so1-l","so2-l") || pair(a,b,"so1-n","so2-n"))) return { value: "OL", unit: "?", evidence: "Expected like-for-like conductor continuity is absent." };
      return baseline(test,a,b);
    }
  }
];

function pair(a,b,x,y){ return (a===x&&b===y)||(a===y&&b===x); }
function conductor(id){ return id.split("-").at(-1); }
function baseline(test,a,b){
  const same = conductor(a) === conductor(b);
  if (test === "continuity") return same ? { value:"0.12",unit:"?",evidence:"A low-resistance conductor path is present." } : { value:"OL",unit:"?",evidence:"No continuity is expected between separate conductors." };
  if (test === "insulation") return !same ? { value:">200",unit:"M?",evidence:"Insulation resistance is high between the selected conductors." } : { value:"0.00",unit:"M?",evidence:"The points are on the same conductor; this is not a useful insulation test." };
  return { value:"0",unit:"V",evidence:"The isolated circuit has no measured voltage." };
}
