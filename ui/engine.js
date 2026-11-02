// Spielablauf – unabhängig von den konkreten Ländern.
//
// Der Spielstand („Welt“) ist ein reines Datenobjekt und als JSON speicherbar. Er enthält
// alle Länder, die gerichteten Beziehungen zwischen ihnen (0–100, hoch = gut), ein Postfach
// für Nachrichten zwischen Ländern, Weltflags und die Vorgänge des laufenden Halbjahrs.
//
// Die Inhalte eines Landes (Ereignisse, Modell, Texte) sehen nicht die ganze Welt, sondern
// eine „Landsicht“: ein Objekt, das sich wie früher der Spielstand eines einzelnen Landes
// verhält (s.w, s.f, s.zeit …). Werte, die eine Beziehung sind (z. B. „usa“ bei der BRD),
// werden dabei in die Beziehungstabelle der Welt umgeleitet.

import * as KI from './ki.js';

export const VERSION = 4;

// ---------- Zeit: Halbjahre als 1952.1 (I) und 1952.2 (II) ----------

export function zeitIndex(z) {
  const jahr = Math.floor(z + 1e-9);
  const halb = Math.round((z - jahr) * 10);
  return jahr * 2 + (halb - 1);
}
export function zeitAusIndex(i) {
  return Number((Math.floor(i / 2) + (i % 2 === 0 ? 0.1 : 0.2)).toFixed(1));
}
export const zeitPlus = (z, n) => zeitAusIndex(zeitIndex(z) + n);
export const jahrVon = z => Math.floor(z + 1e-9);
export const halbVon = z => Math.round((z - jahrVon(z)) * 10);
export const zeitText = z => `${jahrVon(z)}/${halbVon(z) === 1 ? 'I' : 'II'}`;
export const zeitLang = z => `${halbVon(z) === 1 ? 'Erstes' : 'Zweites'} Halbjahr ${jahrVon(z)}`;

// ---------- Zufall (reproduzierbar, Zustand in der Welt) ----------

