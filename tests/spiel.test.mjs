import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spiele, sz, W } from './spieler.mjs';
import * as E from '../ui/engine.js';

test('Zeitrechnung in Halbjahren', () => {
  assert.equal(E.zeitPlus(1949.2, 1), 1950.1);
  assert.equal(E.zeitPlus(1950.1, 1), 1950.2);
  assert.equal(E.zeitPlus(1949.2, 29), 1964.1);
  assert.equal(E.zeitText(1952.1), '1952/I');
});

test('Jedes Ereignis hat Titel, Text und mindestens eine Option', () => {
  for (const ev of sz.ereignisse) {
    assert.ok(ev.titel, ev.id);
    assert.ok(ev.text, ev.id);
    assert.ok(ev.optionen, ev.id);
  }
});

test('Zufallsspiele laufen fehlerfrei durch', () => {
  for (let i = 1; i <= 300; i++) {
    for (const st of ['zufall', 'ost', 'west', 'einheit']) {
      const { s } = spiele(i, st);
      assert.ok(s.ende, 'Spiel ohne Ende');
      assert.ok(sz.enden[s.ende.id], 'unbekanntes Ende ' + s.ende.id);
      E.txt(sz.enden[s.ende.id].text, s);
    }
  }
});

test('Spielstand ist als JSON speicherbar und lässt sich fortsetzen', () => {
  const welt = E.neueWelt(W, { spieler: ['brd'], seed: 42 });
  E.lageGesehen(W, welt);
  E.aktuelles(W, welt);
  E.waehle(W, welt, 0);
  const kopie = JSON.parse(JSON.stringify(welt));
  E.weiter(W, kopie);
  E.weiter(W, welt);
  assert.deepEqual(kopie, welt);
  assert.equal(welt.version, 2);
});

test('Historischer Durchlauf liegt nahe an der Geschichte', () => {
  const union = { 1953: [], 1957: [], 1961: [] };
  const al = [];
  for (let i = 1; i <= 100; i++) {
    const { s } = spiele(i, 'historisch');
    assert.equal(s.f.mauer, true);
    for (const w of s.wahlen) union[E.jahrVon(w.zeit)].push(w.stimmen.Union);
    al.push(s.w.arbeitslosigkeit);
  }
  const m = a => a.reduce((x, y) => x + y, 0) / a.length;
  assert.ok(Math.abs(m(union[1953]) - 45.2) < 3, 'Wahl 1953: ' + m(union[1953]));
  assert.ok(Math.abs(m(union[1957]) - 50.2) < 3, 'Wahl 1957: ' + m(union[1957]));
  assert.ok(Math.abs(m(union[1961]) - 45.3) < 3, 'Wahl 1961: ' + m(union[1961]));
  assert.ok(m(al) < 2, 'Arbeitslosigkeit 1964: ' + m(al));
});

test('Jedes Ereignis kommt in irgendeinem Spiel vor', () => {
  const gesehen = new Set();
  for (let i = 1; i <= 400; i++) for (const st of ['zufall', 'ost', 'einheit', 'historisch']) for (const g of spiele(i, st).gesehen) gesehen.add(g);
  const nie = sz.ereignisse.filter(e => !gesehen.has(e.id)).map(e => e.id);
  assert.deepEqual(nie, []);
});

test('Kostenlose Vorhaben sind auch bei leerem Haushalt wählbar', () => {
  const welt = E.neueWelt(W, { spieler: ['brd'], seed: 3 });
  const s = E.sicht(W, welt, 'brd');
  s.w.haushalt = -0.4;
  const liste = E.verfuegbareVorhaben(W, welt, 'brd');
  const frei = liste.filter(v => !v.kosten);
  assert.ok(frei.length > 0);
  assert.ok(frei.every(v => v.leistbar));
  assert.ok(liste.filter(v => v.kosten).every(v => !v.leistbar));
  welt.queue = [{ land: 'brd', id: '@vorhaben' }];
  welt.pos = 0;
  welt.phase = 'spiel';
  E.waehleVorhaben(W, welt, frei.find(v => v.id === 'konsolidierung').id);
  assert.ok(s.w.haushalt > 0);
});
