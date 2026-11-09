// Oberfläche: zeichnet den Spielstand und leitet Eingaben an die Engine weiter
import * as E from './engine.js';
import weltSzenario from './szenarien/kalter_krieg/index.js';
import { spieleSzene, SZENEN } from './ascii.js';
import * as Sp from './speicher.js';
import * as Ton from './ton.js';
import * as Update from './update.js';

const W = E.bereiteVor(weltSzenario);
let welt = null;               // der Spielstand: die ganze Welt
let s = null;                  // Sicht des gespielten Landes darauf
let sz = W.laender[W.spielbar[0]]; // Inhalte des gespielten Landes
let ui = sz.oberflaeche;           // was die Oberfläche über dieses Land wissen muss

function uebernehme(w) {
  welt = w;
  const land = welt.spieler[0];
  sz = W.laender[land];
  ui = sz.oberflaeche;
  s = E.sicht(W, welt, land);
}
const ladbar = st => st && st.version === E.VERSION && st.szenario === W.id;
let einst = Sp.einstellungen();
let stoppSzene = () => {};
let tippAbbruch = null;
const wenigBewegung = matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = id => document.getElementById(id);
const esc = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const zahl = (x, d = 1) => Number(x).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const absaetze = t => String(t || '').split(/\n\s*\n/).filter(Boolean).map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
const bewegung = () => !wenigBewegung;

function meldung(text) {
  const m = $('meldung');
  m.textContent = text;
  m.hidden = false;
  clearTimeout(meldung.t);
  meldung.t = setTimeout(() => { m.hidden = true; }, 2200);
}

// ---------------------------------------------------------------- Titelbild

async function zeigeTitel() {
  stoppSzene();
  $('spiel').hidden = true;
  $('titel').hidden = false;
  $('titel-text').innerHTML = absaetze(W.beschreibung);
  stoppSzene = spieleSzene($('titel-ascii'), W.szene || 'bundeshaus', { bewegung: bewegung() });
  const auto = await Sp.lade('auto');
  $('k-fortsetzen').hidden = !(ladbar(auto) && !auto.ende);
  $('k-neu').focus();
}

// ---------------------------------------------------------------- Neues Spiel

const TREUE = [
  [95, 'historisch', 'Die Regierungen kommen wie in der Geschichte, und ihre Ziele entsprechen dem, was die Forschung über sie weiß. Ihre Absichten sind trotzdem verborgen: Ob die Stalin-Note ernst gemeint war, entscheidet der Zufall – so wie es die Forschung offen lässt.'],
  [70, 'weitgehend historisch', 'Meist kommt es wie in der Geschichte, aber nicht immer: Eisenhower kann die Wahl verlieren, Berija den Machtkampf gewinnen. Die Ziele der Regierungen streuen etwas.'],
  [35, 'offen', 'Andere Regierungen sind fast so wahrscheinlich wie die historischen, ihre Absichten sind kaum vorhersehbar.'],
  [0, 'frei', 'Alle plausiblen Regierungen sind gleich wahrscheinlich; welche Ziele sie verfolgen, ist weitgehend offen.'],
];
function treueText() {
  const v = Number($('n-treue').value);
  const [, name, text] = TREUE.find(([ab]) => v >= ab);
  $('n-treue-wert').textContent = `${v} % – ${name}`;
  $('n-treue-text').textContent = text;
}
let gewaehltesLand = null;
function laenderWahl() {
  if (!W.spielbar.includes(gewaehltesLand)) gewaehltesLand = W.spielbar.includes(einst.land) ? einst.land : W.spielbar[0];
  // Kurze Karten zur Wahl, darunter die Beschreibung des gewählten Landes
  $('n-laender').innerHTML = W.spielbar.map(id => {
    const M = W.laender[id];
    return `<button class="land-karte${id === gewaehltesLand ? ' gewaehlt' : ''}" data-land="${id}" aria-pressed="${id === gewaehltesLand}">
      <span class="land-name">${esc(M.name)}</span><span class="land-rolle">${esc(M.rolle)}${M.untertitel ? `, ${esc(M.untertitel)}` : ''}</span></button>`;
  }).join('');
  const G = W.laender[gewaehltesLand];
  $('n-land-detail').innerHTML = `<p class="land-text">${esc(G.beschreibung)}</p><p class="land-text klein">${esc(G.oberflaeche.rolle)}</p>`;
  $('n-laender').querySelectorAll('[data-land]').forEach(b => { b.onclick = () => { gewaehltesLand = b.dataset.land; laenderWahl(); }; });
}
function starteNeu() {
  $('n-treue').value = Math.round(100 * (einst.geschichtstreue ?? 0.75));
  treueText();
  laenderWahl();
  $('d-neu').showModal();
}
function beginneSpiel() {
  einst.geschichtstreue = Number($('n-treue').value) / 100;
  einst.land = gewaehltesLand;
  Sp.speichereEinstellungen(einst);
  $('d-neu').close();
  uebernehme(E.neueWelt(W, { spieler: [gewaehltesLand], geschichtstreue: einst.geschichtstreue }));
  angezeigteZeit = null;
  zeigeSpiel();
}

// ---------------------------------------------------------------- Washington und Moskau

/** Erstes Halbjahr des gespielten Landes (Länder mit späterem Einstieg beginnen mit ihrer Gründung) */
const einstieg = () => s.gegruendet ?? W.start;

/** Die vom Spiel gesteuerten Länder mit Regierungen, deren Absichten der Spieler einschätzt: [[id, Hauptstadt]] */
const maechte = () => Object.keys(W.laender)
  .filter(id => W.laender[id].regierungen && !welt.spieler.includes(id) && E.istAktiv(welt, id))
  .map(id => [id, W.laender[id].hauptstadt]);

/** Verbale Einschätzung einer Wahrscheinlichkeit */
const sicherheit = p => (p >= 0.85 ? 'sehr wahrscheinlich' : p >= 0.65 ? 'vermutlich' : 'eher');

/** Einschätzung des Spielers über ein gesteuertes Land: { R, typen: [[id, p, T]], beste } */
function einschaetzung(land) {
  const L = welt.laender[land];
  const R = W.laender[land].regierungen?.[L?.regime];
  const E = s.einschaetzung?.[land];
  if (!R) return null;
  const typen = Object.entries(E?.p || {}).map(([id, p]) => [id, p, R.typen[id]]).sort((a, b) => b[1] - a[1]);
  return { L, R, E, typen, beste: typen[0] };
}

function weltKarte() {
  let html = '<section class="karte welt"><h3>Die Welt</h3>';
  for (const [land, ort] of maechte()) {
    const e = einschaetzung(land);
    if (!e) continue;
    const [, p, T] = e.beste || [];
    const antwort = !T ? '' : p < 0.55 ? 'unklar' : `${sicherheit(p)}: ${T.kurz}`;
    html += `<div class="macht"><div class="macht-kopf"><b>${esc(ort)}</b><span>${esc(e.R.titel)}</span></div>
      ${T ? `<div class="macht-frage">${esc(e.R.frage)}</div><div class="macht-antwort${p < 0.55 ? ' unklar' : ''}">${esc(antwort)}</div>` : ''}</div>`;
  }
  const v = (E.beziehung(welt, 'usa', 'su') + E.beziehung(welt, 'su', 'usa')) / 2;
  const n = Math.max(0, Math.min(10, Math.round(v / 10)));
  html += `<div class="zeile" title="Verhältnis zwischen Washington und Moskau (hoch heißt Entspannung)"><span>USA – UdSSR</span><span class="balken" aria-hidden="true">${'█'.repeat(n)}${'░'.repeat(10 - n)}</span><span class="wert">${Math.round(v)}</span><span></span></div>`;
  html += '<button class="knopf klein dossier-knopf" id="k-dossier-lage">Dossier öffnen</button></section>';
  return html;
}

