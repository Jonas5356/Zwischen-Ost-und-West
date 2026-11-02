// Frankreich: spielbar und vom Spiel gesteuert; Wechselwirkung mit der Bundesrepublik
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../ui/engine.js';
import { W, spiele } from './spieler.mjs';

const vor1958 = F => (F.stuerze || []).filter(z => z < 1958.2).length;

test('Frankreich gespielt, historische Entscheidungen: die Geschichte kommt ungefähr wieder', () => {
  let deGaulle = 0, algerien = 0, abschluss = 0, stuerze = 0;
  const n = 40;
  for (let seed = 1; seed <= n; seed++) {
    const { welt } = spiele(seed, 'historisch', null, { land: 'frankreich' });
    const F = welt.laender.frankreich;
    if (F.f.de_gaulle) deGaulle++;
    if (F.f.algerien_unabhaengig) algerien++;
    if (welt.ende.id === 'abschluss') abschluss++;
    stuerze += vor1958(F);
  }
  assert.ok(deGaulle >= 0.75 * n, `de Gaulle nur in ${deGaulle} von ${n}`);
  assert.ok(algerien >= 0.6 * n, `Algerien unabhängig nur in ${algerien} von ${n}`);
  assert.ok(abschluss >= 0.85 * n, `nur ${abschluss} von ${n} Partien laufen bis 1964`);
  // Die Vierte Republik ist instabil: historisch etwa 15 Kabinette zwischen 1949 und 1958
  const schnitt = stuerze / n;
  assert.ok(schnitt >= 6 && schnitt <= 15, `im Schnitt ${schnitt.toFixed(1)} Regierungsstürze bis 1958`);
});

/** Ein Spieler, der immer die Option mit dem meisten Rückhalt in der Nationalversammlung wählt */
function stabilSpielen(seed) {
  const welt = E.neueWelt(W, { spieler: ['frankreich'], seed });
  const s = E.sicht(W, welt, 'frankreich');
  for (let n = 0; !welt.ende && n < 3000; n++) {
    const a = E.aktuelles(W, welt);
    if (['ergebnis', 'wahl', 'telegramm', 'rundenende'].includes(a.typ)) { E.weiter(W, welt); continue; }
    if (a.typ === 'vorhaben') {
      const l = a.liste.filter(v => v.leistbar);
      const v = l.find(x => x.id === 'verfassungsreform' || x.id === 'verfassungsreform2') || (s.w.haushalt < 20 ? l.find(x => x.id === 'konsolidierung') : null)
        || l.find(x => ['wohnungsbau', 'urlaubswoche', 'solidaritaetsfonds', 'pinay_anleihe', 'monnet_plan'].includes(x.id));
      E.waehleVorhaben(W, welt, v ? v.id : null);
      continue;
    }
    const opts = E.optionen(W, welt, a.land, a.ev).filter(o => o.verfuegbar);
    let beste = opts[0], wert = -Infinity;
    for (const o of opts) {
      // Probe am Abzug: Wie stünde die Regierung danach da? (Zufall gleich wie im echten Lauf)
      const probe = JSON.parse(JSON.stringify(welt));
      E.waehle(W, probe, o.index);
      const p = E.sicht(W, probe, 'frankreich');
      const v = p.w.mehrheit + 0.5 * p.w.zustimmung + (p.f.indochina_beendet ? 15 : 0) - (p.f.algerienkrieg && !p.f.algerien_frieden ? 15 : 0) + (p.f.algerien_verhandlung ? 8 : 0) - (probe.ende ? 1000 : 0);
      if (v > wert) { wert = v; beste = o; }
    }
    E.waehle(W, welt, beste.index);
  }
  return welt;
}

test('Wer Frankreich stabilisiert, erlebt weniger Regierungsstürze', () => {
  let stabil = 0, historisch = 0;
  const n = 20;
  for (let seed = 1; seed <= n; seed++) {
    stabil += vor1958(stabilSpielen(seed).laender.frankreich);
    historisch += vor1958(spiele(seed, 'historisch', null, { land: 'frankreich' }).welt.laender.frankreich);
  }
  assert.ok(stabil <= 0.6 * historisch, `stabil ${stabil / n} gegenüber historisch ${historisch / n} Stürzen je Partie`);
});

