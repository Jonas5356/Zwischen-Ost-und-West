// Einheitliche Werte: Außerhalb des landesspezifischen Blocks hat jedes Land dieselben Werte
// in derselben Reihenfolge, und jeder angezeigte Wert erklärt sich selbst.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { W } from './spieler.mjs';
import { STANDARD, BEZIEHUNGSREIHE } from '../ui/szenarien/kalter_krieg/werte.js';

const sichtbar = M => Object.keys(M.werte).filter(k => !M.werte[k].versteckt);
const imBlock = (M, block) => sichtbar(M).filter(k => M.werte[k].block === block);

test('Regierung, Wirtschaft und Beziehungen sind in jedem spielbaren Land gleich', () => {
  for (const land of W.spielbar) {
    const M = W.laender[land];
    for (const block of ['regierung', 'wirtschaft']) {
      const soll = Object.keys(STANDARD).filter(k => STANDARD[k].block === block);
      assert.deepEqual([...imBlock(M, block)].sort(), [...soll].sort(), `${land}: Block ${block}`);
      for (const k of soll) assert.equal(M.werte[k].name, STANDARD[k].name, `${land}: ${k} heißt anders`);
    }
    const eigeneBeziehung = Object.entries(M.werte).find(([, d]) => d.beziehung === land);
    assert.ok(!eigeneBeziehung, `${land} hat eine Beziehung zu sich selbst`);
    const bez = imBlock(M, 'beziehungen');
    assert.deepEqual([...bez].sort(), BEZIEHUNGSREIHE.filter(k => (k === 'moskau' ? 'su' : k) !== land).sort(), `${land}: Beziehungen`);
  }
});

test('Jeder angezeigte Wert gehört zu einem Block und hat eine Erklärung', () => {
  for (const land of W.spielbar) {
    const M = W.laender[land];
    for (const k of sichtbar(M)) {
      const d = M.werte[k];
      assert.ok(W.bloecke.some(b => b.id === d.block), `${land}: ${k} ohne Block`);
      assert.ok(d.erklaerung?.was && d.erklaerung?.wirkt, `${land}: ${k} ohne Erklärung`);
      if (d.block === 'land') assert.ok(M.landesspezifisch.includes(k), `${land}: ${k} fehlt in landesspezifisch`);
    }
    for (const k of M.landesspezifisch) assert.equal(M.werte[k]?.block, 'land', `${land}: ${k} ist nicht landesspezifisch`);
  }
});

test('Französische Vorlagen zeigen keine deutschen Bilder', () => {
  const DEUTSCH = ['urne', 'plakat', 'presse', 'flagge', 'bundeshaus', 'mauer'];
  const M = W.laender.frankreich;
  for (const ev of [...M.ereignisse, ...Object.values(M.enden)]) {
    const a = typeof ev.ascii === 'function' ? null : ev.ascii;
    assert.ok(!DEUTSCH.includes(a), `${ev.id || ev.titel}: ${a}`);
    for (const o of Array.isArray(ev.optionen) ? ev.optionen : []) assert.ok(!DEUTSCH.includes(o.ascii), `${ev.id}: ${o.ascii}`);
  }
});
