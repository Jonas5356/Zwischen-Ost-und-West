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
    // Über Europa entscheidet die Regierung, die gerade in London ist – unter Labour fällt der EWG-Antrag meist aus
    assert.ok(ja / alle >= (id === 'gb_ewg_antrag' ? 0.55 : 0.65), `${id}: nur ${ja} von ${alle} wie damals`);
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

// ------------------------------------------------------------------ Großbritannien gespielt

const sieger = e => (e.sitze.CON > e.sitze.LAB ? 'CON' : 'LAB');

test('Großbritannien gespielt, historische Entscheidungen: die Wahlen gehen meist aus wie damals', () => {
  const n = 40;
  const z = { 1950.1: 0, 1951.2: 0, 1955.1: 0, 1959.2: 0 };
  const soll = { 1950.1: 'LAB', 1951.2: 'CON', 1955.1: 'CON', 1959.2: 'CON' };
  let premiers = 0;
  for (let seed = 1; seed <= n; seed++) {
    const { welt } = spiele(seed, 'historisch', null, { land: 'grossbritannien' });
    const L = welt.laender.grossbritannien;
    for (const e of L.wahlen) if (soll[e.zeit] && sieger(e) === soll[e.zeit]) z[e.zeit]++;
    if (L.chefliste.map(c => c.id).join() === 'attlee,churchill,eden,macmillan,home') premiers++;
  }
  for (const [zeit, k] of Object.entries(z)) assert.ok(k >= 0.75 * n, `${zeit}: nur ${k} von ${n} wie damals`);
  assert.ok(premiers >= 0.7 * n, `nur ${premiers} von ${n} Partien mit den Premierministern der Geschichte`);
});

test('Wer anders spielt, regiert anders: Labour kann bleiben, die Konservativen früher kommen', () => {
  const folgen = new Set();
  let wahlen = 0;
  for (let seed = 1; seed <= 40; seed++) {
    const { welt } = spiele(seed, 'zufall', null, { land: 'grossbritannien', geschichtstreue: 0 });
    const L = welt.laender.grossbritannien;
    folgen.add(L.chefliste.map(c => c.id).join('>'));
    wahlen += L.wahlen.length;
    // Gewählt wird spätestens nach fünf Jahren
    const zeiten = [1945.2, ...L.wahlen.map(e => e.zeit)];
    for (let i = 1; i < zeiten.length; i++) assert.ok(E.zeitIndex(zeiten[i]) - E.zeitIndex(zeiten[i - 1]) <= 10, `Seed ${seed}: ${zeiten.join(', ')}`);
  }
  assert.ok(folgen.size >= 10, `nur ${folgen.size} verschiedene Reihen von Premierministern`);
  assert.ok(wahlen >= 40 * 3, `nur ${wahlen} Wahlen in 40 Partien`);
});

