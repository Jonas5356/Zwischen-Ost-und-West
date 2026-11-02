// Regierungswechsel: Das Spiel geht weiter, wenn die Union die Macht verliert,
// und unter einer SPD-geführten Regierung passen die Texte.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sz, W, spiele } from './spieler.mjs';
import * as E from '../ui/engine.js';
import * as M from '../ui/szenarien/kalter_krieg/brd/modell.js';

// Unionsminister mit Namen, Unions-Absender und Sätze, in denen die SPD als Opposition auftritt
const VERBOTEN = new RegExp([
  'Adenauer', 'Schäffer', 'Strauß', 'Brentano', '\\bBlank\\b', 'Globke', 'Wuermeling', 'Oberländer', 'Anton Storch',
  'Jakob Kaiser', 'Robert Lehr', 'Erhard, Bundesminister', 'Gerhard Schröder, Bundesminister', 'Erhards? (ist|droht|hält|will|tourt|zieht)',
  '(Finanz|Wirtschafts|Verteidigungs|Innen|Arbeits)minister (Erhard|Schröder|Heinemann|Etzel)', 'Fraktion der CDU', 'der CDU$', 'Präsidium der CDU',
  'In der Union (tobt|wächst|ist eine Mehrheit)', 'Die SPD (fordert|warnt|will|wird im|stimmt|macht die|ist überrascht|und (die|viele|Teile))',
  'mit den Stimmen der SPD', 'Für die SPD ist', 'Womit soll die Union',
].join('|'));
// Regierungsbildung, Abschlussbericht und Zeitgeschehen dürfen frühere Kanzler nennen
const AUSGENOMMEN = /^dyn:regierungsbildung$/;

function texte(s, ev, welt) {
  const t = [];
  for (const k of ['titel', 'text', 'absender']) t.push(E.txt(ev[k], s));
  for (const o of E.optionen(W, welt, 'brd', ev)) {
    t.push(E.txt(o.text, s), E.txt(o.ergebnis, s));
    for (const z of o.zufall || []) t.push(E.txt(z.ergebnis, s));
  }
  return t.filter(Boolean).map(String);
}

test('Unter einer SPD-geführten Regierung passen Absender und Texte', () => {
  const fehler = new Set();
  const varianten = [['SPD', 'FDP'], ['SPD'], ['SPD', 'Union']];
  for (let seed = 1; seed <= 300; seed++) {
    const welt = E.neueWelt(W, { spieler: ['brd'], seed });
    const s = E.sicht(W, welt, 'brd');
    const ab = 2 + (seed * 13) % 28; // frühestens im zweiten Halbjahr ist ein Wechsel möglich
    let n = 0, gewechselt = false;
    while (!welt.ende && n++ < 3000) {
      if (!gewechselt && welt.runde >= ab) { M.wechsleRegierung(s, 'SPD', varianten[seed % 3]); gewechselt = true; }
      const a = E.aktuelles(W, welt);
      if (a.typ === 'ergebnis' || a.typ === 'wahl' || a.typ === 'rundenende' || a.typ === 'telegramm') { E.weiter(W, welt); continue; }
      if (a.typ === 'vorhaben') {
        if (s.kanzlerpartei === 'SPD') for (const v of a.liste) for (const x of [E.txt(v.titel, s), E.txt(v.beschreibung, s), E.txt(v.ergebnis, s)]) { const m = x?.match(VERBOTEN); if (m) fehler.add(`Vorhaben ${v.id}: „${m[0]}“`); }
        const l = a.liste.filter(v => v.leistbar);
        E.waehleVorhaben(W, welt, l.length ? l[seed % l.length].id : null); continue;
      }
      const ev = a.ev;
      if (s.kanzlerpartei === 'SPD' && !AUSGENOMMEN.test(ev.id)) {
        for (const x of texte(s, ev, welt)) { const m = x.match(VERBOTEN); if (m) fehler.add(`${ev.id}: „${m[0]}“`); }
      }
      const opts = E.optionen(W, welt, a.land, ev).filter(o => o.verfuegbar);
      E.waehle(W, welt, opts[(seed * 7 + n) % opts.length].index);
    }
  }
  assert.deepEqual([...fehler].sort(), []);
});

test('Verlorene Wahlen und Misstrauensvoten beenden das Spiel nicht', () => {
  let spd = 0, wechsel = 0;
  for (const strategie of ['ost', 'zufall', 'einheit']) {
    for (let seed = 1; seed <= 60; seed++) {
      const { s } = spiele(seed, strategie);
      assert.ok(!['wahlniederlage', 'misstrauensvotum'].includes(s.ende.id), `Ende ${s.ende.id}`);
      assert.ok(sz.enden[s.ende.id], 'unbekanntes Ende ' + s.ende.id);
      const l = s.kanzlerliste;
      assert.equal(l[l.length - 1].name, s.kanzler, 'Kanzlerliste endet beim amtierenden Kanzler');
      assert.equal(l[l.length - 1].partei, s.kanzlerpartei || 'Union');
      if (l.some(k => k.partei === 'SPD')) spd++;
      if (new Set(l.map(k => k.partei)).size > 1) wechsel++;
    }
  }
  // Mit der Ost-Strategie verliert die Union oft; dann regiert die SPD weiter
  assert.ok(spd >= 20, `nur ${spd} Partien mit SPD-Kanzler`);
  assert.ok(wechsel >= 20);
});

test('Die Kanzlerpartei bestimmt Umfragewert und Nachfolger', () => {
  const welt = E.neueWelt(W, { spieler: ['brd'], seed: 5 });
  const s = E.sicht(W, welt, 'brd');
  assert.equal(M.kanzlerpartei(s), 'Union');
  M.wechsleRegierung(s, 'SPD', ['SPD', 'FDP']);
  assert.equal(s.kanzler, 'Schumacher');
  assert.equal(M.nachfolger(s), 'Ollenhauer');
  assert.deepEqual(s.regierung, ['SPD', 'FDP']);
  assert.ok(!s.f.grosse_koalition);
  const u = M.berechneUmfrage(s);
  assert.ok(u > 25 && u < 50, 'Umfrage der SPD ' + u);
  M.wechsleRegierung(s, 'Union', ['Union', 'SPD']);
  assert.equal(s.kanzler, 'Adenauer');
  assert.ok(s.f.grosse_koalition);
  assert.deepEqual(s.kanzlerliste.map(k => k.partei), ['Union', 'SPD', 'Union']);
});