function zeigeDossier() {
  let html = `<p class="hinweis">${esc(ui.dienst || 'Das Auswärtige Amt')} rechnet nach Bayes: Jede Entscheidung, die eine Regierung trifft, und jeder Bericht verschiebt die Wahrscheinlichkeiten – je nachdem, wie gut sie zu jeder möglichen Absicht passen. Berichte können irren; die Treffsicherheit der Quelle steht dabei.</p>`;
  for (const [land, ort] of maechte()) {
    const e = einschaetzung(land);
    if (!e) continue;
    const seit = e.L.regierungen?.[e.L.regierungen.length - 1]?.ab;
    html += `<section class="dossier-land"><h3>${esc(ort)}: ${esc(e.R.titel)}${seit ? ` <small>seit ${esc(E.zeitText(seit))}</small>` : ''}</h3>`;
    if (e.typen.length) {
      html += `<p class="dossier-frage">${esc(e.R.frage)}</p><ul class="dossier-typen">`;
      for (const [, p, T] of e.typen) {
        html += `<li><div class="dt-kopf"><b>${esc(T.name)}</b><span>${Math.round(100 * p)} %</span></div>
          <div class="dt-balken"><span style="width:${(100 * p).toFixed(1)}%"></span></div><p>${esc(T.beschreibung)}</p></li>`;
      }
      html += '</ul>';
      const verlauf = [...(e.E?.verlauf || [])].reverse();
      if (verlauf.length) {
        const erste = e.typen.map(x => x[0]).sort()[0];
        html += '<h4>Erkenntnisse</h4><ol class="dossier-verlauf">';
        for (const v of verlauf) {
          const top = Object.entries(v.p).sort((a, b) => b[1] - a[1])[0];
          html += `<li><span class="z">${esc(E.zeitText(v.zeit))}</span><span class="q">${v.art === 'bericht' ? `${esc(v.quelle)} (Treffsicherheit ${Math.round(100 * v.q)} %)` : 'Handlung'}</span>
            <span class="t">${esc(v.text)}</span><span class="p">danach: ${esc(e.R.typen[top[0]].name)} ${Math.round(100 * top[1])} %</span></li>`;
        }
        html += '</ol>';
      } else html += '<p class="hinweis">Noch keine Erkenntnisse über diese Regierung – die Einschätzung beruht allein auf dem, was über sie bekannt ist.</p>';
    } else html += '<p class="hinweis">Über die Absichten dieser Regierung gibt es keine offenen Fragen.</p>';
    const frueher = (e.E?.frueher || []).filter(f => Object.keys(f.p || {}).length);
    if (frueher.length) {
      html += '<h4>Frühere Regierungen</h4><ul class="dossier-frueher">';
      for (const f of frueher) {
        const R = W.laender[land].regierungen[f.regime];
        const top = Object.entries(f.p).sort((a, b) => b[1] - a[1])[0];
        html += `<li><b>${esc(R.titel)}</b>: zuletzt eingeschätzt als „${esc(R.typen[top[0]].name)}“ (${Math.round(100 * top[1])} %). Was sie wirklich wollte, zeigt der Abschlussbericht.</li>`;
      }
      html += '</ul>';
    }
    html += '</section>';
  }
  $('dossier').innerHTML = html;
  $('dossier-titel').textContent = `Dossier: ${maechte().map(m => m[1]).join(', ').replace(/, ([^,]*)$/, ' und $1')}`;
  if (!$('d-dossier').open) { $('d-dossier').showModal(); Ton.blatt(); }
}

function zeigeSpiel() {
  $('titel').hidden = true;
  $('spiel').hidden = false;
  zeichne();
}

// ---------------------------------------------------------------- Zeichnen

let angezeigteZeit = null;

function zeichne() {
  stoppSzene();
  tippAbbruch = null;
  // zuerst vorrücken: Wer ein spät entstehendes Land spielt, beginnt erst nach dem Vorlauf
  const a = E.aktuelles(W, welt);
  if (angezeigteZeit !== null && angezeigteZeit !== s.zeit && !s.ende) {
    meldung(`${E.zeitLang(s.zeit)}: Die neue Ausgabe von „${ui.zeitung.titel}“ liegt bereit.`);
  }
  angezeigteZeit = s.zeit;
  zeichneKopf();
  zeichneLage();
  const blatt = $('blatt');
  blatt.className = 'blatt';
  blatt.scrollTop = 0;
  blatt.closest('.mappe').scrollTop = 0;
  if (a.typ === 'lage') { E.lageGesehen(W, welt); return zeichne(); }
  if (['ereignis', 'vorhaben', 'ende'].includes(a.typ)) Ton.blatt();
  if (a.typ === 'telegramm') Ton.fernschreiber(0.6);
  switch (a.typ) {
    case 'ereignis': zeichneEreignis(blatt, a.ev, a.land); break;
    case 'telegramm': zeichneTelegramm(blatt, a.telegramm); break;
    case 'ergebnis': zeichneErgebnis(blatt, a.ergebnis); break;
    case 'vorhaben': zeichneVorhaben(blatt, a.liste); break;
    case 'wahl': zeichneWahl(blatt, a.ergebnis); break;
    case 'ende': zeichneEnde(blatt); break;
    default: E.weiter(W, welt); return zeichne();
  }
  Sp.speichere('auto', { ...welt, gespeichert: Date.now() });
  blatt.focus({ preventScroll: true });
}

function zeichneKopf() {
  $('eingang').innerHTML = `<span class="stempel">${esc(E.zeitLang(s.zeit))}<small>Runde ${E.zeitIndex(s.zeit) - E.zeitIndex(einstieg()) + 1} von ${E.zeitIndex(W.ende) - E.zeitIndex(einstieg()) + 1}</small></span>`;
  const k = ui.kopf(s);
  $('kopf-regierung').innerHTML = `<strong>${esc(k.titel)}</strong>${k.text ? `, ${esc(k.text)}` : ''}`;
  $('zeitung-neu').hidden = s.zeitungGelesen === s.zeit;
  zeichneEntscheidungsZahl();
}

/** Die Werte eines Blocks in fester Reihenfolge (Standardwerte und Beziehungen nach dem Katalog) */
function werteImBlock(block) {
  const reihe = block === 'land' ? (sz.landesspezifisch || []) : W.werteReihe;
  const pos = k => { const i = reihe.indexOf(k); return i < 0 ? 999 : i; };
  return Object.keys(sz.werte).filter(k => sz.werte[k].block === block && !sz.werte[k].versteckt).sort((a, b) => pos(a) - pos(b));
}