test('Jedes Ereignis, jede Akte und jedes Vorhaben Großbritanniens kommt vor', () => {
  const gesehen = new Set(), vorhaben = new Set();
  const nimm = r => {
    r.gesehen.forEach(x => gesehen.add(x));
    for (const c of r.welt.laender.grossbritannien.chronik) if (c.art === 'vorhaben') vorhaben.add(c.id.slice(9));
  };
  // Seltene Wege: Indien halten; Labour 1951 an der Regierung ohne Truppen in Korea; Suez ohne Druck aus Washington
  for (let seed = 1; seed <= 6; seed++) nimm(spiele(seed, 'historisch', null, { land: 'grossbritannien', vorgabe: { gb_indien: 1 } }));
  for (let seed = 1; seed <= 10; seed++) {
    const eingriff = welt => { if (E.zeitIndex(welt.zeit) === E.zeitIndex(1956.2) && !welt.weltflags.suez_gewaehren) { welt.laender.usa.erledigt.usa_suez = 1; welt.weltflags.suez_gewaehren = true; } };
    nimm(spiele(seed, 'historisch', null, { land: 'grossbritannien', eingriff }));
  }
  // Die Konservativen regieren schon 1950/51 (Ausgang der Wahl erzwungen)
  for (let seed = 1; seed <= 6; seed++) {
    const eingriff = welt => {
      const L = welt.laender.grossbritannien;
      if (E.zeitIndex(welt.zeit) === E.zeitIndex(1950.2) && L.partei === 'LAB' && !L.f.test_wechsel) { L.f.test_wechsel = true; L.partei = 'CON'; L.premierId = 'churchill'; L.parteiSeit = 1950.2; L.legislaturBeginn = 1950.1; L.wahlplan = [1950.1, 1955.1]; }
    };
    nimm(spiele(seed, 'historisch', null, { land: 'grossbritannien', eingriff }));
  }
  // Labour regiert bis in die sechziger Jahre (Nachfolge Attlees)
  for (let seed = 1; seed <= 6; seed++) {
    const eingriff = welt => {
      const L = welt.laender.grossbritannien;
      if (welt.zeit >= 1950.2 && L.partei === 'CON' && !L.f.test_labour) { L.f.test_labour = true; L.partei = 'LAB'; L.premierId = 'attlee'; L.fuehrer = { ...L.fuehrer, LAB: 'attlee', CON: 'churchill' }; }
    };
    nimm(spiele(seed, 'historisch', null, { land: 'grossbritannien', eingriff }));
  }
  for (const [str, g] of [['zufall', 1], ['zufall', 0], ['ost', 1], ['west', 0.5], ['historisch', 1]]) {
    for (let seed = 1; seed <= 50; seed++) nimm(spiele(seed, str, null, { land: 'grossbritannien', geschichtstreue: g }));
  }
  const M = W.laender.grossbritannien;
  assert.deepEqual(M.ereignisse.filter(e => !gesehen.has(e.id)).map(e => e.id), []);
  assert.deepEqual(M.vorhaben.filter(v => !vorhaben.has(v.id)).map(v => v.id), []);
});

test('Gespieltes Großbritannien bekommt Antworten aus Paris und Bonn als Telegramm', () => {
  const titel = new Set();
  for (let seed = 1; seed <= 12; seed++) {
    const welt = E.neueWelt(W, { spieler: ['grossbritannien'], seed });
    let schritte = 0;
    while (!welt.ende && schritte++ < 3000) {
      const a = E.aktuelles(W, welt);
      if (a.typ === 'lage') { E.lageGesehen(W, welt); continue; }
      if (a.typ === 'telegramm') titel.add(a.telegramm.titel);
      if (a.typ === 'vorhaben') { E.waehleVorhaben(W, welt, null); continue; }
      if (a.typ === 'ereignis') {
        // Ab und zu Bonn um Devisenausgleich bitten
        if (E.entscheidungMoeglich(W, welt) && seed % 2 === 0) {
          const e = E.entscheidungen(W, welt, 'grossbritannien').find(x => x.id === 'devisenausgleich' && x.verfuegbar);
          if (e) { E.triffEntscheidung(W, welt, e.id); continue; }
        }
        const o = E.optionen(W, welt, a.land, a.ev).filter(x => x.verfuegbar);
        E.waehle(W, welt, (o.find(x => x.hist) || o[0]).index);
        continue;
      }
      E.weiter(W, welt);
    }
  }
  for (const t of ['Paris sagt Ja', 'Der Brüsseler Pakt']) assert.ok(titel.has(t), `kein Telegramm „${t}“: ${[...titel].join(', ')}`);
  assert.ok(titel.has('Bonn zahlt') || titel.has('Bonn zahlt nicht'), [...titel].join(', '));
});

test('Spielstand mit Großbritannien lässt sich als JSON speichern und weiterspielen', () => {
  const welt = E.neueWelt(W, { spieler: ['grossbritannien'], seed: 3 });
  for (let i = 0; i < 60; i++) {
    const a = E.aktuelles(W, welt);
    if (a.typ === 'ereignis') E.waehle(W, welt, E.optionen(W, welt, a.land, a.ev).filter(x => x.verfuegbar)[0].index);
    else if (a.typ === 'vorhaben') E.waehleVorhaben(W, welt, null);
    else if (a.typ === 'lage') E.lageGesehen(W, welt);
    else E.weiter(W, welt);
  }
  const kopie = JSON.parse(JSON.stringify(welt));
  assert.deepEqual(kopie, welt);
  assert.ok(E.aktuelles(W, kopie));
});
