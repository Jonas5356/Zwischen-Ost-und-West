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

import { zufall, txt, zeitIndex, sicht, api } from './engine.js';

const istKI = M => !!M?.regierungen;
const mensch = welt => welt.spieler;

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
    L.f['wechsel_' + x.id] = true;
    const gewicht = (art) => x.ausgaenge.map(a => Math.max(0, txt(a[art], s) ?? 0));
    const norm = v => { const t = v.reduce((a, b) => a + b, 0); return t > 0 ? v.map(y => y / t) : v.map(() => 1 / v.length); };
    const h = norm(gewicht('hist')), f = norm(gewicht('frei'));
    const p = Object.fromEntries(x.ausgaenge.map((a, i) => [i, g * h[i] + (1 - g) * f[i]]));
    const a = x.ausgaenge[Number(ziehe(welt, p))];
    const vorher = L.regime;
    if (a.regime !== vorher || a.neu) starteRegime(W, welt, land, a.regime);
    const meldung = txt(a.meldung, s);
    L.chronik.push({ zeit: welt.zeit, id: 'wechsel:' + x.id, titel: txt(x.titel, s), art: 'wechsel', wahl: M.regierungen[a.regime].titel, hist: null, ergebnis: meldung || '' });
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
      if (!istKI(M) || land === h) continue;
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
    if (istKI(M) && M.startRegime) starteRegime(W, welt, land, M.startRegime);
  }
}

/** Zu Beginn jedes Halbjahrs: Regierungswechsel, dann Berichte */
export function rundenstart(W, welt) {
  for (const [land, M] of Object.entries(W.laender)) if (istKI(M)) wechsel(W, welt, land);
  berichte(W, welt);
}

export { istKI };