/** Besondere Anzeige statt eines Balkens: ein Land, das es (noch) nicht gibt, oder Angaben des Landes */
function besondereZeile(k, d) {
  if (d.beziehung && welt.laender[d.beziehung] && !E.istAktiv(welt, d.beziehung)) return welt.laender[d.beziehung].nie ? 'kein Staat' : 'noch kein Staat';
  return ui.zeile?.(s, k) || null;
}

function wertZeile(k, basis) {
  const d = sz.werte[k];
  const besonders = besondereZeile(k, d);
  if (besonders === 'aus') return '';
  if (besonders) return `<div class="zeile" data-wert="${k}" tabindex="0"><span>${esc(d.kurz)}</span><span class="balken">${esc(besonders)}</span><span class="wert"></span><span></span></div>`;
  const v = s.w[k];
  const [lo, hi] = d.skala || ui.skala?.[k] || [d.min, d.max];
  const n = Math.max(0, Math.min(10, Math.round(10 * (v - lo) / (hi - lo))));
  const balken = '█'.repeat(n) + '░'.repeat(10 - n);
  const wert = d.einheit === '%' ? zahl(v, 1) : (k === 'ansehen' && v > 0 ? '+' : '') + Math.round(v);
  let trend = '';
  if (basis && basis[k] !== undefined) {
    const delta = v - basis[k];
    if (Math.abs(delta) >= 0.5) {
      const hoch = delta > 0;
      const gut = d.neutral ? null : (d.invertiert ? !hoch : hoch);
      trend = `<span class="trend ${gut === null ? '' : gut ? 'gut' : 'schlecht'}">${hoch ? '▲' : '▼'}</span>`;
    }
  }
  const warn = !!(d.warnung?.(v) || ui.warnung?.(s, k, v));
  return `<div class="zeile${warn ? ' warnung' : ''}" data-wert="${k}" tabindex="0" aria-label="${esc(d.name)}: ${esc(wert)}"><span>${esc(d.kurz)}</span><span class="balken" aria-hidden="true">${balken}</span><span class="wert">${wert}</span>${trend || '<span></span>'}</div>`;
}

/** Erklärung eines Werts: Katalog, ergänzt um die Angaben des Landes */
function erklaerung(k) {
  const d = sz.werte[k];
  const eigen = typeof ui.erklaerung === 'function' ? ui.erklaerung(s)?.[k] : ui.erklaerung?.[k];
  const e = { ...(d.erklaerung || {}), ...(eigen || {}) };
  for (const f of Object.keys(e)) e[f] = E.txt(e[f], s);
  return e;
}

/** Hinweiskärtchen: was der Wert ist, was ihn bewegt, was er bewirkt – und was ihn zuletzt bewegt hat */
function hinweisHtml(k) {
  const d = sz.werte[k];
  const e = erklaerung(k);
  let html = `<h4>${esc(d.name)}</h4>`;
  if (e.was) html += `<p>${esc(e.was)}</p>`;
  html += '<dl>';
  if (e.hebt) html += `<dt>Hebt ihn</dt><dd>${esc(e.hebt)}</dd>`;
  if (e.senkt) html += `<dt>Senkt ihn</dt><dd>${esc(e.senkt)}</dd>`;
  if (e.wirkt) html += `<dt>Bewirkt</dt><dd>${esc(e.wirkt)}</dd>`;
  html += '</dl>';
  if (d.beziehung && !E.istAktiv(welt, d.beziehung)) return html;
  // Was den Wert zuletzt bewegt hat: Entscheidungen dieses Halbjahrs und das letzte Halbjahresende
  const fmt = x => `${x > 0 ? '+' : '−'}${zahl(Math.abs(x), Number.isInteger(x) ? 0 : 1)}`;
  const posten = [];
  for (const c of s.chronik || []) {
    if (E.zeitIndex(c.zeit) !== E.zeitIndex(s.zeit)) continue;
    const a = (c.aenderungen || []).find(x => x.key === k);
    if (a) posten.push([a.delta, c.titel]);
  }
  const basis = s.verlauf.length ? s.verlauf[s.verlauf.length - 1] : null;
  if (basis && basis[k] !== undefined) {
    const gesamt = E.runde1(s.w[k] - basis[k]);
    const erklaert = E.runde1(posten.reduce((x, [dd]) => x + dd, 0));
    if (Math.abs(gesamt - erklaert) >= 0.5) posten.push([E.runde1(gesamt - erklaert), 'andere Länder und Folgen']);
  }
  const ende = (s.letzteAenderung || []).find(x => x.key === k);
  if (posten.length || ende) {
    html += '<p class="hinweis-kopf">Zuletzt</p><ul>';
    for (const [dd, t] of posten) html += `<li><b>${fmt(dd)}</b> ${esc(t)}</li>`;
    if (ende) html += `<li><b>${fmt(ende.delta)}</b> am Ende des letzten Halbjahrs</li>`;
    html += '</ul>';
  }
  return html;
}

function zeichneLage() {
  const basis = s.verlauf.length ? s.verlauf[s.verlauf.length - 1] : null;
  let html = '';
  for (const block of W.bloecke) {
    const zeilen = werteImBlock(block.id).map(k => wertZeile(k, basis)).join('');
    if (!zeilen) continue;
    html += `<section class="karte"><h3>${esc(block.titel)}</h3>${zeilen}</section>`;
  }
  html += weltKarte();
  // Parlament
  const P = ui.parlament(s);
  const gesamt = Object.values(P.sitze).reduce((a, b) => a + b, 0);
  const da = P.reihenfolge.filter(p => P.sitze[p]);
  const balken = da.map(p => `<span style="width:${(100 * P.sitze[p] / gesamt).toFixed(2)}%;background:${P.farbe(p)}" title="${esc(P.name(p))}: ${P.sitze[p]} Sitze"></span>`).join('');
  const naechste = (s.wahlplan || []).find(z => E.zeitIndex(z) >= E.zeitIndex(s.zeit) && !s.f['wahl_' + z]);
  const legende = da.map(p => `${esc(P.name(p))} ${P.sitze[p]}`).join(', ');
  html += `<section class="karte"><h3>${esc(P.titel)}</h3><div class="sitzbalken">${balken}</div>
    <div class="legende">${legende}</div>
    <div class="legende">${esc(P.hinweis ?? (naechste ? `Nächste Wahl: ${E.zeitText(naechste)}` : `Bis ${E.jahrVon(W.ende)} keine Wahl mehr`))}</div></section>`;
  $('lage').innerHTML = html;
  $('k-dossier-lage')?.addEventListener('click', zeigeDossier);
  for (const z of $('lage').querySelectorAll('.zeile[data-wert]')) {
    z.addEventListener('mouseenter', () => zeigeHinweis(z));
    z.addEventListener('focus', () => zeigeHinweis(z));
    z.addEventListener('click', () => zeigeHinweis(z, true));
    z.addEventListener('mouseleave', () => versteckeHinweis());
    z.addEventListener('blur', () => versteckeHinweis());
  }
}

// ---------------------------------------------------------------- Hinweiskärtchen zu den Werten

