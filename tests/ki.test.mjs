// Vom Spiel gesteuerte Länder: Logit-Wahl, Regierungen, verborgene Typen und die Einschätzung nach Bayes
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../ui/engine.js';
import * as KI from '../ui/ki.js';
import { W, spiele } from './spieler.mjs';

const nah = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;

test('Logit: P(o) = exp(λU) / Σ exp(λU)', () => {
  const s = { w: {}, f: {} };
  const opts = [
    { verfuegbar: true, dient: { a: 2 } },
    { verfuegbar: true, dient: { a: 1 } },
    { verfuegbar: false, dient: { a: 9 } },
  ];
  const gew = { a: {}, b: { a: 1 } };
  const p1 = KI.wahrscheinlichkeiten(s, opts, gew, 1);
  assert.ok(nah(p1[0], Math.exp(2) / (Math.exp(2) + Math.exp(1))));
  assert.equal(p1[2], 0);
  const p0 = KI.wahrscheinlichkeiten(s, opts, gew, 0);
  assert.ok(nah(p0[0], 0.5) && nah(p0[1], 0.5));
  // Zufallsausgänge gehen mit ihrer Wahrscheinlichkeit in den erwarteten Nutzen ein
  const o = { dient: { a: 1 }, zufall: [{ p: 0.25, dient: { a: 4 } }, { dient: { a: -1 } }] };
  assert.ok(nah(KI.nutzen(s, o, gew), 1 + 0.25 * 4 - 0.75));
});

test('Startregierungen, Typen und Vorab-Einschätzung', () => {
  const welt = E.neueWelt(W, { spieler: ['brd'], seed: 3 });
  assert.equal(welt.laender.usa.regime, 'truman');
  assert.equal(welt.laender.su.regime, 'stalin');
  assert.ok(['ernst', 'stoermanoever'].includes(welt.laender.su.typ));
  const E0 = welt.laender.brd.einschaetzung.su;
  assert.equal(E0.regime, 'stalin');
  assert.ok(nah(Object.values(E0.p).reduce((a, b) => a + b, 0), 1));
  const R = W.laender.su.regierungen.stalin;
  const prior = KI.typPrior(welt, R);
  assert.ok(nah(prior.stoermanoever, 0.75) && nah(prior.ernst, 0.25));
  // Ohne Bericht im ersten Halbjahr steht die Einschätzung noch bei der Vorab-Einschätzung
  if (!E0.verlauf.length) assert.deepEqual(E0.p, prior);
  // Bei Geschichtstreue 0 sind alle Typen gleich wahrscheinlich
  const frei = E.neueWelt(W, { spieler: ['brd'], seed: 3, geschichtstreue: 0 });
  assert.ok(nah(KI.typPrior(frei, R).ernst, 0.5));
});

test('Im historischen Modus kommen die historischen Regierungen, solange die Lage ähnlich ist', () => {
  let anders = 0;
  for (let seed = 1; seed <= 40; seed++) {
    const { welt } = spiele(seed, 'historisch');
    assert.deepEqual(welt.laender.usa.regierungen.map(r => r.regime), ['truman', 'eisenhower', 'kennedy', 'johnson']);
    const su = welt.laender.su.regierungen.map(r => r.regime).join(',');
    if (su === 'stalin,kollektiv,malenkow,chruschtschow') continue;
    // Berija hat nur eine Chance, wenn Moskau am 17. Juni nachgegeben hat
    assert.ok(welt.weltflags.juni17_zugestaendnisse, su);
    anders++;
  }
  assert.ok(anders <= 4, `${anders} von 40 Partien mit anderer Führung in Moskau`);
});