export function zufall(s) {
  let t = (s.rng = (s.rng + 0x6d2b79f5) >>> 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export function normal(s) {
  const u = Math.max(zufall(s), 1e-9);
  const v = zufall(s);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ---------- Hilfen ----------

export const txt = (x, s) => (typeof x === 'function' ? x(s) : x);
export const runde1 = x => Math.round(x * 10) / 10;
const ordnungVon = ev => ev?.ordnung ?? 6;

// ---------- Beziehungen ----------

export const STANDARD_BEZIEHUNG = 50;

/** Wie sieht Land `von` das Land `zu`? 0 = feindlich, 100 = engste Partnerschaft */
export function beziehung(welt, von, zu) {
  return welt.beziehungen[von]?.[zu] ?? STANDARD_BEZIEHUNG;
}
export function setzeBeziehung(welt, von, zu, wert) {
  (welt.beziehungen[von] ||= {})[zu] = wert;
}

// ---------- Landsicht ----------

const WELTFELDER = new Set(['zeit', 'runde', 'seed', 'rng', 'ende', 'anfrage']);
const sichten = new WeakMap();

/**
 * Sicht eines Landes auf die Welt. Verhält sich wie der Zustand eines einzelnen Landes:
 * eigene Werte und Flags, dazu Zeit und Zufall der Welt. Werte mit `beziehung: 'usa'`
 * in der Wertedefinition stehen für „wie die USA dieses Land sehen“.
 */
export function sicht(W, welt, land = welt.spieler[0]) {
  let proLand = sichten.get(welt);
  if (!proLand) sichten.set(welt, (proLand = new Map()));
  const L = welt.laender[land];
  const alt = proLand.get(land);
  if (alt && alt.ziel === L) return alt.sicht;

  const werte = W.laender[land].werte || {};
  const quelle = k => werte[k]?.beziehung;
  const w = new Proxy(L.w, {
    get(t, k) {
      const von = typeof k === 'string' && quelle(k);
      return von ? beziehung(welt, von, land) : t[k];
    },
    set(t, k, v) {
      const von = typeof k === 'string' && quelle(k);
      if (von) setzeBeziehung(welt, von, land, v);
      else t[k] = v;
      return true;
    },
    has(t, k) { return !!quelle(k) || k in t; },
  });
  const s = new Proxy(L, {
    get(t, k) {
      if (k === 'w') return w;
      if (k === 'land') return land;
      if (k === 'welt') return welt;
      if (k === 'weltflags') return welt.weltflags;
      if (k === 'andere') return id => sicht(W, welt, id);
      if (WELTFELDER.has(k)) return welt[k];
      return t[k];
    },
    set(t, k, v) {
      if (WELTFELDER.has(k)) welt[k] = v;
      else t[k] = v;
      return true;
    },
  });
  proLand.set(land, { ziel: L, sicht: s });
  return s;
}

export const istMensch = (welt, land) => welt.spieler.includes(land);

// ---------- Wirkungen ----------

export function begrenze(M, s, key) {
  const d = M.werte[key];
  if (!d) return;
  if (d.min !== undefined && s.w[key] < d.min) s.w[key] = d.min;
  if (d.max !== undefined && s.w[key] > d.max) s.w[key] = d.max;
}

/** Wendet eine Wirkung an: { w:{wert:delta}, setze, loesche, plane, kanzler, aktion } */
export function wende(W, welt, land, eff) {
  if (!eff) return;
  const M = W.laender[land];
  const s = sicht(W, welt, land);
  const w = txt(eff.w, s);
  if (w) {
    for (const [k, d] of Object.entries(w)) {
      if (s.w[k] === undefined) s.w[k] = 0;
      s.w[k] += d;
      begrenze(M, s, k);
    }
  }
  if (eff.setze) {
    if (Array.isArray(eff.setze)) for (const f of eff.setze) s.f[f] = true;
    else Object.assign(s.f, eff.setze);
  }
  if (eff.loesche) for (const f of eff.loesche) delete s.f[f];
  if (eff.plane) {
    for (const p of eff.plane) s.geplant.push({ id: p.id, zeit: zeitPlus(s.zeit, p.in ?? 1) });
  }
  if (eff.kanzler) s.kanzler = eff.kanzler;
  if (eff.aktion) eff.aktion(s, api(W, welt, land));
  for (const k of Object.keys(M.werte)) begrenze(M, s, k);
}

/** Werkzeuge für eigene Aktionen in den Inhalten eines Landes */
export function api(W, welt, land) {
  const s = sicht(W, welt, land);
  return {
    zufall: () => zufall(welt),
    normal: () => normal(welt),
    wende: eff => wende(W, welt, land, eff),
    plane: (id, n = 1) => s.geplant.push({ id, zeit: zeitPlus(welt.zeit, n) }),
    // Ein vom Spiel gesteuertes Land kann nur Enden auslösen, die alle betreffen (z. B. Krieg)
    ende: id => {
      if (!istMensch(welt, land) && !(W.weltenden || []).includes(id)) return;
      welt.ende = { id, zeit: welt.zeit, land: istMensch(welt, land) ? land : welt.spieler[0], ausgeloest: land };
    },
    sende: (an, art, daten = {}) => sende(welt, land, an, art, daten),
    weltflag: (name, wert = true) => { welt.weltflags[name] = wert; },
  };
}

// ---------- Postfach ----------

/** Eine Nachricht von einem Land an ein anderes, z. B. ein Verhandlungsangebot */
export function sende(welt, von, an, art, daten = {}) {
  welt.postfach.push({ nr: (welt.naechsteNachricht = (welt.naechsteNachricht || 0) + 1), von, an, art, daten, zeit: welt.zeit, offen: true });
}
export function offeneNachricht(welt, an, art, von) {
  return welt.postfach.find(n => n.offen && n.an === an && n.art === art && (!von || n.von === von)) || null;
}

// ---------- Schnappschüsse ----------

function schnappschuss(M, s) {
  const o = {};
  for (const k of Object.keys(M.werte)) o[k] = s.w[k];
  return o;
}
export function differenz(M, vorher, s) {
  const d = [];
  for (const k of Object.keys(M.werte)) {
    const def = M.werte[k];
    if (def.versteckt) continue;
    const delta = runde1((s.w[k] ?? 0) - (vorher[k] ?? 0));
    if (Math.abs(delta) >= 0.5) d.push({ key: k, delta });
  }
  return d;
}

// ---------- Spiel anlegen ----------

function neuesLand(M) {
  const st = M.startzustand ? M.startzustand() : {};
  // weitere Felder des Startzustands (z. B. kanzlerpartei) unverändert übernehmen
  const { w, f, kanzler, regierung, sitze, ...weitere } = st;
  return {
    ...JSON.parse(JSON.stringify(weitere)),
    w: { ...(st.w || {}) },
    f: { ...(st.f || {}) },
    kanzler: st.kanzler ?? null,
    regierung: [...(st.regierung || [])],
    sitze: { ...(st.sitze || {}) },
    geplant: [],
    wahlplan: [...(M.wahlen || [])],
    erledigt: {},
    vorhabenErledigt: {},
    vorhabenZuletzt: {},
    chronik: [],
    wahlen: [],
    verlauf: [],
    einschub: [],
    lage: null,
  };
}

/**
 * Neue Welt. `geschichtstreue` (0…1): 1 = Regierungen und ihre Ziele wie in der Geschichte,
 * 0 = frei gelost (siehe ki.js).
 */
export function neueWelt(W, { spieler, seed, geschichtstreue = 1 } = {}) {
  seed ??= (Date.now() ^ (Math.random() * 1e9)) >>> 0;
  spieler ??= [W.spielbar[0]];
  const welt = {
    version: VERSION,
    szenario: W.id,
    seed,
    rng: seed >>> 0,
    zeit: W.start,
    runde: 1,
    spieler: [...spieler],
    geschichtstreue: Math.max(0, Math.min(1, geschichtstreue)),
    laender: {},
    beziehungen: {},
    postfach: [],
    weltflags: {},
    weltErledigt: {},
    telegramme: {},
    queue: [],
    pos: 0,
    phase: 'lage',
    ergebnis: null,
    ende: null,
  };
  for (const [id, M] of Object.entries(W.laender)) welt.laender[id] = neuesLand(M);
  for (const [von, ziele] of Object.entries(W.startBeziehungen || {})) {
    for (const [zu, wert] of Object.entries(ziele)) setzeBeziehung(welt, von, zu, wert);
  }
  for (const id of Object.keys(W.laender)) {
    W.laender[id].modell?.initialisiere?.(sicht(W, welt, id), api(W, welt, id));
  }
  KI.initialisiere(W, welt);
  starteRunde(W, welt);
  return welt;
}

// ---------- Ereignisse finden ----------

function imFenster(ev, z) {
  const ab = ev.ab ?? ev.zeit;
  const bis = ev.bis ?? ev.zeit ?? ab;
  if (ab === undefined) return true; // z. B. Ereignisse, die nur durch eine Nachricht ausgelöst werden
  return zeitIndex(z) >= zeitIndex(ab) && zeitIndex(z) <= zeitIndex(bis);
}

export function findeEreignis(W, welt, land, id) {
  const M = W.laender[land];
  if (id.startsWith('dyn:')) {
    const bau = M.dynamisch?.[id.slice(4)];
    const s = sicht(W, welt, land);
    return bau ? { id, ...bau(s, api(W, welt, land)), dynamisch: true } : null;
  }
  return M.ereignisIndex[id] || null;
}

/** Kann das Ereignis jetzt vorkommen (Zeitfenster, Bedingung, Auslöser)? */
function moeglich(W, welt, land, ev, s) {
  const L = welt.laender[land];
  if (!ev.wiederholbar && L.erledigt[ev.id] !== undefined) return false;
  if (!imFenster(ev, welt.zeit)) return false;
  if (ev.ausloeser && !offeneNachricht(welt, land, ev.ausloeser, ev.ausloeserVon)) return false;
  return !ev.wenn || ev.wenn(s);
}

const istHauptereignis = ev => ev.art !== 'akte' && !ev.nurGeplant && !ev.nurRueckfrage;
const istVorhaben = item => item.id === '@vorhaben';
const istTelegramm = item => item.id === '@telegramm';

// ---------- Rundenablauf ----------

function weltereignisse(W, welt) {
  for (const ev of W.weltereignisse || []) {
    if (welt.weltErledigt[ev.id] || !imFenster(ev, welt.zeit)) continue;
    if (ev.wenn && !ev.wenn(welt)) continue;
    welt.weltErledigt[ev.id] = welt.zeit;
    ev.aktion?.(welt, {
      weltflag: (name, wert = true) => { welt.weltflags[name] = wert; },
      sende: (von, an, art, daten) => sende(welt, von, an, art, daten),
      plane: (land, id, n = 0) => welt.laender[land].geplant.push({ id, zeit: zeitPlus(welt.zeit, n) }),
    });
  }
}

/** Vorgänge eines Landes für das neue Halbjahr, nach Monat sortiert */
function vorgaengeEinesLandes(W, welt, land) {
  const M = W.laender[land];
  const L = welt.laender[land];
  const s = sicht(W, welt, land);
  if (!M.ereignisse?.length) return [];

  // 1. Geplante Folgeereignisse
  const faellig = L.geplant.filter(g => zeitIndex(g.zeit) <= zeitIndex(welt.zeit));
  L.geplant = L.geplant.filter(g => zeitIndex(g.zeit) > zeitIndex(welt.zeit));
  const geplant = [];
  for (const g of faellig) {
    const ev = findeEreignis(W, welt, land, g.id);
    if (!ev || L.erledigt[g.id] !== undefined) continue;
    if (ev.wenn && !ev.wenn(s)) continue;
    geplant.push(ev);
  }

  // 2. Hauptereignisse, deren Zeitfenster passt (oder deren Auslöser im Postfach liegt)
  const haupt = M.ereignisse.filter(ev => istHauptereignis(ev) && moeglich(W, welt, land, ev, s));
  const alle = [...geplant, ...haupt.filter(h => !geplant.includes(h))];
  alle.sort((a, b) => ordnungVon(a) - ordnungVon(b));

  // 3. Akten (Briefe) – nur für gespielte Länder, zufällig aus den passenden
  let gewaehlt = [];
  if (istMensch(welt, land)) {
    const anzahl = M.modell?.aktenProRunde ? M.modell.aktenProRunde(s, alle.length) : 1;
    const pool = M.ereignisse.filter(ev => ev.art === 'akte' && moeglich(W, welt, land, ev, s));
    // Akten, deren Fenster bald schließt, bevorzugen
    pool.sort((a, b) => zeitIndex(a.bis ?? a.ab) - zeitIndex(b.bis ?? b.ab));
    while (gewaehlt.length < anzahl && pool.length) {
      const dringend = pool.filter(p => zeitIndex(p.bis ?? p.ab) === zeitIndex(welt.zeit));
      const quelle = dringend.length ? dringend : pool;
      const ev = quelle[Math.floor(zufall(welt) * quelle.length)];
      gewaehlt.push(ev);
      pool.splice(pool.indexOf(ev), 1);
    }
  }
  // Akten zwischen die Hauptereignisse mischen, chronologisch nach "ordnung"
  return [...alle, ...gewaehlt].sort((a, b) => ordnungVon(a) - ordnungVon(b)).map(ev => ({ land, id: ev.id, ordnung: ordnungVon(ev) }));
}

export function starteRunde(W, welt) {
  welt.queue = [];
  welt.pos = 0;
  welt.ergebnis = null;
  welt.modellGelaufen = false;
  KI.rundenstart(W, welt);
  weltereignisse(W, welt);

  const items = [];
  for (const land of Object.keys(W.laender)) items.push(...vorgaengeEinesLandes(W, welt, land));
  // Stabil nach Monat sortieren: bei Gleichstand bleibt die Reihenfolge der Länder
  items.sort((a, b) => a.ordnung - b.ordnung);
  welt.queue = items.map(({ land, id }) => ({ land, id }));

  // Regierungsvorhaben am Ende des Halbjahrs (gesteuerte Länder wählen selbst)
  for (const land of Object.keys(W.laender)) if (W.laender[land].vorhaben?.length) welt.queue.push({ land, id: '@vorhaben' });

  for (const land of Object.keys(W.laender)) {
    const M = W.laender[land];
    if (!M.modell?.lagebericht) continue;
    const L = welt.laender[land];
    L.lage = M.modell.lagebericht(sicht(W, welt, land));
    // Meldungen jedes Halbjahrs aufheben, damit ältere Zeitungsausgaben nachlesbar bleiben
    (L.ausgaben ||= []).push({ zeit: welt.zeit, meldungen: L.lage?.meldungen || [] });
  }
  // Das Halbjahr beginnt direkt mit dem ersten Vorgang (der Lagebericht steht in der Zeitung)
  welt.phase = 'spiel';
}

/** Der Vorgang, um den es gerade geht – aus Sicht des Spielers */
export function aktuelles(W, welt) {
  if (welt.ende) return { typ: 'ende' };
  const land = welt.spieler[0];
  if (welt.phase === 'lage') welt.phase = 'spiel'; // ältere Spielstände
  if (welt.phase === 'wahl') {
    const L = welt.laender[welt.wahlLand];
    return { typ: 'wahl', land: welt.wahlLand, ergebnis: L.wahlen[L.wahlen.length - 1] };
  }
  if (welt.phase === 'ergebnis') return { typ: 'ergebnis', land: welt.ergebnisLand, ergebnis: welt.ergebnis };
  vorruecken(W, welt);
  if (welt.ende) return { typ: 'ende' };
  if (welt.phase !== 'spiel') return aktuelles(W, welt);
  const item = welt.queue[welt.pos];
  if (!item) return { typ: 'rundenende' };
  if (istVorhaben(item)) return { typ: 'vorhaben', land: item.land, liste: verfuegbareVorhaben(W, welt, item.land) };
  if (istTelegramm(item)) return { typ: 'telegramm', land: item.land, telegramm: welt.telegramme[item.nr] };
  return { typ: 'ereignis', land: item.land, ev: findeEreignis(W, welt, item.land, item.id) };
}

/**
 * Hinfällige Vorgänge überspringen und Vorgänge von Ländern, die nicht gespielt werden,
 * automatisch entscheiden, bis ein Vorgang des Spielers ansteht oder das Halbjahr endet.
 */
function vorruecken(W, welt) {
  for (let schutz = 0; schutz < 10000; schutz++) {
    if (welt.ende || welt.phase !== 'spiel') return;
    const item = welt.queue[welt.pos];
    if (!item) {
      if (!welt.modellGelaufen) rundenende(W, welt);
      else abschliessen(W, welt);
      continue;
    }
    if (istTelegramm(item)) return;
    if (istVorhaben(item)) {
      if (istMensch(welt, item.land)) return;
      KI.waehleVorhaben(W, welt, item.land, verfuegbareVorhaben(W, welt, item.land).filter(v => v.leistbar), id => vorhabenAnwenden(W, welt, item.land, id));
      naechsterVorgang(W, welt, true);
      continue;
    }
    const ev = findeEreignis(W, welt, item.land, item.id);
    const s = sicht(W, welt, item.land);
    if (!ev || (!ev.dynamisch && ev.wenn && !ev.wenn(s))) { welt.pos++; continue; }
    if (istMensch(welt, item.land)) return;
    // Land wird vom Spiel gesteuert: entscheiden und weiter
    spielEntscheidet(W, welt, item.land, ev);
    naechsterVorgang(W, welt, false);
  }
  throw new Error('Endlosschleife im Spielablauf');
}

/**
 * Ein vom Spiel gesteuertes Land entscheidet. Länder mit Regierungen (`regierungen` im
 * Landesmodul) wählen nach ihren Zielen (ki.js); andere nehmen die historische, sonst die
 * erste mögliche Option. Gibt den Index der gewählten Option zurück.
 */
function spielEntscheidet(W, welt, land, ev) {
  const M = W.laender[land];
  const opts = optionen(W, welt, land, ev);
  if (!opts.some(o => o.verfuegbar)) throw new Error(`Keine mögliche Option bei ${land}:${ev.id}`);
  if (KI.istKI(W, welt, land)) {
    const { index, like } = KI.waehle(W, welt, land, ev, opts);
    entscheide(W, welt, land, ev, index);
    KI.beobachte(W, welt, land, ev, opts.find(o => o.index === index), like);
    return index;
  }
  // Eigene Entscheidungsregel des Szenarios (z. B. in Tests), sonst die historische, sonst die erste Option
  const index = W.ki ? W.ki(sicht(W, welt, land), ev, opts)
    : (opts.find(x => x.verfuegbar && x.hist) || opts.find(x => x.verfuegbar)).index;
  entscheide(W, welt, land, ev, index);
  return index;
}

/** Zufallsausgang einer Wirkung (`zufall: [{ p, … }, { … }]`) auslosen und anwenden */
function wendeZufall(W, welt, land, eff, texte) {
  if (!eff.zufall) return;
  const s = sicht(W, welt, land);
  const r = zufall(welt);
  let summe = 0;
  let treffer = null;
  for (const z of eff.zufall) {
    if (z.p === undefined) { treffer = z; break; }
    summe += Math.max(0, Math.min(1, txt(z.p, s)));
    if (r < summe) { treffer = z; break; }
  }
  if (treffer) {
    wende(W, welt, land, treffer);
    if (treffer.ergebnis) texte.push(txt(treffer.ergebnis, s));
  }
  return treffer;
}

/**
 * Wirkung einer Entscheidung bei anderen Ländern. Wird ein betroffenes Land gespielt und hat
 * ein anderes Land entschieden, bekommt der Spieler ein Telegramm: was geschah und was es
 * für ihn bedeutet (`ergebnis` der Wirkung, aus seiner Sicht in der dritten Person).
 */
function wendeBei(W, welt, land, ev, quelle, texte) {
  const s = sicht(W, welt, land);
  const bei = txt(quelle.bei, s) || {};
  for (const [ziel, eff] of Object.entries(bei)) {
    if (!eff || !W.laender[ziel]) continue;
    const Mz = W.laender[ziel];
    const sz = sicht(W, welt, ziel);
    const vorher = schnappschuss(Mz, sz);
    wende(W, welt, ziel, eff);
    if (!istMensch(welt, ziel) || istMensch(welt, land)) continue;
    const nr = (welt.naechstesTelegramm = (welt.naechstesTelegramm || 0) + 1);
    (welt.telegramme ||= {})[nr] = {
      von: land,
      titel: txt(eff.titel, sz) || txt(ev.titel, s),
      // was es für das betroffene Land heißt; sonst, was entschieden wurde
      texte: (eff.ergebnis ? [txt(eff.ergebnis, sz)] : [...texte]).filter(Boolean),
      aenderungen: differenz(Mz, vorher, sz),
      zeit: welt.zeit,
    };
    // gleich nach dem laufenden Vorgang zeigen
    welt.queue.splice(welt.pos + 1, 0, { land: ziel, id: '@telegramm', nr });
  }
}

/**
 * Rückfrage: Eine Option fragt ein vom Spiel gesteuertes Land, das sofort entscheidet
 * (`rueckfrage: { land, id, daten }`, das Ereignis dort mit `nurRueckfrage: true`). Je nach
 * dessen Antwort (`antwort` an der gewählten Option) gilt `antworten[antwort]`.
 */
function rueckfrage(W, welt, land, o, texte) {
  const s = sicht(W, welt, land);
  const rf = txt(o.rueckfrage, s);
  if (!rf) return;
  if (istMensch(welt, rf.land)) throw new Error('Rückfragen an gespielte Länder sind noch nicht möglich: ' + rf.land);
  const ev2 = findeEreignis(W, welt, rf.land, rf.id);
  if (!ev2) throw new Error(`Unbekannte Rückfrage ${rf.land}:${rf.id}`);
  const vorher = welt.anfrage;
  welt.anfrage = { von: land, ...(rf.daten || {}) };
  const index = spielEntscheidet(W, welt, rf.land, ev2);
  welt.anfrage = vorher;
  const antwort = txt(ev2.optionen, sicht(W, welt, rf.land))[index].antwort;
  const eff = txt(o.antworten, s)?.[antwort];
  if (!eff) throw new Error(`Keine Wirkung für Antwort ${antwort} (${rf.land}:${rf.id})`);
  wende(W, welt, land, eff);
  if (eff.ergebnis) texte.push(txt(eff.ergebnis, s));
  wendeZufall(W, welt, land, eff, texte);
}

/** Optionen eines Ereignisses mit Verfügbarkeit */
export function optionen(W, welt, land, ev) {
  const s = sicht(W, welt, land);
  return (txt(ev.optionen, s) || []).map((o, i) => ({
    ...o,
    index: i,
    verfuegbar: !o.wenn || o.wenn(s),
    sichtbar: !o.nurWenn || o.nurWenn(s),
  })).filter(o => o.sichtbar);
}

export function lageGesehen(W, welt) {
  if (welt.phase === 'lage') welt.phase = 'spiel';
  vorruecken(W, welt);
}

/** Kern einer Entscheidung, gleich für Spieler und automatisch gesteuerte Länder */
function entscheide(W, welt, land, ev, index) {
  const M = W.laender[land];
  const L = welt.laender[land];
  const s = sicht(W, welt, land);
  const opts = txt(ev.optionen, s);
  const o = opts[index];
  if (!o || (o.wenn && !o.wenn(s))) throw new Error('Option nicht verfügbar');
  const vorher = schnappschuss(M, s);
  const texte = [];

  wende(W, welt, land, o);
  M.modell?.nachOption?.(s, o, ev, api(W, welt, land));
  if (o.ergebnis) texte.push(txt(o.ergebnis, s));
  if (o.rueckfrage) rueckfrage(W, welt, land, o, texte);
  const getroffen = wendeZufall(W, welt, land, o, texte);
  // Wirkungen bei anderen Ländern (`bei: { brd: { w, setze, ergebnis } }`), auch aus dem Zufallsausgang
  for (const quelle of [o, getroffen]) if (quelle?.bei) wendeBei(W, welt, land, ev, quelle, texte);

  // Auslösende Nachricht ist damit beantwortet
  if (ev.ausloeser) {
    const n = offeneNachricht(welt, land, ev.ausloeser, ev.ausloeserVon);
    if (n) n.offen = false;
  }

  L.erledigt[ev.id] = index;
  welt.letzteOrdnung = ev.dynamisch ? 99 : ordnungVon(ev);
  ev.nachher?.(s, api(W, welt, land));
  const hatHist = opts.some(x => x.hist);
  L.chronik.push({
    zeit: welt.zeit,
    id: ev.id,
    titel: txt(ev.titel, s),
    datum: txt(ev.datum, s) ?? null,
    art: ev.art || 'haupt',
    wahl: txt(o.text, s),
    hist: hatHist ? !!o.hist : null,
    ergebnis: texte.join(' '),
    // für Zeitung und Einschätzung: Entscheidungen, die niemand mitbekommt, und Rückfragen nicht
    oeffentlich: !(o.still || ev.geheim || ev.nurRueckfrage),
    // innenpolitische Kleinigkeiten und Briefe stehen nicht in den Zeitungen anderer Länder
    ...(ev.inland || ev.art === 'akte' ? { inland: true } : {}),
  });

  const ergebnis = {
    titel: txt(ev.titel, s),
    texte,
    historisch: txt(ev.historisch, s) || null,
    hist: hatHist ? !!o.hist : null,
    aenderungen: differenz(M, vorher, s),
    ascii: txt(o.ascii, s) || null,
  };
  M.modell?.pruefeKrise?.(s, api(W, welt, land));
  M.modell?.nachEntscheidung?.(s);
  KI.pruefeRegime(W, welt, land);
  return ergebnis;
}

/** Der Spieler entscheidet den aktuellen Vorgang */
export function waehle(W, welt, index) {
  const item = welt.queue[welt.pos];
  if (welt.phase !== 'spiel') throw new Error('Der Vorgang ist schon entschieden');
  if (!item || istVorhaben(item) || istTelegramm(item) || !istMensch(welt, item.land)) throw new Error('Kein Vorgang des Spielers');
  const ev = findeEreignis(W, welt, item.land, item.id);
  welt.ergebnis = entscheide(W, welt, item.land, ev, index);
  welt.ergebnisLand = item.land;
  welt.ergebnisVorhaben = false;
  welt.phase = 'ergebnis';
  return welt.ergebnis;
}

/** Kostenlose Vorhaben gehen immer, auch bei leerer Kasse; sonst muss der Haushalt reichen */
const istLeistbar = (s, v) => !v.kosten || s.w.haushalt - v.kosten >= 0;

export function verfuegbareVorhaben(W, welt, land = welt.spieler[0]) {
  const M = W.laender[land];
  const L = welt.laender[land];
  const s = sicht(W, welt, land);
  return (M.vorhaben || [])
    .filter(v => imFenster(v, welt.zeit) && (!v.wenn || v.wenn(s)))
    .filter(v => {
      const n = L.vorhabenErledigt[v.id] || 0;
      if (!v.wiederholbar) return n === 0;
      if (v.max && n >= v.max) return false;
      const zuletzt = L.vorhabenZuletzt?.[v.id];
      return zuletzt === undefined || zeitIndex(welt.zeit) - zeitIndex(zuletzt) >= (v.abstand ?? 2);
    })
    .map(v => ({ ...v, leistbar: istLeistbar(s, v) }));
}

export function waehleVorhaben(W, welt, id) {
  const item = welt.queue[welt.pos];
  if (welt.phase !== 'spiel') throw new Error('Das Vorhaben ist schon entschieden');
  if (!item || !istVorhaben(item)) throw new Error('Kein Regierungsvorhaben an der Reihe');
  welt.ergebnis = vorhabenAnwenden(W, welt, item.land, id);
  welt.ergebnisLand = item.land;
  welt.ergebnisVorhaben = true;
  welt.phase = 'ergebnis';
  return welt.ergebnis;
}

/** Ein Regierungsvorhaben einbringen (oder keines, id = null) – für Spieler und gesteuerte Länder */
function vorhabenAnwenden(W, welt, land, id) {
  const M = W.laender[land];
  const L = welt.laender[land];
  const s = sicht(W, welt, land);
  const vorher = schnappschuss(M, s);
  const texte = [];
  let titel = 'Kein neues Vorhaben';
  let historisch = null;
  if (id) {
    const v = M.vorhaben.find(x => x.id === id);
    if (!v) throw new Error('Unbekanntes Vorhaben');
    if (!istLeistbar(s, v)) throw new Error('Nicht finanzierbar');
    s.w.haushalt -= v.kosten || 0;
    wende(W, welt, land, v);
    L.vorhabenErledigt[v.id] = (L.vorhabenErledigt[v.id] || 0) + 1;
    L.vorhabenZuletzt[v.id] = welt.zeit;
    titel = txt(v.titel, s);
    if (v.ergebnis) texte.push(txt(v.ergebnis, s));
    historisch = txt(v.historisch, s) || null;
    L.chronik.push({ zeit: welt.zeit, id: 'vorhaben:' + v.id, titel, art: 'vorhaben', wahl: 'Regierungsvorhaben', hist: null, ergebnis: texte.join(' '), oeffentlich: false });
  } else {
    texte.push('Die Regierung beschränkt sich in diesem Halbjahr auf die laufenden Geschäfte.');
  }
  const ergebnis = { titel, texte, historisch, hist: null, aenderungen: differenz(M, vorher, s), vorhaben: true };
  M.modell?.nachEntscheidung?.(s);
  KI.pruefeRegime(W, welt, land);
  return ergebnis;
}

/** Krisenereignisse, die Länder in `einschub` angemeldet haben, einsammeln */
function einschuebe(welt) {
  const out = [];
  for (const [land, L] of Object.entries(welt.laender)) {
    if (L.einschub?.length) {
      out.push(...L.einschub.map(id => ({ land, id })));
      L.einschub = [];
    }
  }
  return out;
}

function naechsterVorgang(W, welt, nachVorhaben) {
  welt.pos++;
  if (!nachVorhaben) aktualisiereQueue(W, welt, welt.letzteOrdnung ?? 0);
  // Kriseneffekte können neue Ereignisse direkt einschieben
  const neu = einschuebe(welt);
  if (neu.length) welt.queue.splice(welt.pos, 0, ...neu);
}

/** Nach einer Ergebnisanzeige, einem Telegramm oder dem Wahlabend weiter */
export function weiter(W, welt) {
  if (welt.ende) return;
  const item = welt.queue[welt.pos];
  if (welt.phase === 'spiel' && item && istTelegramm(item)) {
    delete welt.telegramme[item.nr];
    welt.pos++;
  } else if (welt.phase === 'wahl') {
    welt.phase = 'spiel';
  } else if (welt.phase === 'ergebnis') {
    welt.phase = 'spiel';
    naechsterVorgang(W, welt, welt.ergebnisVorhaben);
  } else if (welt.phase === 'lage') {
    welt.phase = 'spiel';
  }
  vorruecken(W, welt);
}

function rundenende(W, welt) {
  for (const land of Object.keys(W.laender)) {
    const M = W.laender[land];
    if (!M.modell?.rundenende) continue;
    const L = welt.laender[land];
    const s = sicht(W, welt, land);
    const vorher = schnappschuss(M, s);
    M.modell.rundenende(s, api(W, welt, land));
    L.verlauf.push({ zeit: welt.zeit, ...schnappschuss(M, s) });
    L.letzteAenderung = differenz(M, vorher, s);
  }
  welt.modellGelaufen = true;

  // Wahlen
  for (const land of Object.keys(W.laender)) {
    const M = W.laender[land];
    const L = welt.laender[land];
    const wahl = (L.wahlplan || []).find(z => zeitIndex(z) === zeitIndex(welt.zeit));
    if (wahl === undefined || L.f['wahl_' + welt.zeit] || welt.ende || !M.modell?.wahl) continue;
    L.f['wahl_' + welt.zeit] = true;
    L.wahlen.push(M.modell.wahl(sicht(W, welt, land), api(W, welt, land)));
    // Regierungsbildung als dynamisches Ereignis vor der nächsten Runde
    welt.queue.push({ land, id: 'dyn:regierungsbildung' });
    if (istMensch(welt, land)) {
      welt.phase = 'wahl';
      welt.wahlLand = land;
      return;
    }
  }
  abschliessen(W, welt);
}

function abschliessen(W, welt) {
  for (const land of Object.keys(W.laender)) {
    W.laender[land].modell?.pruefeEnde?.(sicht(W, welt, land), api(W, welt, land));
    if (welt.ende) return;
  }
  // Krisenereignisse zum Rundenende (z. B. Koalitionsbruch)
  const neu = einschuebe(welt);
  if (neu.length) {
    welt.queue.push(...neu);
    welt.phase = 'spiel';
    return;
  }
  naechsteRunde(W, welt);
}

function naechsteRunde(W, welt) {
  if (zeitIndex(welt.zeit) >= zeitIndex(W.ende)) {
    welt.ende = { id: 'abschluss', zeit: welt.zeit, land: welt.spieler[0] };
    return;
  }
  welt.zeit = zeitPlus(welt.zeit, 1);
  welt.runde++;
  starteRunde(W, welt);
}

/**
 * Nach jeder Entscheidung: Ereignisse, die durch die Entscheidung erst möglich wurden
 * (gleiches Halbjahr, späterer Zeitpunkt), einreihen und hinfällige entfernen – für alle Länder.
 */
function aktualisiereQueue(W, welt, abOrdnung) {
  const rest = welt.queue.slice(welt.pos);
  const bleibt = rest.filter(item => {
    if (istVorhaben(item) || istTelegramm(item) || item.id.startsWith('dyn:')) return true;
    const L = welt.laender[item.land];
    if (L.erledigt[item.id] !== undefined && !findeEreignis(W, welt, item.land, item.id)?.wiederholbar) return false;
    const ev = findeEreignis(W, welt, item.land, item.id);
    return ev && (!ev.wenn || ev.wenn(sicht(W, welt, item.land)));
  });
  const drin = (land, id) => welt.queue.some(q => q.land === land && q.id === id) || bleibt.some(q => q.land === land && q.id === id);
  for (const land of Object.keys(W.laender)) {
    const M = W.laender[land];
    if (!M.ereignisse?.length) continue;
    const s = sicht(W, welt, land);
    for (const ev of M.ereignisse) {
      if (!istHauptereignis(ev) || drin(land, ev.id)) continue;
      if (ordnungVon(ev) < abOrdnung) continue;
      if (!moeglich(W, welt, land, ev, s)) continue;
      bleibt.push({ land, id: ev.id });
    }
  }
  // Fällige geplante Ereignisse (z. B. aus einer Entscheidung in diesem Halbjahr mit in: 0)
  for (const land of Object.keys(W.laender)) {
    const L = welt.laender[land];
    const faellig = L.geplant.filter(g => zeitIndex(g.zeit) <= zeitIndex(welt.zeit));
    if (!faellig.length) continue;
    L.geplant = L.geplant.filter(g => zeitIndex(g.zeit) > zeitIndex(welt.zeit));
    for (const g of faellig) {
      if (!bleibt.some(q => q.land === land && q.id === g.id) && L.erledigt[g.id] === undefined) bleibt.push({ land, id: g.id });
    }
  }
  const ord = item => {
    if (istVorhaben(item)) return 1e9;
    if (istTelegramm(item)) return -2;
    if (item.id.startsWith('dyn:')) return -1;
    return ordnungVon(findeEreignis(W, welt, item.land, item.id));
  };
  bleibt.sort((a, b) => ord(a) - ord(b));
  welt.queue = welt.queue.slice(0, welt.pos).concat(bleibt);
}

/** Szenario vorbereiten: Indizes anlegen und Daten prüfen */
export function bereiteVor(W) {
  for (const [id, M] of Object.entries(W.laender)) {
    M.id ??= id;
    M.werte ??= {};
    M.ereignisse ??= [];
    M.vorhaben ??= [];
    M.ereignisIndex = {};
    for (const ev of M.ereignisse) {
      if (M.ereignisIndex[ev.id]) throw new Error(`Doppelte Ereignis-ID in ${id}: ${ev.id}`);
      M.ereignisIndex[ev.id] = ev;
    }
    const ids = new Set(M.vorhaben.map(v => v.id));
    if (ids.size !== M.vorhaben.length) throw new Error('Doppelte Vorhaben-ID in ' + id);
    for (const [k, d] of Object.entries(M.werte)) {
      if (d.beziehung && !W.laender[d.beziehung]) throw new Error(`Wert ${id}.${k} verweist auf unbekanntes Land ${d.beziehung}`);
    }
  }
  for (const land of W.spielbar) if (!W.laender[land]) throw new Error('Spielbares Land fehlt: ' + land);
  return W;
}

/** Richtung der Auswirkungen für die Oberfläche */
export function hinweisPfeile(M, o) {
  const w = typeof o.w === 'function' ? null : o.w;
  const out = [];
  if (w) {
    for (const [k, d] of Object.entries(w)) {
      const def = M.werte[k];
      if (!def || def.versteckt || def.keinHinweis || Math.abs(d) < 1) continue;
      const stufe = Math.abs(d) >= 10 ? 3 : Math.abs(d) >= 5 ? 2 : 1;
      const hoch = d > 0;
      const gut = def.neutral ? null : (def.invertiert ? !hoch : hoch);
      out.push({ key: k, name: def.kurz || def.name, hoch, stufe, gut });
    }
  }
  return { pfeile: out, ungewiss: !!o.zufall };
}