/** Abschnitt „Die Werte“ der Hilfe – aus denselben Erklärungen wie die Hinweiskärtchen */
function werteHilfe() {
  let html = '<h3 class="hilfe-werte">Die Werte</h3><p>Das Lagebild hat in jedem Land dieselben Blöcke: Regierung, Wirtschaft und Beziehungen sind überall gleich, zuletzt kommt ein Block mit den Werten, die es nur in diesem Land gibt. Zeigst du im Lagebild auf einen Wert, erscheint seine Erklärung samt dem, was ihn zuletzt bewegt hat.</p>';
  for (const block of W.bloecke) {
    const keys = werteImBlock(block.id);
    if (!keys.length) continue;
    html += `<h4>${esc(block.titel)}</h4><dl class="hilfe-werte">`;
    for (const k of keys) {
      const e = erklaerung(k);
      html += `<dt>${esc(sz.werte[k].name)}</dt><dd>${esc([e.was, e.wirkt].filter(Boolean).join(' '))}</dd>`;
    }
    html += '</dl>';
  }
  return html;
}

let hinweisFest = null;
function hinweisElement() {
  let el = $('wert-hinweis');
  if (!el) {
    el = document.createElement('div');
    el.id = 'wert-hinweis';
    el.className = 'wert-hinweis';
    el.setAttribute('role', 'tooltip');
    el.hidden = true;
    document.body.appendChild(el);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') versteckeHinweis(true); });
    window.addEventListener('scroll', () => versteckeHinweis(true), true);
  }
  return el;
}
function zeigeHinweis(zeile, fest = false) {
  const el = hinweisElement();
  if (fest && hinweisFest === zeile) { versteckeHinweis(true); return; }
  if (fest) hinweisFest = zeile;
  el.innerHTML = hinweisHtml(zeile.dataset.wert);
  el.hidden = false;
  const r = zeile.getBoundingClientRect();
  const breite = el.offsetWidth, hoehe = el.offsetHeight;
  // links neben dem Lagebild, sonst darunter
  let links = r.left - breite - 14, oben = r.top - 8;
  if (links < 8) { links = Math.max(8, r.right - breite); oben = r.bottom + 6; }
  oben = Math.max(8, Math.min(oben, window.innerHeight - hoehe - 8));
  el.style.left = `${links}px`;
  el.style.top = `${oben}px`;
}
function versteckeHinweis(auchFest = false) {
  if (hinweisFest && !auchFest) return;
  hinweisFest = null;
  const el = $('wert-hinweis');
  if (el) el.hidden = true;
}

function briefkopf(art, absender) {
  return `<div class="briefkopf"><span class="art">${esc(art)}</span><span>${esc(absender || '')}</span></div>`;
}

// Text wie auf der Schreibmaschine aufbauen; ein Klick schreibt sofort zu Ende
function tippe(el, fertig) {
  if (!einst.schreibmaschine || wenigBewegung) { fertig?.(); return; }
  const knoten = [];
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) knoten.push({ n: w.currentNode, t: w.currentNode.data });
  knoten.forEach(k => { k.n.data = ''; });
  let i = 0, pos = 0, aktiv = true;
  let naechsterAnschlag = 0;
  const schritt = jetzt => {
    if (!aktiv) return;
    // Anschläge im Rhythmus einer flotten Schreibkraft, nicht pro Zeichen
    if (jetzt >= naechsterAnschlag) {
      if (Math.random() < 0.12) Ton.leertaste(); else Ton.taste();
      naechsterAnschlag = jetzt + 55 + Math.random() * 60;
    }
    let budget = 6;
    while (budget > 0 && i < knoten.length) {
      const k = knoten[i];
      const rest = k.t.length - pos;
      const n = Math.min(rest, budget);
      pos += n; budget -= n;
      k.n.data = k.t.slice(0, pos);
      if (pos >= k.t.length) { i++; pos = 0; }
    }
    if (i < knoten.length) requestAnimationFrame(schritt);
    else { aktiv = false; tippAbbruch = null; Ton.glocke(); fertig?.(); }
  };
  tippAbbruch = () => {
    aktiv = false;
    knoten.forEach(k => { k.n.data = k.t; });
    tippAbbruch = null;
    fertig?.();
  };
  requestAnimationFrame(schritt);
}

function szene(blatt, name) {
  const pre = blatt.querySelector('.ascii');
  if (!pre) return;
  if (!name || !SZENEN[name]) { pre.hidden = true; return; }
  stoppSzene = spieleSzene(pre, name, { bewegung: bewegung() });
}

function pfeileHtml(o) {
  if (!einst.hinweise) return '';
  const h = E.hinweisPfeile(sz, o);
  const teile = h.pfeile.map(p => `<span class="pfeil ${p.gut === null ? '' : p.gut ? 'gut' : 'schlecht'}">${esc(p.name)} ${(p.hoch ? '▲' : '▼').repeat(p.stufe)}</span>`);
  if (h.ungewiss) teile.push('<span class="pfeil ungewiss">Ausgang ungewiss</span>');
  if (typeof o.w === 'function' && !teile.length) teile.push('<span class="pfeil">Wirkung hängt von der Lage ab</span>');
  return teile.length ? `<span class="pfeile">${teile.join('')}</span>` : '';
}

// ---------------------------------------------------------------- Zeitung

const MONATE = { 1: 'Januar', 2: 'Juli' };
let zeitungZeit = null;

