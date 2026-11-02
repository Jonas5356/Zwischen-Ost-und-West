// Spielablauf – unabhängig vom konkreten Szenario.
// Der Spielstand ist ein reines Datenobjekt (speicherbar als JSON); alle Regeln,
// Texte und Funktionen liegen im Szenario.

export const VERSION = 1;

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

// ---------- Zufall (reproduzierbar, Zustand im Spielstand) ----------

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

export function begrenze(sz, s, key) {
  const d = sz.werte[key];
  if (!d) return;
  if (d.min !== undefined && s.w[key] < d.min) s.w[key] = d.min;
  if (d.max !== undefined && s.w[key] > d.max) s.w[key] = d.max;
}

/** Wendet eine Wirkung an: { w:{wert:delta}, setze, loesche, plane, kanzler, aktion } */
export function wende(sz, s, eff) {
  if (!eff) return;
  const w = txt(eff.w, s);
  if (w) {
    for (const [k, d] of Object.entries(w)) {
      if (s.w[k] === undefined) s.w[k] = 0;
      s.w[k] += d;
      begrenze(sz, s, k);
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
  if (eff.aktion) eff.aktion(s, api(sz, s));
  for (const k of Object.keys(sz.werte)) begrenze(sz, s, k);
}

/** Werkzeuge für eigene Aktionen in Szenarien */
export function api(sz, s) {
  return {
    zufall: () => zufall(s),
    normal: () => normal(s),
    wende: eff => wende(sz, s, eff),
    plane: (id, n = 1) => s.geplant.push({ id, zeit: zeitPlus(s.zeit, n) }),
    ende: id => { s.ende = { id, zeit: s.zeit }; },
  };
}

function schnappschuss(sz, s) {
  const o = {};
  for (const k of Object.keys(sz.werte)) o[k] = s.w[k];
  return o;
}
export function differenz(sz, vorher, s) {
  const d = [];
  for (const k of Object.keys(sz.werte)) {
    const def = sz.werte[k];
    if (def.versteckt) continue;
    const delta = runde1((s.w[k] ?? 0) - (vorher[k] ?? 0));
    if (Math.abs(delta) >= 0.5) d.push({ key: k, delta });
  }
  return d;
}

// ---------- Spiel anlegen ----------

export function neuesSpiel(sz, seed = (Date.now() ^ (Math.random() * 1e9)) >>> 0) {
  const st = sz.startzustand();
  const s = {
    version: VERSION,
    szenario: sz.id,
    seed,
    rng: seed >>> 0,
    zeit: sz.start,
    runde: 1,
    w: { ...st.w },
    f: { ...(st.f || {}) },
    kanzler: st.kanzler,
    regierung: [...(st.regierung || [])],
    sitze: { ...(st.sitze || {}) },
    geplant: [],
    wahlplan: [...(sz.wahlen || [])],
    erledigt: {},
    vorhabenErledigt: {},
    chronik: [],
    wahlen: [],
    verlauf: [],
    queue: [],
    pos: 0,
    phase: 'lage',
    ergebnis: null,
    ende: null,
    lage: null,
  };
  sz.modell.initialisiere?.(s, api(sz, s));
  starteRunde(sz, s);
  return s;
}

// ---------- Rundenablauf ----------

function imFenster(ev, z) {
  const ab = ev.ab ?? ev.zeit;
  const bis = ev.bis ?? ev.zeit ?? ab;
  return zeitIndex(z) >= zeitIndex(ab) && zeitIndex(z) <= zeitIndex(bis);
}

export function findeEreignis(sz, s, id) {
  if (id.startsWith('dyn:')) {
    const name = id.slice(4);
    const bau = sz.dynamisch[name];
    return bau ? { id, ...bau(s, api(sz, s)), dynamisch: true } : null;
  }
  return sz.ereignisIndex[id] || null;
}

export function starteRunde(sz, s) {
  s.queue = [];
  s.pos = 0;
  s.ergebnis = null;
  s.modellGelaufen = false;

  // 1. Geplante Folgeereignisse
  const faellig = s.geplant.filter(g => zeitIndex(g.zeit) <= zeitIndex(s.zeit));
  s.geplant = s.geplant.filter(g => zeitIndex(g.zeit) > zeitIndex(s.zeit));
  const geplant = [];
  for (const g of faellig) {
    const ev = findeEreignis(sz, s, g.id);
    if (!ev || s.erledigt[g.id] !== undefined) continue;
    if (ev.wenn && !ev.wenn(s)) continue;
    geplant.push(ev);
  }

  // 2. Hauptereignisse, deren Zeitfenster passt
  const haupt = sz.ereignisse.filter(ev =>
    ev.art !== 'akte' && !ev.nurGeplant && s.erledigt[ev.id] === undefined &&
    imFenster(ev, s.zeit) && (!ev.wenn || ev.wenn(s)));

  const alle = [...geplant, ...haupt.filter(h => !geplant.includes(h))];
  alle.sort((a, b) => (a.ordnung ?? 6) - (b.ordnung ?? 6));
  for (const ev of alle) s.queue.push(ev.id);

  // 3. Akten (Briefe) – zufällig aus den passenden
  const anzahl = sz.modell.aktenProRunde ? sz.modell.aktenProRunde(s, alle.length) : 1;
  const pool = sz.ereignisse.filter(ev =>
    ev.art === 'akte' && s.erledigt[ev.id] === undefined &&
    imFenster(ev, s.zeit) && (!ev.wenn || ev.wenn(s)));
  // Akten, deren Fenster bald schließt, bevorzugen
  pool.sort((a, b) => zeitIndex(a.bis ?? a.ab) - zeitIndex(b.bis ?? b.ab));
  const gewaehlt = [];
  while (gewaehlt.length < anzahl && pool.length) {
    const dringend = pool.filter(p => zeitIndex(p.bis ?? p.ab) === zeitIndex(s.zeit));
    const quelle = dringend.length ? dringend : pool;
    const ev = quelle[Math.floor(zufall(s) * quelle.length)];
    gewaehlt.push(ev);
    pool.splice(pool.indexOf(ev), 1);
  }
  gewaehlt.sort((a, b) => (a.ordnung ?? 6) - (b.ordnung ?? 6));
  // Akten zwischen die Hauptereignisse mischen, chronologisch nach "ordnung"
  const gemischt = [...alle, ...gewaehlt].sort((a, b) => (a.ordnung ?? 6) - (b.ordnung ?? 6));
  s.queue = gemischt.map(e => e.id);

  // 4. Regierungsvorhaben
  s.queue.push('@vorhaben');

  s.lage = sz.modell.lagebericht ? sz.modell.lagebericht(s) : null;
  s.phase = 'lage';
}

export function aktuelles(sz, s) {
  if (s.ende) return { typ: 'ende' };
  if (s.phase === 'lage') return { typ: 'lage' };
  if (s.phase === 'wahl') return { typ: 'wahl', ergebnis: s.wahlen[s.wahlen.length - 1] };
  if (s.phase === 'ergebnis') return { typ: 'ergebnis', ergebnis: s.ergebnis };
  const id = s.queue[s.pos];
  if (id === undefined) return { typ: 'rundenende' };
  if (id === '@vorhaben') return { typ: 'vorhaben', liste: verfuegbareVorhaben(sz, s) };
  const ev = findeEreignis(sz, s, id);
  if (!ev || (!ev.dynamisch && ev.wenn && !ev.wenn(s))) {
    s.pos++;
    if (s.queue[s.pos] === undefined) { weiter(sz, s); return aktuelles(sz, s); }
    return aktuelles(sz, s);
  }
  return { typ: 'ereignis', ev };
}

/** Optionen eines Ereignisses mit Verfügbarkeit */
export function optionen(sz, s, ev) {
  return (txt(ev.optionen, s) || []).map((o, i) => ({
    ...o,
    index: i,
    verfuegbar: !o.wenn || o.wenn(s),
    sichtbar: !o.nurWenn || o.nurWenn(s),
  })).filter(o => o.sichtbar);
}

export function lageGesehen(sz, s) {
  if (s.phase === 'lage') s.phase = 'spiel';
}

export function waehle(sz, s, index) {
  const ev = findeEreignis(sz, s, s.queue[s.pos]);
  const opts = txt(ev.optionen, s);
  const o = opts[index];
  if (!o || (o.wenn && !o.wenn(s))) throw new Error('Option nicht verfügbar');
  const vorher = schnappschuss(sz, s);
  const texte = [];

  wende(sz, s, o);
  sz.modell.nachOption?.(s, o, ev, api(sz, s));
  if (o.ergebnis) texte.push(txt(o.ergebnis, s));

  if (o.zufall) {
    const r = zufall(s);
    let summe = 0;
    let treffer = null;
    for (const z of o.zufall) {
      if (z.p === undefined) { treffer = z; break; }
      summe += Math.max(0, Math.min(1, txt(z.p, s)));
      if (r < summe) { treffer = z; break; }
    }
    if (treffer) {
      wende(sz, s, treffer);
      if (treffer.ergebnis) texte.push(txt(treffer.ergebnis, s));
    }
  }

  s.erledigt[ev.id] = index;
  s.letzteOrdnung = ev.dynamisch ? 99 : (ev.ordnung ?? 6);
  ev.nachher?.(s, api(sz, s));
  const hatHist = opts.some(x => x.hist);
  s.chronik.push({
    zeit: s.zeit,
    id: ev.id,
    titel: txt(ev.titel, s),
    datum: txt(ev.datum, s),
    art: ev.art || 'haupt',
    wahl: txt(o.text, s),
    hist: hatHist ? !!o.hist : null,
    ergebnis: texte.join(' '),
  });

  s.ergebnisVorhaben = false;
  s.ergebnis = {
    titel: txt(ev.titel, s),
    texte,
    historisch: txt(ev.historisch, s) || null,
    hist: hatHist ? !!o.hist : null,
    aenderungen: differenz(sz, vorher, s),
    ascii: txt(o.ascii, s) || null,
  };
  sz.modell.pruefeKrise?.(s, api(sz, s));
  sz.modell.nachEntscheidung?.(s);
  s.phase = 'ergebnis';
  return s.ergebnis;
}

export function verfuegbareVorhaben(sz, s) {
  return sz.vorhaben
    .filter(v => imFenster(v, s.zeit) && (!v.wenn || v.wenn(s)))
    .filter(v => {
      const n = s.vorhabenErledigt[v.id] || 0;
      if (!v.wiederholbar) return n === 0;
      if (v.max && n >= v.max) return false;
      const zuletzt = s.vorhabenZuletzt?.[v.id];
      return zuletzt === undefined || zeitIndex(s.zeit) - zeitIndex(zuletzt) >= (v.abstand ?? 2);
    })
    .map(v => ({ ...v, leistbar: s.w.haushalt - (v.kosten || 0) >= 0 }));
}

export function waehleVorhaben(sz, s, id) {
  const vorher = schnappschuss(sz, s);
  const texte = [];
  let titel = 'Kein neues Vorhaben';
  let historisch = null;
  if (id) {
    const v = sz.vorhaben.find(x => x.id === id);
    if (!v) throw new Error('Unbekanntes Vorhaben');
    if (s.w.haushalt - (v.kosten || 0) < 0) throw new Error('Nicht finanzierbar');
    s.w.haushalt -= v.kosten || 0;
    wende(sz, s, v);
    s.vorhabenErledigt[v.id] = (s.vorhabenErledigt[v.id] || 0) + 1;
    s.vorhabenZuletzt = s.vorhabenZuletzt || {};
    s.vorhabenZuletzt[v.id] = s.zeit;
    titel = txt(v.titel, s);
    if (v.ergebnis) texte.push(txt(v.ergebnis, s));
    historisch = txt(v.historisch, s) || null;
    s.chronik.push({ zeit: s.zeit, id: 'vorhaben:' + v.id, titel, art: 'vorhaben', wahl: 'Regierungsvorhaben', hist: null, ergebnis: texte.join(' ') });
  } else {
    texte.push('Die Regierung beschränkt sich in diesem Halbjahr auf die laufenden Geschäfte.');
  }
  s.ergebnis = { titel, texte, historisch, hist: null, aenderungen: differenz(sz, vorher, s), vorhaben: true };
  s.ergebnisVorhaben = true;
  sz.modell.nachEntscheidung?.(s);
  s.phase = 'ergebnis';
  return s.ergebnis;
}

/** Nach einer Ergebnisanzeige weiter */
export function weiter(sz, s) {
  if (s.ende) return;
  if (s.phase === 'wahl') {
    s.phase = 'spiel';
    return;
  }
  if (s.phase === 'ergebnis') {
    s.phase = 'spiel';
    s.pos++;
    if (!s.ergebnisVorhaben) aktualisiereQueue(sz, s, s.letzteOrdnung ?? 0);
    // Kriseneffekte können neue Ereignisse direkt einschieben
    if (s.einschub?.length) {
      s.queue.splice(s.pos, 0, ...s.einschub);
      s.einschub = [];
    }
  }
  if (s.queue[s.pos] === undefined) {
    if (!s.modellGelaufen) rundenende(sz, s);
    else abschliessen(sz, s);
  }
}

function rundenende(sz, s) {
  const vorher = schnappschuss(sz, s);
  sz.modell.rundenende(s, api(sz, s));
  s.modellGelaufen = true;
  s.verlauf.push({ zeit: s.zeit, ...schnappschuss(sz, s) });
  s.letzteAenderung = differenz(sz, vorher, s);

  // Wahl?
  const wahl = (s.wahlplan || sz.wahlen || []).find(z => zeitIndex(z) === zeitIndex(s.zeit));
  if (wahl !== undefined && !s.f['wahl_' + s.zeit] && !s.ende) {
    s.f['wahl_' + s.zeit] = true;
    const erg = sz.modell.wahl(s, api(sz, s));
    s.wahlen.push(erg);
    s.phase = 'wahl';
    // Regierungsbildung als dynamisches Ereignis vor der nächsten Runde
    s.queue.push('dyn:regierungsbildung');
    return;
  }
  abschliessen(sz, s);
}

function abschliessen(sz, s) {
  sz.modell.pruefeEnde?.(s, api(sz, s));
  if (s.ende) return;
  // Krisenereignisse zum Rundenende (z. B. Koalitionsbruch)
  if (s.einschub?.length) {
    s.queue.push(...s.einschub);
    s.einschub = [];
    s.phase = 'spiel';
    return;
  }
  naechsteRunde(sz, s);
}

function naechsteRunde(sz, s) {
  if (zeitIndex(s.zeit) >= zeitIndex(sz.ende)) {
    s.ende = { id: 'abschluss', zeit: s.zeit };
    return;
  }
  s.zeit = zeitPlus(s.zeit, 1);
  s.runde++;
  starteRunde(sz, s);
}

/**
 * Nach jeder Entscheidung: Ereignisse, die durch die Entscheidung erst möglich wurden
 * (gleiches Halbjahr, späterer Zeitpunkt), einreihen und hinfällige entfernen.
 */
function aktualisiereQueue(sz, s, abOrdnung) {
  const rest = s.queue.slice(s.pos);
  const bleibt = rest.filter(id => {
    if (id.startsWith('@') || id.startsWith('dyn:')) return true;
    if (s.erledigt[id] !== undefined) return false;
    const ev = findeEreignis(sz, s, id);
    return ev && (!ev.wenn || ev.wenn(s));
  });
  for (const ev of sz.ereignisse) {
    if (ev.art === 'akte' || ev.nurGeplant || s.erledigt[ev.id] !== undefined) continue;
    if (s.queue.includes(ev.id) || !imFenster(ev, s.zeit)) continue;
    if ((ev.ordnung ?? 6) < abOrdnung) continue;
    if (ev.wenn && !ev.wenn(s)) continue;
    bleibt.push(ev.id);
  }
  // Fällige geplante Ereignisse (z. B. aus einer Entscheidung in diesem Halbjahr mit in: 0)
  const faellig = s.geplant.filter(g => zeitIndex(g.zeit) <= zeitIndex(s.zeit));
  if (faellig.length) {
    s.geplant = s.geplant.filter(g => zeitIndex(g.zeit) > zeitIndex(s.zeit));
    for (const g of faellig) if (!bleibt.includes(g.id) && s.erledigt[g.id] === undefined) bleibt.push(g.id);
  }
  const ord = id => {
    if (id === '@vorhaben') return 1e9;
    if (id.startsWith('dyn:')) return -1;
    return findeEreignis(sz, s, id)?.ordnung ?? 6;
  };
  bleibt.sort((a, b) => ord(a) - ord(b));
  s.queue = s.queue.slice(0, s.pos).concat(bleibt);
}

/** Szenario vorbereiten: Index der Ereignisse anlegen und Daten prüfen */
export function bereiteVor(sz) {
  sz.ereignisIndex = {};
  for (const ev of sz.ereignisse) {
    if (sz.ereignisIndex[ev.id]) throw new Error('Doppelte Ereignis-ID: ' + ev.id);
    sz.ereignisIndex[ev.id] = ev;
  }
  const ids = new Set(sz.vorhaben.map(v => v.id));
  if (ids.size !== sz.vorhaben.length) throw new Error('Doppelte Vorhaben-ID');
  return sz;
}

/** Wahrscheinlichkeitsangabe für die Oberfläche */
export function hinweisPfeile(sz, o) {
  const w = typeof o.w === 'function' ? null : o.w;
  const out = [];
  if (w) {
    for (const [k, d] of Object.entries(w)) {
      const def = sz.werte[k];
      if (!def || def.versteckt || def.keinHinweis || Math.abs(d) < 1) continue;
      const stufe = Math.abs(d) >= 10 ? 3 : Math.abs(d) >= 5 ? 2 : 1;
      const hoch = d > 0;
      const gut = def.neutral ? null : (def.invertiert ? !hoch : hoch);
      out.push({ key: k, name: def.kurz || def.name, hoch, stufe, gut });
    }
  }
  if (o.kosten || (w && w.haushalt < 0)) { /* schon enthalten */ }
  const ungewiss = !!o.zufall;
  return { pfeile: out, ungewiss };
}
