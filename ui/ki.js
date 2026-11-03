// Vom Spiel gesteuerte Länder: Regierungen, Ziele, Entscheidungen und was andere darüber wissen.
//
// Ein Land mit `regierungen` im Landesmodul wird so gesteuert:
//
//  - Nutzen einer Option o für eine Regierung mit Gewichten a (Werte) und b (Ziele):
//      U(o) = Σ_k a_k · E[Δw_k(o)] / 10  +  Σ_g b_g · E[d_g(o)]
//    E[…] heißt: Zufallsausgänge (`zufall`) gehen mit ihren Wahrscheinlichkeiten ein.
//    `w` sind Änderungen eigener Werte (Skala wie im Lagebild), `dient` sagt, wie sehr
//    die Option einem Ziel dient (+1) oder schadet (−1).
//  - Wahl per Logit: P(o) = exp(λ·U(o)) / Σ_o' exp(λ·U(o')). λ ist die Berechenbarkeit
//    der Regierung (0 = Zufall, groß = fast immer die beste Option).
//  - Manche Regierungen haben einen verborgenen Typ (z. B. „Note ernst gemeint“ oder
//    „Störmanöver“), der die Zielgewichte verändert. Er wird beim Amtsantritt ausgelost.
//  - Die gespielten Länder kennen den Typ nicht. Ihre Einschätzung π(θ) wird nach Bayes
//    fortgeschrieben: nach jeder beobachtbaren Entscheidung mit P(o | θ) aus demselben
//    Logit-Modell (mit den ungestörten Gewichten des Typs), nach jedem Bericht mit der
//    Treffsicherheit q der Quelle: P(Bericht nennt θ' | θ) = q, wenn θ' = θ, sonst (1−q)/(m−1).
//
// Geschichtstreue g (0…1, in der Welt gespeichert) mischt jeweils „historisch“ und „frei“:
// Wahrscheinlichkeit eines Regierungswechsels = g · historisch + (1−g) · frei,
// Verteilung der Typen = g · historische Einschätzung + (1−g) · Gleichverteilung,
// Gewichte streuen um bis zu ±30 % · (1−g).

import { zufall, txt, zeitIndex, sicht, api, beziehung } from './engine.js';

/** Wird das Land vom Spiel nach Zielen gesteuert? (hat Regierungen und wird nicht gespielt) */
const istKI = (W, welt, land) => !!W.laender[land]?.regierungen && !welt.spieler.includes(land) && welt.laender[land]?.aktiv !== false;
/** Gespielte Länder, die es schon gibt (nur sie beobachten die anderen) */
const mensch = welt => welt.spieler.filter(l => welt.laender[l]?.aktiv !== false);

// ---------------------------------------------------------------- Nutzen und Wahl

/** Erwartete Wirkung einer Option: { w: {wert: Δ}, d: {ziel: Δ} } */
export function erwartung(s, o) {
  const w = {}, d = {};
  const addiere = (eff, gewicht) => {
    for (const [k, v] of Object.entries(txt(eff.w, s) || {})) w[k] = (w[k] || 0) + gewicht * v;
    for (const [k, v] of Object.entries(txt(eff.dient, s) || {})) d[k] = (d[k] || 0) + gewicht * v;
  };
  addiere(o, 1);
  if (o.zufall) {
    let rest = 1;
    for (const z of o.zufall) {
      const p = z.p === undefined ? rest : Math.max(0, Math.min(rest, txt(z.p, s)));
      addiere(z, p);
      rest -= p;
      if (rest <= 0) break;
    }
  }
  return { w, d };
}

export function nutzen(s, o, gew) {
  const { w, d } = erwartung(s, o);
  let u = 0;
  for (const [k, v] of Object.entries(w)) u += (gew.a[k] || 0) * v / 10;
  for (const [k, v] of Object.entries(d)) u += (gew.b[k] || 0) * v;
  // Antwort auf eine Anfrage: Wer den Fragenden schätzt, kommt ihm eher entgegen
  // (`gunst` an der Option; 10 Punkte Beziehung über 50 heben den Nutzen um `gunst`)
  const anfrage = o.gunst && s.welt?.anfrage;
  if (anfrage) u += o.gunst * (beziehung(s.welt, s.land, anfrage.von) - 50) / 10;
  return u;
}