/** Eine Ausgabe zu Beginn des Halbjahrs `zeit`: berichtet über das vergangene Halbjahr */
function ausgabe(zeit) {
  const vor = E.zeitPlus(zeit, -1);
  const gleich = (a, b) => E.zeitIndex(a) === E.zeitIndex(b);
  // Was die anderen Mächte im letzten Halbjahr öffentlich getan haben, dazu Regierungswechsel
  // (je Land höchstens drei Meldungen, Regierungswechsel zuerst)
  const welt_ = maechte().flatMap(([land]) => (welt.laender[land]?.chronik || [])
    .filter(c => (c.art === 'wechsel' ? gleich(c.zeit, zeit) : gleich(c.zeit, vor) && c.oeffentlich && !c.inland && c.art !== 'vorhaben') && c.ergebnis)
    .sort((a, b) => (b.art === 'wechsel' || b.id === 'dyn:regierungskrise') - (a.art === 'wechsel' || a.id === 'dyn:regierungskrise'))
    .slice(0, 3)
    .map(c => `${W.laender[land].hauptstadt} – ${c.titel}: ${c.ergebnis}`));
  const meldungen = [...welt_, ...((s.ausgaben || []).find(a => gleich(a.zeit, zeit))?.meldungen
    ?? (gleich(zeit, s.zeit) ? s.lage?.meldungen : null) ?? [])];
  const entscheidungen = s.chronik.filter(c => gleich(c.zeit, vor));
  const wahl = s.wahlen.find(w => gleich(w.zeit, vor));
  const wirtschaft = s.verlauf.find(v => gleich(v.zeit, vor));
  const davor = s.verlauf.find(v => gleich(v.zeit, E.zeitPlus(vor, -1)));
  const erste = gleich(zeit, einstieg());
  const nr = E.zeitIndex(zeit) - E.zeitIndex(einstieg()) + 1;

  const Z = ui.zeitung;
  let html = `<header class="zkopf">
    <div class="zkopf-meta"><span>Nr. ${nr}</span><span>${esc(Z.ort(s))}, ${erste ? 'September' : MONATE[E.halbVon(zeit)]} ${E.jahrVon(zeit)}</span><span>${esc(Z.preis(s, zeit))}</span></div>
    <div class="titelzeile">${esc(Z.titel)}</div>
    <div class="zkopf-unter">${esc(Z.untertitel)}</div>
  </header>`;

  // Aufmacher
  const hauptsachen = entscheidungen.filter(c => c.art === 'haupt' && !c.id.startsWith('dyn:'));
  let aufmacher = null;
  const rest = [...entscheidungen];
  if (erste) {
    aufmacher = Z.erste(s, sz);
  } else if (wahl) {
    const bildung = entscheidungen.find(c => c.id === 'dyn:regierungsbildung');
    aufmacher = Z.wahl(wahl, bildung, s);
    if (bildung) rest.splice(rest.indexOf(bildung), 1);
  } else if (hauptsachen.length) {
    const c = hauptsachen[0];
    aufmacher = { titel: c.titel, unter: `${Z.entscheidet}: ${c.wahl}`, text: c.ergebnis };
    rest.splice(rest.indexOf(c), 1);
  }
  if (aufmacher) {
    html += `<article class="aufmacher"><h3>${esc(aufmacher.titel)}</h3><p class="unterzeile">${esc(aufmacher.unter)}</p>${absaetze(aufmacher.text)}</article>`;
  }
  // Wer später einsteigt, bekommt in der ersten Ausgabe einen Rückblick auf die Jahre davor
  if (erste && E.zeitIndex(einstieg()) > E.zeitIndex(W.start)) {
    const rueckblick = maechte().flatMap(([land, ort]) => (welt.laender[land].chronik || [])
      .filter(c => E.zeitIndex(c.zeit) < E.zeitIndex(zeit) && c.ergebnis && (c.art === 'wechsel' || (c.oeffentlich && !c.inland && c.art === 'haupt' && !c.id.startsWith('dyn:'))))
      .map(c => ({ ...c, ort, wichtig: !!W.laender[land].ereignisse?.find(e => e.id === c.id)?.rueckblick })))
      .sort((a, b) => E.zeitIndex(a.zeit) - E.zeitIndex(b.zeit));
    // nicht mehr als zwölf Meldungen: zuerst die Wendepunkte (`rueckblick: true` am Ereignis), dann gleichmäßig verteilt
    const wichtige = rueckblick.filter(c => c.wichtig).slice(0, 12);
    const andere = rueckblick.filter(c => !c.wichtig);
    const frei = 12 - wichtige.length;
    const auswahl = [...wichtige, ...(andere.length > frei ? andere.filter((_, i) => i % Math.ceil(andere.length / Math.max(frei, 1)) === 0).slice(0, frei) : andere)]
      .sort((a, b) => E.zeitIndex(a.zeit) - E.zeitIndex(b.zeit));
    if (auswahl.length) {
      html += `<section class="rueckblick"><h4>Was seit ${E.jahrVon(W.start)} geschah</h4>${auswahl.map(c => `<div class="meldung-z"><h5>${esc(E.zeitText(c.zeit))} · ${esc(c.ort)} – ${esc(c.titel)}</h5><p>${esc(c.ergebnis)}</p></div>`).join('')}</section>`;
    }
  }

  html += `<div class="spalten">`;
  if (rest.length) {
    html += `<section><h4>${esc(Z.rubrik)}</h4>${rest.map(c => `<div class="meldung-z"><h5>${esc(c.titel)}</h5><p>${esc(c.ergebnis || c.wahl)}</p></div>`).join('')}</section>`;
  }
  if (meldungen.length) {
    html += `<section><h4>Aus aller Welt</h4>${meldungen.map(m => `<div class="meldung-z"><p>${esc(m)}</p></div>`).join('')}</section>`;
  }
  if (wirtschaft) {
    html += `<section class="kasten"><h4>${esc(Z.wirtschaftTitel || 'Wirtschaft und Umfragen')}</h4>${Z.wirtschaft(wirtschaft, davor, s, vor)}</section>`;
  }
  if (gleich(zeit, s.zeit) && (s.wahlplan || []).some(z => gleich(z, zeit))) {
    html += `<section class="kasten"><h4>Wahljahr</h4><p>${esc(E.txt(Z.wahljahr, s))}</p></section>`;
  }
  if (!rest.length && !meldungen.length && !wirtschaft) html += `<section><p>Ein ruhiges Halbjahr.</p></section>`;
  html += `</div>`;
  return html;
}

function zeigeZeitung(zeit = s.zeit) {
  zeitungZeit = zeit;
  $('zeitung').innerHTML = ausgabe(zeit);
  $('zeitung').scrollTop = 0;
  $('z-aelter').disabled = E.zeitIndex(zeit) <= E.zeitIndex(einstieg());
  $('z-neuer').disabled = E.zeitIndex(zeit) >= E.zeitIndex(s.zeit);
  if (E.zeitIndex(zeit) === E.zeitIndex(s.zeit)) {
    s.zeitungGelesen = s.zeit;
    $('zeitung-neu').hidden = true;
  }
  if (!$('d-zeitung').open) { $('d-zeitung').showModal(); Ton.blatt(); }
}

// ---------------------------------------------------------------- Ereignis

function zeichneEreignis(blatt, ev, land) {
  const akte = ev.art === 'akte';
  blatt.classList.toggle('akte', akte);
  const opts = E.optionen(W, welt, land, ev);
  let html = briefkopf(akte ? 'Schreiben' : ev.dynamisch ? 'Eilvorlage' : 'Vorlage', E.txt(ev.absender, s));
  html += `<pre class="ascii" aria-hidden="true"></pre>`;
  html += `<h2>${esc(E.txt(ev.titel, s))}</h2><p class="datum">${esc(E.txt(ev.datum, s) || E.zeitText(s.zeit))}</p>`;
  html += `<div class="text">${absaetze(E.txt(ev.text, s))}</div>`;
  html += `<div class="entscheidung" hidden><p class="vorschlaege-titel">${akte ? 'Antwort' : 'Vorschläge zur Entscheidung'}</p><div class="vorschlaege">`;
  opts.forEach((o, i) => {
    html += `<button class="vorschlag" data-index="${o.index}" ${o.verfuegbar ? '' : 'disabled title="Unter den gegebenen Umständen nicht möglich"'}>
      <span class="kaestchen" aria-hidden="true">☐</span>
      <span class="vtext"><span class="nr">${i + 1}.</span> ${esc(E.txt(o.text, s))}</span>
      ${pfeileHtml(o)}
    </button>`;
  });
  html += `</div></div>`;
  blatt.innerHTML = html;
  szene(blatt, ev.ascii);
  const entscheidung = blatt.querySelector('.entscheidung');
  tippe(blatt.querySelector('.text'), () => { entscheidung.hidden = false; });
  blatt.querySelectorAll('.vorschlag').forEach(b => {
    b.onclick = () => {
      // nur einmal entscheiden, auch bei schnellem Doppelklick
      blatt.querySelectorAll('.vorschlag').forEach(x => { x.disabled = true; });
      b.querySelector('.kaestchen').textContent = '☒';
      Ton.stempel();
      E.waehle(W, welt, Number(b.dataset.index));
      setTimeout(zeichne, wenigBewegung ? 0 : 180);
    };
  });
}

// ---------------------------------------------------------------- Ergebnis