test('Im freien Modus kommen auch andere Regierungen, und jede Entscheidung der Supermächte kommt vor', () => {
  const regime = new Set(), entscheidungen = new Set();
  for (let seed = 1; seed <= 250; seed++) {
    for (const [st, g] of [['zufall', 0], ['einheit', 0.5], ['ost', 0]]) {
      if (seed > 120 && st !== 'zufall') continue;
      const { welt } = spiele(seed, st, null, { geschichtstreue: g });
      for (const land of ['usa', 'su']) {
        for (const r of welt.laender[land].regierungen) regime.add(land + ':' + r.regime);
        for (const c of welt.laender[land].chronik) if (c.art !== 'wechsel') entscheidungen.add(`${land}:${c.id}:${c.wahl}`);
      }
    }
  }
  for (const land of ['usa', 'su']) {
    for (const r of Object.keys(W.laender[land].regierungen)) assert.ok(regime.has(land + ':' + r), 'nie regiert: ' + land + ':' + r);
    const s = E.sicht(W, E.neueWelt(W, { spieler: ['brd'], seed: 1 }), land);
    for (const ev of W.laender[land].ereignisse) {
      for (const o of E.txt(ev.optionen, s)) {
        assert.ok(entscheidungen.has(`${land}:${ev.id}:${E.txt(o.text, s)}`), `nie gewählt: ${land}:${ev.id} → ${E.txt(o.text, s)}`);
      }
    }
  }
});

test('Die Einschätzung ist kalibriert: Wo Bonn 70 % sagt, stimmt es in etwa 70 % der Fälle', () => {
  // Im historischen Modus streuen die Gewichte nicht; Bonn kennt also das Entscheidungsmodell.
  // Dann muss die Bayes-Einschätzung im Mittel stimmen (gemessen am Ende jeder Regierungszeit).
  const klassen = [[0, 0.2], [0.2, 0.4], [0.4, 0.6], [0.6, 0.8], [0.8, 1.01]].map(([a, b]) => ({ a, b, n: 0, wahr: 0, summe: 0 }));
  let besser = 0, faelle = 0;
  for (let seed = 1; seed <= 250; seed++) {
    const { welt } = spiele(seed, seed % 2 ? 'historisch' : 'zufall');
    for (const land of ['usa', 'su']) {
      const L = welt.laender[land];
      const Ein = welt.laender.brd.einschaetzung[land];
      const schaetzungen = [...Ein.frueher, { regime: Ein.regime, p: Ein.p }];
      L.regierungen.forEach((r, i) => {
        if (!r.typ) return;
        const p = schaetzungen[i].p;
        const prior = KI.typPrior(welt, W.laender[land].regierungen[r.regime]);
        faelle++;
        if (p[r.typ] > prior[r.typ]) besser++;
        for (const [t, q] of Object.entries(p)) {
          const k = klassen.find(x => q >= x.a && q < x.b);
          k.n++; k.summe += q; if (t === r.typ) k.wahr++;
        }
      });
    }
  }
  for (const k of klassen) {
    if (k.n < 60) continue;
    const vorhergesagt = k.summe / k.n, beobachtet = k.wahr / k.n;
    assert.ok(Math.abs(vorhergesagt - beobachtet) < 0.08, `Klasse ${k.a}–${k.b}: vorhergesagt ${vorhergesagt.toFixed(2)}, beobachtet ${beobachtet.toFixed(2)} (n=${k.n})`);
  }
  // Und Bonn lernt etwas: Meist liegt die Einschätzung am Ende näher an der Wahrheit als vorher
  assert.ok(besser / faelle > 0.6, `nur ${besser} von ${faelle}`);
});

test('Rückfrage: Moskau entscheidet über die Viermächtekonferenz, und Bonn sieht die Antwort', () => {
  let ja = 0, nein = 0;
  for (let seed = 1; seed <= 80; seed++) {
    const { welt } = spiele(seed, 'einheit');
    const c = welt.laender.su.chronik.find(x => x.id === 'su_viermaechte_wahlen' || x.id === 'su_viermaechte_rat');
    if (!c) continue;
    assert.equal(c.oeffentlich, false); // Rückfragen stehen nicht in der Zeitung
    const brd = welt.laender.brd;
    if (brd.f.neutral || brd.f.vereinigt || brd.chronik.some(x => x.id === 'n_abkommen')) ja++; else nein++;
  }
  assert.ok(ja > 0 && nein > 0, `ja ${ja}, nein ${nein}`);
});