/** Logit-Wahrscheinlichkeiten über alle Optionen (nicht verfügbare: 0) */
export function wahrscheinlichkeiten(s, opts, gew, lambda) {
  const u = opts.map(o => (o.verfuegbar ? nutzen(s, o, gew) : -Infinity));
  const max = Math.max(...u);
  const e = u.map(x => (x === -Infinity ? 0 : Math.exp(lambda * (x - max))));
  const summe = e.reduce((a, b) => a + b, 0);
  return e.map(x => x / summe);
}

/** Ziele, die sich aus der Richtung einer Option ergeben (`dientAus` im Landesmodul), ergänzen */
function mitZielen(M, s, opts) {
  if (!M.dientAus) return opts;
  return opts.map(o => {
    const extra = M.dientAus(o);
    return extra ? { ...o, dient: { ...extra, ...(txt(o.dient, s) || {}) } } : o;
  });
}

/** Gewichte einer Regierung, gegebenenfalls mit Typ */
export function gewichteVon(R, typ) {
  const T = typ ? R.typen?.[typ] : null;
  return { a: { ...(R.werte || {}) }, b: { ...(R.ziele || {}), ...(T?.ziele || {}) } };
}

/**
 * Entscheidung eines gesteuerten Landes. Gibt den Index der gewählten Option zurück und,
 * für die Einschätzung der Beobachter, P(gewählte Option | θ) für jeden möglichen Typ.
 */
export function waehle(W, welt, land, ev, opts) {
  const M = W.laender[land];
  const L = welt.laender[land];
  const s = sicht(W, welt, land);
  const R = M.regierungen[L.regime];
  opts = mitZielen(M, s, opts);
  const p = wahrscheinlichkeiten(s, opts, L.gewichte, R.lambda ?? 1.5);
  let r = zufall(welt), i = 0;
  for (; i < p.length - 1; i++) { if (r < p[i]) break; r -= p[i]; }
  while (!opts[i].verfuegbar) i = (i + 1) % opts.length;
  const like = {};
  for (const t of Object.keys(R.typen || {})) like[t] = wahrscheinlichkeiten(s, opts, gewichteVon(R, t), R.lambda ?? 1.5)[i];
  return { index: opts[i].index, like, p };
}

// ---------------------------------------------------------------- Regierungen

/** Verteilung der Typen nach Geschichtstreue: g · historisch + (1−g) · gleich */
export function typPrior(welt, R) {
  const typen = Object.entries(R.typen || {});
  if (!typen.length) return {};
  const g = welt.geschichtstreue ?? 1;
  const summe = typen.reduce((x, [, t]) => x + (t.p ?? 1), 0);
  return Object.fromEntries(typen.map(([id, t]) => [id, g * (t.p ?? 1) / summe + (1 - g) / typen.length]));
}

function ziehe(welt, verteilung) {
  let r = zufall(welt);
  const eintraege = Object.entries(verteilung);
  for (const [k, p] of eintraege) { if (r < p) return k; r -= p; }
  return eintraege[eintraege.length - 1][0];
}

/** Eine Regierung tritt an: Typ auslosen, Gewichte streuen, Beobachter beginnen bei der Vorab-Einschätzung */
export function starteRegime(W, welt, land, regime) {
  const M = W.laender[land];
  const L = welt.laender[land];
  const R = M.regierungen[regime];
  if (!R) throw new Error(`Unbekannte Regierung ${land}:${regime}`);
  const prior = typPrior(welt, R);
  L.regime = regime;
  L.typ = Object.keys(prior).length ? ziehe(welt, prior) : null;
  const gew = gewichteVon(R, L.typ);
  const streuung = 0.3 * (1 - (welt.geschichtstreue ?? 1));
  if (streuung > 0) {
    for (const teil of [gew.a, gew.b]) for (const k of Object.keys(teil)) teil[k] *= 1 + streuung * (2 * zufall(welt) - 1);
  }
  L.gewichte = gew;
  (L.regierungen ||= []).push({ regime, typ: L.typ, ab: welt.zeit });
  for (const h of mensch(welt)) {
    if (h === land) continue;
    const E = (welt.laender[h].einschaetzung ||= {});
    const alt = E[land];
    E[land] = { regime, p: { ...prior }, verlauf: [], frueher: [...(alt?.frueher || []), ...(alt ? [{ regime: alt.regime, p: alt.p }] : [])] };
  }
}

