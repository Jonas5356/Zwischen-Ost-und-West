import { spiele, sz } from './spieler.mjs';
import * as E from '../ui/engine.js';

const strat = process.argv[2] || 'alle';
const n = Number(process.argv[3] || 300);
const strategien = strat === 'alle' ? ['historisch', 'west', 'zufall', 'ost'] : [strat];
const alleGesehen = new Map();
for (const st of strategien) {
  const enden = {};
  const wahl = { 1953: [], 1957: [], 1961: [] };
  const wachstum = [], al = [], hh = [];
  let vereinigt = 0, mauer = 0;
  for (let i = 1; i <= n; i++) {
    const { s, gesehen } = spiele(i, st);
    for (const g of gesehen) alleGesehen.set(g, (alleGesehen.get(g) || 0) + 1);
    enden[s.ende.id] = (enden[s.ende.id] || 0) + 1;
    for (const w of s.wahlen) { const j = E.jahrVon(w.zeit); (wahl[j] ||= []).push(w.stimmen.Union); }
    const v = s.verlauf;
    if (v.length) wachstum.push(v.reduce((a, b) => a + b.wachstum, 0) / v.length);
    al.push(s.w.arbeitslosigkeit); hh.push(s.w.haushalt);
    if (s.f.vereinigt) vereinigt++;
    if (s.f.mauer) mauer++;
  }
  const m = a => a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) : '-';
  console.log(`\n== ${st} (${n} Spiele)`);
  console.log('Enden:', enden);
  console.log('Union bei Wahlen:', Object.fromEntries(Object.entries(wahl).map(([k, v]) => [k, `${m(v)} (n=${v.length})`])));
  console.log('Ø Wachstum', m(wachstum), '| AL Ende', m(al), '| Haushalt Ende', m(hh), '| vereinigt', vereinigt, '| Mauer', mauer);
}
const nie = sz.ereignisse.filter(e => !alleGesehen.has(e.id)).map(e => e.id);
console.log('\nNie gesehene Ereignisse:', nie.join(', ') || '–');
