// Nach der Einheit darf in Texten nicht mehr von der Teilung die Rede sein
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sz, W } from './spieler.mjs';
import * as E from '../ui/engine.js';

const VERBOTEN = /\bDDR\b|Ost-Berlin|West-Berlin|Ostsektor|Zonengrenze|Sowjetzone|Mauer|Interzonen|Wiedervereinigung|beide[rn]? deutschen? Staat|zwei deutsche|Volkspolizei|Fluchtbewegung|Flüchtlinge aus der|Westdeutsch|Bundesrepublik/;
// Erlaubt: Rückblicke in den Ereignissen des Einheitsstrangs und Satzteile, die ausdrücklich in die Vergangenheit verweisen
const ERLAUBT = /früheren DDR|ehemaligen DDR|der früheren Sowjetzone/g;

function texteVon(sz, s, ev) {
  const t = [];
  for (const k of ['titel', 'datum', 'text', 'absender', 'historisch']) if (k !== 'historisch') t.push(E.txt(ev[k], s));
  for (const o of E.txt(ev.optionen, s) || []) {
    t.push(E.txt(o.text, s), E.txt(o.ergebnis, s), E.txt(o.beschreibung, s));
    for (const z of o.zufall || []) t.push(E.txt(z.ergebnis, s));
  }
  return t.filter(Boolean).map(x => String(x).replace(ERLAUBT, ''));
}

test('Nach der Einheit kommt die Teilung in keinem Text mehr vor', () => {
  const fehler = new Set();
  for (let seed = 1; seed <= 250; seed++) {
    const welt = E.neueWelt(W, { spieler: ['brd'], seed });
    const s = E.sicht(W, welt, 'brd');
    let n = 0;
    while (!welt.ende && n++ < 3000) {
      const a = E.aktuelles(W, welt);
      if (a.typ === 'lage') {
        if (s.f.vereinigt) for (const m of s.lage?.meldungen || []) if (VERBOTEN.test(m.replace(ERLAUBT, ''))) fehler.add('Zeitgeschehen: ' + m);
        E.lageGesehen(W, welt); continue;
      }
      if (a.typ === 'ergebnis' || a.typ === 'wahl' || a.typ === 'rundenende') { E.weiter(W, welt); continue; }
      if (a.typ === 'vorhaben') {
        if (s.f.vereinigt) for (const v of a.liste) for (const x of [E.txt(v.titel, s), E.txt(v.beschreibung, s), E.txt(v.ergebnis, s)]) if (VERBOTEN.test(x)) fehler.add('Vorhaben ' + v.id + ': ' + x.match(VERBOTEN)[0]);
        const l = a.liste.filter(v => v.leistbar);
        E.waehleVorhaben(W, welt, l.length ? l[seed % l.length].id : null); continue;
      }
      const ev = a.ev;
      if (s.f.vereinigt) for (const x of texteVon(sz, s, ev)) { const m = x.match(VERBOTEN); if (m) fehler.add(`${ev.id}: „${m[0]}“`); }
      const opts = E.optionen(W, welt, a.land, ev).filter(o => o.verfuegbar);
      // Den Weg zur Einheit gehen, sonst zufällig
      let o = opts[(seed * 7 + n) % opts.length];
      if (ev.id === 'stalin_note') o = opts[2];
      if (/^n_(viermaechte|abkommen)$/.test(ev.id) || ev.id === 'berliner_konferenz') o = opts.find(x => x.richtung === 'ost') || opts[0];
      E.waehle(W, welt, o.index);
    }
    if (welt.ende && s.f.vereinigt) {
      // Der Rückblick auf die Absichten Washingtons und Moskaus darf von der Teilung sprechen
      const t = E.txt(sz.enden[s.ende.id].text, s).split('\n\n').filter(x => !x.startsWith('Was Washington und Moskau wirklich wollten')).join('\n\n').replace(ERLAUBT, '');
      const m = t.match(VERBOTEN); if (m) fehler.add(`Ende ${s.ende.id}: „${m[0]}“`);
    }
  }
  assert.deepEqual([...fehler].sort(), []);
});