/** Regierungswechsel zu Beginn eines Halbjahrs */
function wechsel(W, welt, land) {
  const M = W.laender[land];
  const L = welt.laender[land];
  const s = sicht(W, welt, land);
  const g = welt.geschichtstreue ?? 1;
  for (const x of M.wechsel || []) {
    if (zeitIndex(x.zeit) !== zeitIndex(welt.zeit) || L.f['wechsel_' + x.id]) continue;
    if (x.von && !x.von.includes(L.regime)) continue;
    // Bedingte Wechsel (z. B. eine vorgezogene Wahl nur bei knapper Mehrheit) fallen sonst aus
    if (x.wenn && !x.wenn(s)) continue;
    L.f['wechsel_' + x.id] = true;
    const gewicht = (art) => x.ausgaenge.map(a => Math.max(0, txt(a[art], s) ?? 0));
    const norm = v => { const t = v.reduce((a, b) => a + b, 0); return t > 0 ? v.map(y => y / t) : v.map(() => 1 / v.length); };
    const h = norm(gewicht('hist')), f = norm(gewicht('frei'));
    const p = Object.fromEntries(x.ausgaenge.map((a, i) => [i, g * h[i] + (1 - g) * f[i]]));
    const a = x.ausgaenge[Number(ziehe(welt, p))];
    const vorher = L.regime;
    // Die neue Regierung darf von der Lage abhängen (z. B. „wer gerade die Konservativen führt“)
    const neu = txt(a.regime, s);
    L.regimeVorher = vorher;
    if (neu !== vorher || a.neu) starteRegime(W, welt, land, neu);
    const meldung = txt(a.meldung, s);
    L.chronik.push({ zeit: welt.zeit, id: 'wechsel:' + x.id, titel: txt(x.titel, s), art: 'wechsel', wahl: M.regierungen[neu].titel, hist: null, ergebnis: meldung || '' });
    a.aktion?.(s, api(W, welt, land));
  }
}

// ---------------------------------------------------------------- Einschätzung

function bayes(p, like) {
  const neu = {};
  let summe = 0;
  for (const t of Object.keys(p)) { neu[t] = p[t] * (like[t] ?? 0); summe += neu[t]; }
  if (!(summe > 0)) return p; // unmögliche Beobachtung unter allen Typen: nichts lernen
  for (const t of Object.keys(neu)) neu[t] /= summe;
  return neu;
}

/** Nach einer Entscheidung: Beobachter schreiben ihre Einschätzung fort (nur öffentliche Entscheidungen) */
export function beobachte(W, welt, land, ev, o, like) {
  if (ev.geheim || o.still || !like || !Object.keys(like).length) return;
  const L = welt.laender[land];
  const s = sicht(W, welt, land);
  for (const h of mensch(welt)) {
    const E = welt.laender[h].einschaetzung?.[land];
    if (!E || E.regime !== L.regime) continue;
    E.p = bayes(E.p, like);
    E.verlauf.push({ zeit: welt.zeit, art: 'handlung', text: txt(o.ergebnis, s) || txt(o.text, s), p: { ...E.p } });
  }
}