function aenderungenHtml(liste) {
  if (!liste?.length) return '';
  return `<ul class="aenderungen">${liste.map(a => {
    const d = sz.werte[a.key];
    const hoch = a.delta > 0;
    const gut = d.neutral ? null : (d.invertiert ? !hoch : hoch);
    return `<li class="${gut === null ? '' : gut ? 'gut' : 'schlecht'}">${esc(d.kurz || d.name)} ${hoch ? '+' : '−'}${zahl(Math.abs(a.delta), Number.isInteger(a.delta) ? 0 : 1)}</li>`;
  }).join('')}</ul>`;
}

function zeichneErgebnis(blatt, erg) {
  const letzter = s.chronik[s.chronik.length - 1];
  let html = briefkopf('Vermerk', E.txt(ui.amt, s));
  html += `<pre class="ascii" aria-hidden="true"></pre>`;
  if (erg.hist !== null && einst.randvermerke) {
    html += erg.hist
      ? `<span class="stempel hist">Wie in der Geschichte</span>`
      : `<span class="stempel hist abweichend">Abweichung</span>`;
  }
  html += `<h2>${esc(erg.titel)}</h2>`;
  if (!erg.vorhaben && letzter) {
    html += `<div class="gewaehlt"><span class="kaestchen" aria-hidden="true">☒</span><span>${esc(letzter.wahl)} <span class="paraphe">${esc(ui.paraphe(s))}</span></span></div>`;
  }
  html += `<div class="text">${absaetze(erg.texte.join('\n\n'))}</div>`;
  html += aenderungenHtml(erg.aenderungen);
  if (erg.historisch && einst.randvermerke) html += `<div class="randvermerk"><b>Historisch:</b> ${esc(erg.historisch)}</div>`;
  html += `<div class="weiter-zeile"><button class="knopf haupt" data-primaer id="k-weiter">Weiter</button><span class="tastenhinweis">Eingabetaste</span></div>`;
  blatt.innerHTML = html;
  szene(blatt, erg.ascii);
  $('k-weiter').onclick = () => { E.weiter(W, welt); zeichne(); };
}

// ---------------------------------------------------------------- Telegramm

/** Eine Entscheidung eines anderen Landes, die das eigene Land unmittelbar trifft */
function zeichneTelegramm(blatt, t) {
  const M = W.laender[t.von];
  blatt.classList.add('telegramm');
  let html = briefkopf('Telegramm', `aus ${M.hauptstadt}`);
  html += `<h2>${esc(t.titel)}</h2><p class="datum">${esc(E.zeitLang(t.zeit))}</p>`;
  html += `<div class="text">${absaetze(t.texte.join('\n\n'))}</div>`;
  html += aenderungenHtml(t.aenderungen);
  html += `<div class="weiter-zeile"><button class="knopf haupt" data-primaer id="k-weiter">Zur Kenntnis genommen</button><span class="tastenhinweis">Eingabetaste</span></div>`;
  blatt.innerHTML = html;
  $('k-weiter').onclick = () => { E.weiter(W, welt); zeichne(); };
}

// ---------------------------------------------------------------- Regierungsvorhaben

function zeichneVorhaben(blatt, liste) {
  let html = briefkopf('Kabinettsvorlage', E.txt(ui.vorhaben.absender, s));
  html += `<h2>Regierungsvorhaben</h2><p class="datum">${esc(E.zeitLang(s.zeit))}</p>`;
  html += `<div class="text"><p>${esc(ui.vorhaben.text(s))}</p></div>`;
  html += `<ul class="vorhaben">`;
  for (const v of liste) {
    const kosten = v.kosten ? `Haushalt −${v.kosten}` : 'ohne Kosten';
    html += `<li><h3>${esc(E.txt(v.titel, s))}</h3><span class="kosten ${v.kosten ? '' : 'frei'}">${kosten}</span>
      <p>${esc(E.txt(v.beschreibung, s))}</p>
      ${pfeileHtml(v) ? `<p>${pfeileHtml(v)}</p>` : ''}
      <button class="knopf klein" data-id="${esc(v.id)}" ${v.leistbar ? '' : 'disabled title="Dafür reicht der Haushalt nicht"'}>Einbringen</button></li>`;
  }
  html += `</ul><div class="weiter-zeile"><button class="knopf" id="k-keins">Kein neues Vorhaben</button></div>`;
  blatt.innerHTML = html;
  blatt.querySelectorAll('[data-id]').forEach(b => {
    b.onclick = () => { if (welt.phase !== 'spiel') return; Ton.stempel(); E.waehleVorhaben(W, welt, b.dataset.id); zeichne(); };
  });
  $('k-keins').onclick = () => { if (welt.phase !== 'spiel') return; E.waehleVorhaben(W, welt, null); zeichne(); };
}

// ---------------------------------------------------------------- Wahlabend

function zeichneWahl(blatt, e) {
  const vorher = s.wahlen.length > 1 ? s.wahlen[s.wahlen.length - 2] : null;
  const reihen = Object.entries(e.stimmen).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  const WA = ui.wahlabend;
  let html = briefkopf('Wahlabend', E.txt(WA.absender, s));
  html += `<h2>${esc(WA.titel(e))}</h2><p class="datum">${esc(WA.unter || 'Vorläufiges amtliches Endergebnis')}</p>`;
  html += `<pre class="wahl-balken" id="wahl-balken"></pre>`;
  html += `<p class="unterueberschrift">Sitzverteilung (${e.gesamt} Sitze)</p><div class="sitzreihe" id="sitzreihe"></div>`;
  html += `<div class="weiter-zeile"><button class="knopf haupt" data-primaer id="k-weiter">Zur Regierungsbildung</button><span class="tastenhinweis">Eingabetaste</span></div>`;
  blatt.innerHTML = html;
  const name = k => WA.name(k, e);
  const breite = Math.max(...reihen.map(([k]) => name(k).length)) + 2;
  const zeile = (k, v, f) => {
    const vv = v * f;
    const diff = vorher?.stimmen[k] !== undefined ? vv - vorher.stimmen[k] : null;
    const d = f === 1 && diff !== null ? `  (${diff >= 0 ? '+' : '−'}${zahl(Math.abs(diff))})` : '';
    return `${name(k).padEnd(breite)}${'█'.repeat(Math.round(vv / 1.25)).padEnd(42)} ${zahl(vv).padStart(5)} %${d}`;
  };
  const pre = $('wahl-balken');
  let f = wenigBewegung ? 1 : 0;
  const male = () => { pre.textContent = reihen.map(([k, v]) => zeile(k, v, f)).join('\n'); };
  male();
  if (f < 1) {
    Ton.fernschreiber(0.9);
    const iv = setInterval(() => { f = Math.min(1, f + 0.05); male(); if (f >= 1) clearInterval(iv); }, 40);
    stoppSzene = () => { clearInterval(iv); f = 1; male(); };
  }
  const sitze = $('sitzreihe');
  for (const p of WA.reihenfolge) {
    const n = Math.round((e.sitze[p] || 0) / 5);
    for (let i = 0; i < n; i++) {
      const d = document.createElement('span');
      d.style.background = WA.farbe(p);
      d.title = `${name(p)}: ${e.sitze[p]} Sitze`;
      sitze.appendChild(d);
    }
  }
  $('k-weiter').onclick = () => { stoppSzene(); E.weiter(W, welt); zeichne(); };
}

// ---------------------------------------------------------------- Ende

