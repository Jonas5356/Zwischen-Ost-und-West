// Weltsimulation: Was tun die vom Spiel gesteuerten Länder, und wie gut schätzt Bonn sie ein?
//   node tests/welt_simulation.mjs [Partien] [Geschichtstreue 0…1] [BRD-Strategie]
import { spiele, W } from './spieler.mjs';

const n = Number(process.argv[2] || 300);
const g = Number(process.argv[3] ?? 1);
const strategie = process.argv[4] || (g >= 0.99 ? 'historisch' : 'zufall');

const wahl = {}, regierungen = {}, flags = {}, enden = {};
let treffer = 0, faelle = 0, brier = 0, priorBrier = 0, vereinigt = 0;
const zaehle = (o, k) => { o[k] = (o[k] || 0) + 1; };
for (let seed = 1; seed <= n; seed++) {
  const { welt } = spiele(seed, strategie, null, { geschichtstreue: g });
  zaehle(enden, welt.ende.id);
  if (welt.laender.brd.f.vereinigt) vereinigt++;
  for (const f of ['juni17_panzer', 'juni17_zugestaendnisse', 'ungarn_einmarsch', 'ungarn_neutral', 'mauer_genehmigt', 'mauer_abgelehnt', 'raketen_kuba', 'radford', 'atomkrieg']) if (welt.weltflags[f]) zaehle(flags, f);
  for (const f of ['essentials', 'kuba_massnahme', 'kuba_ausgang']) if (welt.weltflags[f]) zaehle(flags, f + '=' + welt.weltflags[f]);
  for (const land of ['usa', 'su']) {
    const L = welt.laender[land];
    for (const c of L.chronik) {
      if (c.art === 'wechsel') continue;
      zaehle(wahl, `${land}:${c.id} → ${c.wahl.slice(0, 60)}`);
    }
    for (const r of L.regierungen) zaehle(regierungen, `${land}:${r.regime}${r.typ ? '/' + r.typ : ''}`);
    // Einschätzung am Ende jeder Regierungszeit: Wahrscheinlichkeit des wahren Typs
    const E = welt.laender.brd.einschaetzung[land];
    const alle = [...(E.frueher || []), { regime: E.regime, p: E.p }];
    const regs = [...L.regierungen];
    for (const e of alle) {
      const r = regs.find(x => x.regime === e.regime && x.typ);
      if (!r || !Object.keys(e.p).length) continue;
      regs.splice(regs.indexOf(r), 1);
      const M = W.laender[land].regierungen[r.regime];
      const prior = Object.fromEntries(Object.entries(M.typen).map(([k, t]) => [k, t.p]));
      const summe = Object.values(prior).reduce((a, b) => a + b, 0);
      faelle++;
      const best = Object.entries(e.p).sort((a, b) => b[1] - a[1])[0][0];
      if (best === r.typ) treffer++;
      for (const t of Object.keys(e.p)) {
        brier += (e.p[t] - (t === r.typ ? 1 : 0)) ** 2;
        priorBrier += (prior[t] / summe - (t === r.typ ? 1 : 0)) ** 2;
      }
    }
  }
}
const pct = x => `${Math.round(100 * x / n)} %`;
console.log(`== ${n} Partien, Geschichtstreue ${g}, BRD-Strategie ${strategie}`);
console.log('Enden:', enden, '| vereinigt:', vereinigt);
console.log('\nWendepunkte:'); for (const [k, v] of Object.entries(flags).sort()) console.log(`  ${k.padEnd(28)} ${pct(v)}`);
console.log('\nRegierungen (mit Typ):'); for (const [k, v] of Object.entries(regierungen).sort()) console.log(`  ${k.padEnd(34)} ${pct(v)}`);
console.log('\nEntscheidungen:'); for (const [k, v] of Object.entries(wahl).sort()) console.log(`  ${pct(v).padStart(5)}  ${k}`);
console.log(`\nEinschätzung: wahrscheinlichster Typ richtig in ${Math.round(100 * treffer / faelle)} % von ${faelle} Regierungszeiten; Brier ${(brier / faelle).toFixed(3)} (nur Vorab-Einschätzung: ${(priorBrier / faelle).toFixed(3)})`);