/** Berichte von Botschaften und Diensten über die gesteuerten Länder */
function berichte(W, welt) {
  for (const h of mensch(welt)) {
    const Mh = W.laender[h];
    const sh = sicht(W, welt, h);
    for (const [land, M] of Object.entries(W.laender)) {
      if (!istKI(W, welt, land) || land === h) continue;
      const L = welt.laender[land];
      const R = M.regierungen[L.regime];
      const typen = Object.keys(R.typen || {});
      if (typen.length < 2 || !L.typ) continue;
      if (zufall(welt) >= (R.berichtsrate ?? 0.5)) continue;
      const { q, quelle } = Mh.modell?.aufklaerung?.(sh, land) ?? { q: 0.6, quelle: 'Auswärtiges Amt' };
      // Die Quelle nennt mit Wahrscheinlichkeit q den wahren Typ, sonst einen der anderen
      const andere = typen.filter(t => t !== L.typ);
      const signal = zufall(welt) < q ? L.typ : andere[Math.floor(zufall(welt) * andere.length)];
      const texte = R.typen[signal].berichte || [R.typen[signal].name];
      const text = txt(texte[Math.floor(zufall(welt) * texte.length)], sh);
      const like = Object.fromEntries(typen.map(t => [t, t === signal ? q : (1 - q) / (typen.length - 1)]));
      const E = welt.laender[h].einschaetzung?.[land];
      if (!E || E.regime !== L.regime) continue;
      E.p = bayes(E.p, like);
      E.verlauf.push({ zeit: welt.zeit, art: 'bericht', quelle, q, text, p: { ...E.p } });
    }
  }
}

// ---------------------------------------------------------------- Ablauf

/** Beim Anlegen der Welt: Startregierungen */
export function initialisiere(W, welt) {
  for (const [land, M] of Object.entries(W.laender)) {
    if (!istKI(W, welt, land)) continue;
    if (M.regimeVon) pruefeRegime(W, welt, land);
    else if (M.startRegime) starteRegime(W, welt, land, M.startRegime);
  }
}

/**
 * Länder, deren Regierung sich aus ihrem eigenen Modell ergibt (Wahlen, Koalitionen,
 * Regierungsstürze – `regimeVon(s)` im Landesmodul): Nach jeder Änderung tritt die neue
 * Regierung mit neu ausgelostem Typ an.
 */
export function pruefeRegime(W, welt, land) {
  const M = W.laender[land];
  if (!M.regimeVon || !istKI(W, welt, land)) return;
  const L = welt.laender[land];
  const r = M.regimeVon(sicht(W, welt, land));
  if (r && r !== L.regime) starteRegime(W, welt, land, r);
}

/**
 * Ein Land ist gegründet worden: Wird es gesteuert, tritt seine Regierung an; wird es
 * gespielt, beginnt seine Einschätzung der anderen Regierungen bei deren Vorab-Einschätzung.
 */
export function neuesLand(W, welt, land) {
  if (istKI(W, welt, land)) {
    const M = W.laender[land];
    if (M.regimeVon) pruefeRegime(W, welt, land);
    else if (M.startRegime) starteRegime(W, welt, land, M.startRegime);
    return;
  }
  if (!welt.spieler.includes(land)) return;
  const E = (welt.laender[land].einschaetzung ||= {});
  for (const [andere, M] of Object.entries(W.laender)) {
    if (andere === land || !istKI(W, welt, andere)) continue;
    const L = welt.laender[andere];
    E[andere] = { regime: L.regime, p: { ...typPrior(welt, M.regierungen[L.regime]) }, verlauf: [], frueher: [] };
  }
}

/** Zu Beginn jedes Halbjahrs: Regierungswechsel, dann Berichte */
export function rundenstart(W, welt) {
  for (const land of Object.keys(W.laender)) {
    if (!istKI(W, welt, land)) continue;
    wechsel(W, welt, land);
    pruefeRegime(W, welt, land);
  }
  berichte(W, welt);
}

/**
 * Regierungsvorhaben eines gesteuerten Landes: das Vorhaben mit dem höchsten Nutzen (nach
 * Logit wie bei Entscheidungen); „kein Vorhaben“ hat Nutzen 0. Länder ohne Regierungen
 * nehmen das historische Vorhaben, sonst keines.
 */