function diagramm() {
  const v = s.verlauf;
  if (v.length < 2) return '';
  const B_ = 640, H = 200, L = 34, R = 10, T = 12, B = 26;
  const x = i => L + (B_ - L - R) * i / (v.length - 1);
  const reihen = ui.diagramm;
  const max = 60;
  const y = val => T + (H - T - B) * (1 - Math.max(0, val) / max);
  let svg = `<svg class="diagramm" viewBox="0 0 ${B_} ${H}" role="img" aria-label="Verlauf von Umfragewerten, Wachstum und Arbeitslosigkeit">`;
  for (const g of [0, 20, 40, 60]) svg += `<line x1="${L}" x2="${B_ - R}" y1="${y(g)}" y2="${y(g)}" stroke="var(--linie)" stroke-width="1"/><text x="${L - 6}" y="${y(g) + 4}" text-anchor="end">${g}</text>`;
  v.forEach((p, i) => { if (E.halbVon(p.zeit) === 2 && E.jahrVon(p.zeit) % 2 === 1) svg += `<text x="${x(i)}" y="${H - 6}" text-anchor="middle">${E.jahrVon(p.zeit)}</text>`; });
  for (const r of reihen) {
    svg += `<polyline fill="none" stroke="${r.farbe}" stroke-width="2" points="${v.map((p, i) => `${x(i).toFixed(1)},${y(p[r.key]).toFixed(1)}`).join(' ')}"/>`;
  }
  svg += `</svg><p class="legende">${reihen.map(r => `<span style="color:${r.farbe}">━</span> ${r.name} (%)`).join('&nbsp;&nbsp; ')}</p>`;
  return svg;
}

function zeichneEnde(blatt) {
  const ende = sz.enden[s.ende.id];
  let html = briefkopf(s.ende.id === 'abschluss' ? 'Abschlussbericht' : 'Letzte Meldung', E.txt(ui.amt, s));
  html += `<pre class="ascii" aria-hidden="true"></pre>`;
  html += `<h2>${esc(E.txt(ende.titel, s))}</h2><p class="datum">${esc(E.zeitLang(s.ende.zeit))}</p>`;
  html += `<div class="text">${absaetze(E.txt(ende.text, s))}</div>`;
  html += diagramm();
  html += `<div class="weiter-zeile"><button class="knopf" id="k-ende-chronik">Chronik ansehen</button><button class="knopf haupt" data-primaer id="k-ende-neu">Neues Spiel</button></div>`;
  blatt.innerHTML = html;
  szene(blatt, ende.ascii);
  $('k-ende-chronik').onclick = zeigeChronik;
  $('k-ende-neu').onclick = starteNeu;
}

// ---------------------------------------------------------------- Dialoge

// ---------------------------------------------------------------- Entscheidungen

const ORT = { usa: 'Washington', su: 'Moskau', grossbritannien: 'London', frankreich: 'Paris', brd: 'Bonn' };

function kostenText(kosten) {
  return Object.entries(kosten || {}).map(([k, v]) => `${sz.werte[k]?.kurz || k} ${v > 0 ? '+' : '−'}${zahl(Math.abs(v), Number.isInteger(v) ? 0 : 1)}`).join(', ');
}

function zeigeEntscheidungen() {
  const moeglich = E.entscheidungMoeglich(W, welt);
  const liste = E.entscheidungen(W, welt);
  $('entscheidungen-liste').innerHTML = liste.map(e => {
    const an = e.an ? E.txt(e.an, s) : null;
    const kosten = kostenText(e.kosten);
    const grund = !moeglich ? 'Erst wieder, wenn ein Vorgang auf deinem Schreibtisch liegt.' : e.grund;
    return `<li class="${e.verfuegbar && moeglich ? '' : 'gesperrt'}">
      <div class="e-kopf"><b>${esc(e.titel)}</b>${an ? `<span class="e-an">Anfrage an ${esc(ORT[an.land] || an.land)}</span>` : ''}</div>
      <p>${esc(e.text)}</p>
      <div class="e-fuss"><span class="e-kosten">${kosten ? `Kosten: ${esc(kosten)}` : 'Keine Kosten'} · danach ${e.einmalig ? 'nicht wiederholbar' : `${e.abklingzeit ?? 2} Halbjahre Pause`}</span>
      ${grund ? `<span class="e-grund">${esc(grund)}</span>` : `<button class="knopf klein" data-entscheidung="${esc(e.id)}">Entscheiden</button>`}</div></li>`;
  }).join('') || '<li>Im Moment stehen keine Entscheidungen an.</li>';
  for (const b of $('entscheidungen-liste').querySelectorAll('[data-entscheidung]')) {
    b.onclick = () => {
      b.disabled = true;
      $('d-entscheidungen').close();
      try { E.triffEntscheidung(W, welt, b.dataset.entscheidung); } catch (err) { console.error(err); }
      Ton.stempel?.();
      zeichne();
    };
  }
  $('d-entscheidungen').showModal();
}

/** Zahl der Entscheidungen, die gerade möglich sind, am Knopf in der Kopfleiste */
function zeichneEntscheidungsZahl() {
  const n = E.entscheidungMoeglich(W, welt) ? E.entscheidungen(W, welt).filter(e => e.verfuegbar).length : 0;
  $('entscheidungen-zahl').hidden = !n;
  $('entscheidungen-zahl').textContent = n;
}

function zeigeChronik() {
  const liste = $('chronik-liste');
  liste.innerHTML = s.chronik.map(c => `<li class="${c.art === 'vorhaben' ? 'vorhaben-eintrag' : ''}">
    <span class="z">${esc(E.zeitText(c.zeit))}</span><span class="t">${esc(c.titel)}</span>
    <span class="h">${c.hist === true ? 'wie historisch' : c.hist === false ? 'abweichend' : ''}</span>
    <span class="w">${esc(c.art === 'vorhaben' ? c.ergebnis : c.wahl)}</span></li>`).join('') || '<li>Noch keine Entscheidungen.</li>';
  $('d-chronik').showModal();
}

async function zeigePlaetze(modus) {
  $('plaetze-titel').textContent = modus === 'speichern' ? 'Spielstand speichern' : 'Spielstand laden';
  const namen = modus === 'speichern' ? ['platz1', 'platz2', 'platz3'] : ['auto', 'platz1', 'platz2', 'platz3'];
  const plaetze = await Sp.plaetze(namen);
  const ul = $('plaetze-liste');
  ul.innerHTML = plaetze.map(p => {
    const st = p.stand;
    const titel = p.name === 'auto' ? 'Automatisch gespeichert' : `Platz ${p.name.slice(-1)}`;
    const M = ladbar(st) ? W.laender[st.spieler[0]] : null;
    const kurz = M?.oberflaeche.kurzinfo(st.laender[st.spieler[0]]);
    const info = !st ? '<small>leer</small>'
      : !ladbar(st) ? '<small>Spielstand aus einer älteren Version, kann nicht mehr geladen werden</small>'
      : `${esc(M.kurz || M.name)}, ${E.zeitText(st.zeit)}${kurz ? `, ${esc(kurz)}` : ''}${st.ende ? ' (beendet)' : ''}<small>${st.gespeichert ? new Date(st.gespeichert).toLocaleString('de-DE') : ''}</small>`;
    const knopf = modus === 'speichern'
      ? `<button class="knopf klein" data-name="${p.name}">Hier speichern</button>`
      : `<button class="knopf klein" data-name="${p.name}" ${ladbar(st) ? '' : 'disabled'}>Laden</button>`;
    return `<li><span class="info"><b>${titel}</b><br>${info}</span>${knopf}</li>`;
  }).join('');
  ul.querySelectorAll('[data-name]').forEach(b => {
    b.onclick = async () => {
      if (modus === 'speichern') {
        await Sp.speichere(b.dataset.name, { ...welt, gespeichert: Date.now() });
        $('d-plaetze').close();
        meldung('Gespeichert.');
      } else {
        const st = await Sp.lade(b.dataset.name);
        if (!ladbar(st)) return;
        uebernehme(st);
        $('d-plaetze').close();
        $('d-menue').close();
        zeigeSpiel();
        meldung('Spielstand geladen.');
      }
    };
  });
  $('d-plaetze').showModal();
}