test('Jedes Ereignis und jedes Vorhaben Frankreichs kommt vor', () => {
  const gesehen = new Set(), vorhaben = new Set();
  for (const [str, g] of [['zufall', 1], ['zufall', 0], ['ost', 1], ['west', 0.5], ['historisch', 1]]) {
    for (let seed = 1; seed <= 60; seed++) {
      const r = spiele(seed, str, null, { land: 'frankreich', geschichtstreue: g });
      r.gesehen.forEach(x => gesehen.add(x));
      for (const c of r.welt.laender.frankreich.chronik) if (c.art === 'vorhaben') vorhaben.add(c.id.slice(9));
    }
  }
  const M = W.laender.frankreich;
  assert.deepEqual(M.ereignisse.filter(e => !gesehen.has(e.id)).map(e => e.id), []);
  assert.deepEqual(M.vorhaben.filter(v => !vorhaben.has(v.id)).map(v => v.id), []);
});

test('Gesteuertes Frankreich: EVG scheitert meist, de Gaulle kommt meist, Bonn bekommt Telegramme', () => {
  let evgGescheitert = 0, deGaulle = 0, telegramme = 0;
  const n = 40;
  for (let seed = 1; seed <= n; seed++) {
    const welt = E.neueWelt(W, { spieler: ['brd'], seed });
    let tg = 0;
    for (let i = 0; !welt.ende && i < 3000; i++) {
      const a = E.aktuelles(W, welt);
      if (a.typ === 'telegramm') { tg++; assert.ok(a.telegramm.texte.every(x => !x.includes('undefined'))); }
      if (['ergebnis', 'wahl', 'telegramm', 'rundenende'].includes(a.typ)) { E.weiter(W, welt); continue; }
      if (a.typ === 'vorhaben') { E.waehleVorhaben(W, welt, null); continue; }
      const opts = E.optionen(W, welt, a.land, a.ev).filter(o => o.verfuegbar);
      E.waehle(W, welt, (opts.find(o => o.hist) || opts[0]).index);
    }
    if (welt.weltflags.evg === 'gescheitert') evgGescheitert++;
    if (welt.laender.frankreich.f.de_gaulle) deGaulle++;
    if (tg) telegramme++;
  }
  assert.ok(evgGescheitert >= 0.6 * n, `EVG nur in ${evgGescheitert} von ${n} gescheitert`);
  assert.ok(deGaulle >= 0.65 * n, `de Gaulle nur in ${deGaulle} von ${n}`);
  assert.ok(telegramme >= 0.9 * n, `nur in ${telegramme} von ${n} Partien ein Telegramm aus Paris`);
});

test('Gesteuerte Bundesrepublik antwortet auf Paris (Postfach in beide Richtungen)', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const { welt } = spiele(seed, 'historisch', null, { land: 'frankreich' });
    assert.ok(welt.weltflags.schuman_antwort, 'Bonn hat den Schuman-Plan nicht beantwortet');
    assert.ok(welt.laender.brd.regierungen.length >= 1, 'Bonn hat keine Regierung mit Zielen');
    // Paris schätzt Bonns Absichten ein
    assert.ok(welt.laender.frankreich.einschaetzung.brd, 'keine Einschätzung über Bonn');
  }
});

test('Spielstand mit Frankreich lässt sich als JSON speichern und weiterspielen', () => {
  const welt = E.neueWelt(W, { spieler: ['frankreich'], seed: 5 });
  for (let i = 0; i < 40; i++) {
    const a = E.aktuelles(W, welt);
    if (a.typ === 'ereignis') E.waehle(W, welt, E.optionen(W, welt, a.land, a.ev).find(o => o.verfuegbar).index);
    else if (a.typ === 'vorhaben') E.waehleVorhaben(W, welt, null);
    else E.weiter(W, welt);
  }
  const kopie = JSON.parse(JSON.stringify(welt));
  assert.deepEqual(E.aktuelles(W, kopie).typ, E.aktuelles(W, welt).typ);
  assert.equal(kopie.version, E.VERSION);
});