export function waehleVorhaben(W, welt, land, liste, anwenden) {
  const M = W.laender[land];
  const L = welt.laender[land];
  const s = sicht(W, welt, land);
  if (!M.regierungen || !L.gewichte) {
    const v = liste.find(x => x.historisch) || null;
    return anwenden(v ? v.id : null);
  }
  const R = M.regierungen[L.regime];
  const opts = [{ id: null, verfuegbar: true }, ...liste.map(v => ({ ...v, verfuegbar: true, w: kostenwirkung(s, v) }))];
  const p = wahrscheinlichkeiten(s, opts, L.gewichte, R.lambda ?? 1.5);
  let r = zufall(welt), i = 0;
  for (; i < p.length - 1; i++) { if (r < p[i]) break; r -= p[i]; }
  return anwenden(opts[i].id);
}
/**
 * Entscheidung eines gesteuerten Landes am Halbjahresende: keine oder eine der verfügbaren.
 * Eine Entscheidung muss sich lohnen (Nutzen abzüglich einer Schwelle), Kosten zählen mit,
 * und bei einer Anfrage an ein anderes Land geht dessen wahrscheinliche Antwort ein – berechnet
 * mit den öffentlichen Zielen seiner Regierung, nicht mit seinem verborgenen Typ.
 */
export function waehleEntscheidung(W, welt, land, liste, anwenden) {
  const M = W.laender[land];
  const L = welt.laender[land];
  const s = sicht(W, welt, land);
  if (!M.regierungen || !L.gewichte) return anwenden(null);
  const R = M.regierungen[L.regime];
  const lambda = R.lambda ?? 1.5;
  const opts = mitZielen(M, s, liste.map(e => ({ ...e, verfuegbar: true, w: mitKosten(s, e), zufall: antwortErwartung(W, welt, land, e) || e.zufall })));
  const u = [0, ...opts.map(o => nutzen(s, o, L.gewichte) - SCHWELLE)];
  const max = Math.max(...u);
  const e = u.map(x => Math.exp(lambda * (x - max)));
  const summe = e.reduce((a, b) => a + b, 0);
  let r = zufall(welt) * summe, i = 0;
  for (; i < e.length - 1; i++) { if (r < e[i]) break; r -= e[i]; }
  return anwenden(i === 0 ? null : opts[i - 1].id);
}
const SCHWELLE = 0.4;

/** Eigene Wirkung einer Entscheidung einschließlich ihrer Kosten */
function mitKosten(s, e) {
  const w = { ...(txt(e.w, s) || {}) };
  for (const [k, v] of Object.entries(txt(e.kosten, s) || {})) w[k] = (w[k] || 0) + v;
  return w;
}

/** Erwartete Antwort auf eine Anfrage als Zufallsausgänge mit den Wirkungen beim Fragenden */
function antwortErwartung(W, welt, land, e) {
  if (!e.an) return null;
  const s = sicht(W, welt, land);
  const an = txt(e.an, s);
  const Mz = W.laender[an.land];
  const Lz = welt.laender[an.land];
  const ev = Mz?.ereignisse?.find(x => x.id === an.id);
  const R = Mz?.regierungen?.[Lz?.regime];
  if (!ev || !R) return null;
  const sz = sicht(W, welt, an.land);
  const vorher = welt.anfrage;
  welt.anfrage = { von: land, ...(an.daten || {}) };
  const optsZ = txt(ev.optionen, sz).map((o, i) => ({ ...o, index: i, verfuegbar: !o.wenn || o.wenn(sz) }));
  const p = wahrscheinlichkeiten(sz, optsZ, gewichteVon(R, null), R.lambda ?? 1.5);
  welt.anfrage = vorher;
  const antworten = txt(e.antworten, s) || {};
  return optsZ.map((o, i) => ({ ...(antworten[o.antwort] || {}), p: p[i] }));
}

/** Wirkung eines Vorhabens einschließlich seiner Kosten für den Haushalt */
function kostenwirkung(s, v) {
  const w = { ...(txt(v.w, s) || {}) };
  if (v.kosten) w.haushalt = (w.haushalt || 0) - v.kosten;
  return w;
}

export { istKI };
