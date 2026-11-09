// Großbritannien: vom Spiel gesteuert, mit Wahlen, Wendepunkten und Berührungen mit Paris und Bonn
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../ui/engine.js';
import { W, spiele } from './spieler.mjs';

const gewaehlt = (welt, id) => welt.laender.grossbritannien.chronik.find(c => c.id === id);
const hist = (welt, id) => {
  const c = gewaehlt(welt, id);
  if (!c) return null;
  const ev = W.laender.grossbritannien.ereignisIndex[id];
  const s = E.sicht(W, welt, 'grossbritannien');
  const h = E.txt(ev.optionen, s).find(o => o.hist);
  return E.txt(h.text, s) === c.wahl;
};

test('Im historischen Modus fallen die britischen Wendepunkte meist wie damals', () => {
  const ids = ['gb_atomprogramm', 'gb_indien', 'gb_duenkirchen', 'gb_westunion', 'gb_schuman', 'gb_truppenzusage', 'gb_suez', 'gb_sandys', 'gb_wind_of_change', 'gb_ewg_antrag', 'gb_nassau'];
  const n = Object.fromEntries(ids.map(id => [id, [0, 0]]));
  for (let seed = 1; seed <= 40; seed++) {
    const { welt } = spiele(seed, 'historisch', null, { land: seed % 2 ? 'brd' : 'frankreich' });
    for (const id of ids) {
      const h = hist(welt, id);
      if (h === null) continue;
      n[id][1]++;
      if (h) n[id][0]++;
    }
  }
  for (const [id, [ja, alle]] of Object.entries(n)) {
    assert.ok(alle >= 20, `${id}: nur ${alle} Partien`);
    assert.ok(ja / alle >= 0.65, `${id}: nur ${ja} von ${alle} wie damals`);
  }
});

test('Texte über London nennen die Regierung, die wirklich regiert', () => {
  // Labour bleibt ab 1951 an der Regierung: Eden, Churchill und Macmillan dürfen dann nicht vorkommen
  const verboten = /\b(Eden|Churchill|Macmillan|Selwyn Lloyd|Douglas-Home)\b/;
  for (const land of ['brd', 'frankreich']) {
    for (let seed = 1; seed <= 12; seed++) {
      const texte = [];
      const eingriff = welt => {
        const L = welt.laender.grossbritannien;
        if (welt.zeit >= 1951.1 && L.premierId !== 'gaitskell') {
          L.regime = 'gaitskell';
          L.typ = 'skeptisch';
          L.premierId = 'gaitskell';
          L.partei = 'LAB';
        }
        if (welt.zeit < 1951.1) return;
        const a = E.aktuelles(W, welt);
        if (a.typ === 'telegramm') texte.push(['telegramm', a.telegramm.texte.join(' ')]);
        if (a.typ === 'ereignis' && a.land === land) {
          const s = E.sicht(W, welt, land);
          for (const k of ['titel', 'text', 'absender']) texte.push([a.ev.id, E.txt(a.ev[k], s) || '']);
          for (const o of E.optionen(W, welt, land, a.ev)) texte.push([a.ev.id, E.txt(o.text, s)]);
        }
      };
      const { welt } = spiele(seed, seed % 3 ? 'historisch' : 'zufall', null, { land, eingriff });
      for (const c of welt.laender[land].chronik) if (c.zeit >= 1951.1) texte.push([c.id, `${c.titel} ${c.wahl} ${c.ergebnis}`]);
      for (const [id, x] of texte) assert.ok(!verboten.test(x), `${land} ${id}: ${x}`);
    }
  }
});

test('Paris kann London um Abstimmung bitten; die Antwort kommt als Telegramm', () => {
  let antworten = 0;
  for (let seed = 1; seed <= 6; seed++) {
    const welt = E.neueWelt(W, { spieler: ['frankreich'], seed });
    let gefragt = false, schritte = 0;
    const telegramme = [];
    while (!welt.ende && schritte++ < 400 && welt.zeit < 1952.1) {
      const a = E.aktuelles(W, welt);
      if (a.typ === 'lage') { E.lageGesehen(W, welt); continue; }
      if (a.typ === 'ereignis' && !gefragt && welt.zeit >= 1950.1 && E.entscheidungMoeglich(W, welt)) {
        const e = E.entscheidungen(W, welt, 'frankreich').find(x => x.id === 'abstimmung_london');
        if (e?.verfuegbar) { E.triffEntscheidung(W, welt, 'abstimmung_london'); gefragt = true; continue; }
      }
      if (a.typ === 'telegramm') telegramme.push(a.telegramm.titel);
      if (a.typ === 'vorhaben') { E.waehleVorhaben(W, welt, null); continue; }
      if (a.typ === 'ereignis') {
        const o = E.optionen(W, welt, a.land, a.ev).filter(x => x.verfuegbar);
        E.waehle(W, welt, (o.find(x => x.hist) || o[0]).index);
        continue;
      }
      E.weiter(W, welt);
    }
    assert.ok(gefragt);
    assert.ok(telegramme.some(x => /London (sagt zu|winkt ab)/.test(x)), 'keine Antwort aus London: ' + telegramme.join(', '));
    assert.ok(gewaehlt(welt, 'gb_abstimmung_paris'));
    antworten++;
  }
  assert.equal(antworten, 6);
});

test('Ohne britische Truppenzusage ändert sich die Londoner Konferenz für Paris', () => {
  const eingriff = welt => {
    if (welt.zeit >= 1954.2 && welt.weltflags.gb_truppen === undefined) {
      welt.laender.grossbritannien.erledigt.gb_truppenzusage = 1;
      welt.weltflags.gb_truppen = 'nein';
    }
  };
  let gesehen = 0;
  for (let seed = 1; seed <= 10; seed++) {
    const { welt } = spiele(seed, 'historisch', null, { land: 'frankreich', eingriff });
    const c = welt.laender.frankreich.chronik.find(x => x.id === 'fr_nato_deutschland');
    if (!c) continue;
    gesehen++;
    assert.ok(/ohne britische Truppen|Zustimmen/.test(c.wahl));
    if (c.wahl.startsWith('Zustimmen')) assert.ok(c.wahl.includes('ohne britische Truppen'), c.wahl);
  }
  assert.ok(gesehen >= 5);
});
