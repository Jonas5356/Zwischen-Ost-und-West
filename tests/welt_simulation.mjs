// Weltsimulation: Was tun die vom Spiel gesteuerten Länder, und wie gut schätzt Bonn sie ein?
//   node tests/welt_simulation.mjs [Partien] [Geschichtstreue 0…1] [Strategie] [gespieltes Land: brd|frankreich]
import { spiele, W } from './spieler.mjs';

const n = Number(process.argv[2] || 300);
const g = Number(process.argv[3] ?? 1);
const strategie = process.argv[4] || (g >= 0.99 ? 'historisch' : 'zufall');
const gespielt = process.argv[5] || 'brd';
const gesteuert = ['usa', 'su', 'frankreich', 'brd'].filter(l => l !== gespielt);

const wahl = {}, regierungen = {}, flags = {}, enden = {};
let treffer = 0, faelle = 0, brier = 0, priorBrier = 0, vereinigt = 0;
const zaehle = (o, k) => { o[k] = (o[k] || 0) + 1; };
for (let seed = 1; seed <= n; seed++) {
  const { welt } = spiele(seed, strategie, null, { geschichtstreue: g, land: gespielt });
  zaehle(enden, welt.ende.id + (welt.ende.ausgeloest && welt.ende.ausgeloest !== gespielt ? ' (' + welt.ende.ausgeloest + ')' : ''));
  if (welt.laender.brd.f?.vereinigt) vereinigt++;
  if (welt.laender.brd.nie) zaehle(flags, 'Bundesrepublik nie gegründet');
  for (const f of ['iran_besetzt', 'bizone', 'truman_doktrin', 'kominform', 'prag_putsch', 'blockade', 'blockade_ende', 'berlin_aufgegeben', 'juni17_panzer', 'juni17_zugestaendnisse', 'ungarn_einmarsch', 'ungarn_neutral', 'mauer_genehmigt', 'mauer_abgelehnt', 'raketen_kuba', 'radford', 'atomkrieg', 'suez_angriff', 'pariser_ratifiziert', 'nato_veto', 'saar_akzeptiert', 'rom_angebot']) if (welt.weltflags[f]) zaehle(flags, f);
  for (const f of ['marshall_ost', 'weststaat_usa', 'weststaat_paris', 'berlin_massnahme', 'nato_angebot', 'essentials', 'kuba_massnahme', 'kuba_ausgang', 'evg', 'schuman_antwort']) if (welt.weltflags[f]) zaehle(flags, f + '=' + welt.weltflags[f]);
  const F = welt.laender.frankreich;
  for (const f of ['de_gaulle', 'dien_bien_phu', 'indochina_beendet', 'algerien_unabhaengig', 'atomtest', 'rom_ratifiziert', 'colombey_angeboten', 'elysee', 'veto_gb']) if (F.f[f]) zaehle(flags, 'Paris: ' + f);
  zaehle(flags, 'Paris: Regierung am Ende ' + F.lager);
  zaehle(flags, 'Paris: Stürze bis 1958 ' + Math.min(15, Math.floor((F.stuerze || []).filter(z => z < 1958.2).length / 3) * 3) + '+');
  for (const land of gesteuert) {
    const L = welt.laender[land];
    for (const c of L.chronik) {
      if (c.art === 'wechsel') continue;
      zaehle(wahl, `${land}:${c.id} → ${c.wahl.slice(0, 60)}`);
    }
    for (const r of L.regierungen || []) zaehle(regierungen, `${land}:${r.regime}${r.typ ? '/' + r.typ : ''}`);
    // Einschätzung am Ende jeder Regierungszeit: Wahrscheinlichkeit des wahren Typs
    const E = welt.laender[gespielt].einschaetzung?.[land];
    if (!E) continue;
    const alle = [...(E.frueher || []), { regime: E.regime, p: E.p }];
    const regs = [...(L.regierungen || [])];
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
