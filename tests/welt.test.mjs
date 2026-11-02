// Grundfunktionen der Welt: mehrere Länder, Postfach, Beziehungen, Weltereignisse,
// automatisch entscheidende Länder. Geprüft an einer kleinen Testwelt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../ui/engine.js';

function testwelt({ bAntwortet = true, ki } = {}) {
  const gespielt = {
    werte: {
      ruf: { name: 'Ruf', min: 0, max: 100 },
      b: { name: 'Beziehung zu B', min: 0, max: 100, beziehung: 'b' },
    },
    startzustand: () => ({ w: { ruf: 50 } }),
    ereignisse: [
      { id: 'antwort', ausloeser: 'angebot', ordnung: 9, titel: 'Angebot aus B', text: 'B bietet etwas an.',
        optionen: [
          { text: 'Annehmen', w: { b: 10 }, aktion: (s, a) => a.sende('b', 'zusage') },
          { text: 'Ablehnen', w: { b: -10 } },
        ] },
      { id: 'krieg', ab: 1951.1, ordnung: 2, wenn: s => !!s.weltflags.krise, titel: 'Krise', text: 'Krise.',
        optionen: [{ text: 'Ruhe bewahren', w: { ruf: 1 } }] },
      { id: 'immer', ab: 1950.1, bis: 1951.2, ordnung: 12, titel: 'Routine', text: 'Routine.',
        optionen: [{ text: 'Ok' }] },
    ],
  };
  const automatisch = {
    werte: {},
    ereignisse: [
      { id: 'anbieten', ab: 1950.1, ordnung: 3, titel: 'Angebot machen?', text: '…',
        optionen: [
          { text: 'Anbieten', hist: true, aktion: (s, a) => a.sende('a', 'angebot', { summe: 3 }) },
          { text: 'Nicht anbieten' },
        ] },
      { id: 'reaktion', ausloeser: 'zusage', ordnung: 10, titel: 'Zusage erhalten', text: '…',
        optionen: [{ text: 'Freuen', setze: ['zufrieden'] }] },
    ],
  };
  return E.bereiteVor({
    id: 'test', start: 1949.2, ende: 1951.2,
    laender: { b: automatisch, a: gespielt },
    spielbar: ['a'],
    startBeziehungen: { b: { a: 95 } },
    weltereignisse: [{ id: 'krise', ab: 1951.1, aktion: (w, api) => api.weltflag('krise') }],
    ki: bAntwortet ? undefined : ki,
  });
}

/** Spielt, bis der Spieler entscheiden muss; gibt den Vorgang zurück */
function bisZumSpieler(W, welt) {
  for (let i = 0; i < 100; i++) {
    const a = E.aktuelles(W, welt);
    if (a.typ === 'lage') { E.lageGesehen(W, welt); continue; }
    if (a.typ === 'ergebnis' || a.typ === 'wahl' || a.typ === 'rundenende') { E.weiter(W, welt); continue; }
    return a;
  }
  throw new Error('kein Vorgang');
}

test('Ein Angebot des automatisch gesteuerten Landes löst beim Spieler ein Ereignis aus', () => {
  const W = testwelt();
  const welt = E.neueWelt(W, { spieler: ['a'], seed: 1 });
  const a = bisZumSpieler(W, welt);
  // 1950/I: B hat im März angeboten, A antwortet im September desselben Halbjahrs
  assert.equal(E.zeitText(welt.zeit), '1950/I');
  assert.equal(a.ev.id, 'antwort');
  assert.equal(welt.laender.b.chronik[0].id, 'anbieten');
  assert.ok(E.offeneNachricht(welt, 'a', 'angebot'));
  E.waehle(W, welt, 0);
  // Nachricht ist beantwortet, Beziehung gestiegen und auf 100 begrenzt
  assert.equal(E.offeneNachricht(welt, 'a', 'angebot'), null);
  assert.equal(E.beziehung(welt, 'b', 'a'), 100);
  // B reagiert noch im selben Halbjahr (Oktober) automatisch auf die Zusage
  E.weiter(W, welt);
  const naechstes = bisZumSpieler(W, welt);
  assert.equal(naechstes.ev.id, 'immer');
  assert.equal(welt.laender.b.f.zufrieden, true);
});

test('Ohne Angebot gibt es auch kein Antwortereignis', () => {
  const W = testwelt({ bAntwortet: false, ki: (s, ev, opts) => (opts.find(o => o.text === 'Nicht anbieten') || opts[0]).index });
  const welt = E.neueWelt(W, { spieler: ['a'], seed: 1 });
  const gesehen = [];
  for (let i = 0; i < 200 && !welt.ende; i++) {
    const a = E.aktuelles(W, welt);
    if (a.typ === 'lage') E.lageGesehen(W, welt);
    else if (a.typ === 'ereignis') { gesehen.push(a.ev.id); E.waehle(W, welt, 0); }
    else E.weiter(W, welt);
  }
  assert.ok(welt.ende);
  assert.ok(!gesehen.includes('antwort'));
  assert.ok(gesehen.includes('immer'));
});

test('Weltereignisse setzen Weltflags, auf die Länder reagieren', () => {
  const W = testwelt();
  const welt = E.neueWelt(W, { spieler: ['a'], seed: 2 });
  const gesehen = [];
  for (let i = 0; i < 200 && !welt.ende; i++) {
    const a = E.aktuelles(W, welt);
    if (a.typ === 'lage') E.lageGesehen(W, welt);
    else if (a.typ === 'ereignis') { gesehen.push(E.zeitText(welt.zeit) + ' ' + a.ev.id); E.waehle(W, welt, 0); }
    else E.weiter(W, welt);
  }
  assert.equal(welt.weltflags.krise, true);
  assert.equal(welt.weltErledigt.krise, 1951.1);
  assert.ok(gesehen.includes('1951/I krieg'));
});

test('Werte mit Beziehung landen in der Beziehungstabelle der Welt', () => {
  const W = testwelt();
  const welt = E.neueWelt(W, { spieler: ['a'], seed: 3 });
  const s = E.sicht(W, welt, 'a');
  assert.equal(s.w.b, 95);
  s.w.b -= 20;
  assert.equal(welt.beziehungen.b.a, 75);
  assert.equal(E.beziehung(welt, 'a', 'b'), E.STANDARD_BEZIEHUNG);
  assert.ok(!('b' in welt.laender.a.w));
});

test('Eine Welt lässt sich mitten im Spiel speichern und fortsetzen', () => {
  const W = testwelt();
  const welt = E.neueWelt(W, { spieler: ['a'], seed: 4 });
  bisZumSpieler(W, welt);
  const kopie = JSON.parse(JSON.stringify(welt));
  for (const w of [welt, kopie]) { E.waehle(W, w, 0); E.weiter(W, w); bisZumSpieler(W, w); }
  assert.deepEqual(kopie, welt);
});