function einstellungenVerbinden() {
  for (const k of ['hinweise', 'randvermerke', 'schreibmaschine']) {
    const el = $('e-' + k);
    el.checked = !!einst[k];
    el.onchange = () => { einst[k] = el.checked; Sp.speichereEinstellungen(einst); if (s && !$('spiel').hidden) zeichne(); };
  }
  Ton.einstellen({ ton: einst.ton, laut: einst.laut });
  const ton = $('e-ton');
  const laut = $('e-laut');
  ton.checked = !!einst.ton;
  laut.value = Math.round(einst.laut * 100);
  laut.disabled = !einst.ton;
  ton.onchange = () => {
    einst.ton = ton.checked; laut.disabled = !ton.checked;
    Ton.einstellen({ ton: einst.ton }); Sp.speichereEinstellungen(einst);
    if (einst.ton) Ton.taste();
  };
  laut.oninput = () => { einst.laut = laut.value / 100; Ton.einstellen({ laut: einst.laut }); };
  laut.onchange = () => { Sp.speichereEinstellungen(einst); Ton.glocke(); };
}

// ---------------------------------------------------------------- Updates

let neueVersion = null;

async function installiereUpdate() {
  const status = $('update-status');
  $('update-band-text').textContent = 'Update wird geladen und installiert …';
  status.textContent = 'Update wird geladen und installiert. Das Programm startet danach neu; der letzte automatische Spielstand bleibt erhalten.';
  for (const id of ['m-update', 'm-installieren', 'u-installieren', 'u-spaeter']) $(id).disabled = true;
  try {
    if (welt && !welt.ende) await Sp.speichere('auto', { ...welt, gespeichert: Date.now() });
    await Update.installieren();
  } catch (f) {
    status.textContent = String(f);
    $('update-band-text').textContent = 'Update fehlgeschlagen: ' + f;
    for (const id of ['m-update', 'm-installieren', 'u-installieren', 'u-spaeter']) $(id).disabled = false;
  }
}

async function sucheUpdate(still) {
  const status = $('update-status');
  if (!still) { status.textContent = 'Suche nach Updates …'; $('m-update').disabled = true; }
  try {
    const r = await Update.pruefen();
    neueVersion = r.verfuegbar ? r.version : null;
    $('m-installieren').hidden = !neueVersion;
    if (neueVersion) {
      status.textContent = `Version ${neueVersion} ist verfügbar.`;
      $('update-band-text').textContent = `Neue Version ${neueVersion} verfügbar.`;
      if (still) $('update-band').hidden = false;
    } else if (!still) {
      status.textContent = 'Du hast die neueste Version.';
    }
  } catch (f) {
    if (!still) status.textContent = String(f);
  } finally {
    $('m-update').disabled = false;
  }
}

async function updatesVerbinden() {
  if (!Update.verfuegbar()) return;   // im Browser kein Update
  $('programm').hidden = false;
  const v = await Update.version();
  $('programm-version').textContent = v ? `Version ${v}` : '';
  $('m-update').onclick = () => sucheUpdate(false);
  $('m-installieren').onclick = installiereUpdate;
  $('u-installieren').onclick = installiereUpdate;
  $('u-spaeter').onclick = () => { $('update-band').hidden = true; };
  setTimeout(() => sucheUpdate(true), 1500);
}

// ---------------------------------------------------------------- Start

document.addEventListener('DOMContentLoaded', () => {
  $('k-neu').onclick = starteNeu;
  $('k-fortsetzen').onclick = async () => { const st = await Sp.lade('auto'); if (ladbar(st)) { uebernehme(st); zeigeSpiel(); } };
  $('k-laden').onclick = () => zeigePlaetze('laden');
  $('k-chronik').onclick = zeigeChronik;
  $('k-entscheidungen').onclick = zeigeEntscheidungen;
  $('k-dossier').onclick = zeigeDossier;
  $('n-treue').oninput = treueText;
  $('n-start').onclick = beginneSpiel;
  $('k-zeitung').onclick = () => zeigeZeitung();
  $('z-aelter').onclick = () => { Ton.blatt(); zeigeZeitung(E.zeitPlus(zeitungZeit, -1)); };
  $('z-neuer').onclick = () => { Ton.blatt(); zeigeZeitung(E.zeitPlus(zeitungZeit, 1)); };
  $('k-speichern').onclick = () => zeigePlaetze('speichern');
  $('k-menue').onclick = () => $('d-menue').showModal();
  $('m-speichern').onclick = () => zeigePlaetze('speichern');
  $('m-laden').onclick = () => zeigePlaetze('laden');
  $('m-hilfe').onclick = () => { $('hilfe-land').innerHTML = ui.hilfe + werteHilfe(); $('d-hilfe').showModal(); };
  $('m-titel').onclick = () => { $('d-menue').close(); zeigeTitel(); };
  document.querySelectorAll('[data-schliessen]').forEach(b => { b.onclick = () => b.closest('dialog').close(); });
  einstellungenVerbinden();
  updatesVerbinden();

  $('blatt').addEventListener('click', e => {
    if (tippAbbruch && !e.target.closest('button')) tippAbbruch();
  });

  document.addEventListener('keydown', e => {
    if (document.querySelector('dialog[open]') || $('spiel').hidden) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (tippAbbruch && (e.key === 'Enter' || e.key === ' ' || /^[1-9]$/.test(e.key))) { e.preventDefault(); tippAbbruch(); return; }
    if (/^[1-9]$/.test(e.key)) {
      const b = $('blatt').querySelectorAll('.vorschlag')[Number(e.key) - 1];
      if (b && !b.disabled && !b.closest('[hidden]')) { e.preventDefault(); b.click(); }
    } else if (e.key === 'Enter') {
      const b = $('blatt').querySelector('[data-primaer]');
      if (b && document.activeElement?.tagName !== 'BUTTON') { e.preventDefault(); b.click(); }
    } else if (e.key === 'c' || e.key === 'C') {
      zeigeChronik();
    } else if (e.key === 'e' || e.key === 'E') {
      zeigeEntscheidungen();
    } else if (e.key === 'd' || e.key === 'D') {
      zeigeDossier();
    } else if (e.key === 'z' || e.key === 'Z') {
      zeigeZeitung();
    } else if (e.key === 'Escape') {
      $('d-menue').showModal();
    }
  });

  zeigeTitel();
});
