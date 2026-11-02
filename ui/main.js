// Oberfläche: zeichnet den Spielstand und leitet Eingaben an die Engine weiter
import * as E from './engine.js';
import szenario from './szenarien/brd1949/index.js';
import { spieleSzene, SZENEN } from './ascii.js';
import * as Sp from './speicher.js';

const sz = E.bereiteVor(szenario);
let s = null;
let einst = Sp.einstellungen();
let stoppSzene = () => {};
let tippAbbruch = null;
const wenigBewegung = matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = id => document.getElementById(id);
const esc = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const zahl = (x, d = 1) => Number(x).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const absaetze = t => String(t || '').split(/\n\s*\n/).filter(Boolean).map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
const parteiName = (k, st = s) => (k === 'Kleine' ? sz.modell.kleineName(st) : sz.parteien[k]?.name || k);
const regierungText = st => {
  const n = st.regierung.map(p => parteiName(p, st));
  return n.length > 1 ? n.slice(0, -1).join(', ') + ' und ' + n[n.length - 1] : n[0];
};
const kurzKanzler = st => st.kanzler.replace(/^von /, '').charAt(0) + '.';
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
  $('titel-text').textContent = sz.beschreibung;
  stoppSzene = spieleSzene($('titel-ascii'), 'bundeshaus', { bewegung: bewegung() });
  const auto = await Sp.lade('auto');
  $('k-fortsetzen').hidden = !(auto && auto.szenario === sz.id && !auto.ende);
  $('k-neu').focus();
}

function starteNeu() {
  s = E.neuesSpiel(sz);
  zeigeSpiel();
}

function zeigeSpiel() {
  $('titel').hidden = true;
  $('spiel').hidden = false;
  zeichne();
}

// ---------------------------------------------------------------- Zeichnen

function zeichne() {
  stoppSzene();
  tippAbbruch = null;
  zeichneKopf();
  zeichneLage();
  const a = E.aktuelles(sz, s);
  const blatt = $('blatt');
  blatt.className = 'blatt';
  blatt.scrollTop = 0;
  blatt.closest('.mappe').scrollTop = 0;
  switch (a.typ) {
    case 'lage': zeichneLagebericht(blatt); break;
    case 'ereignis': zeichneEreignis(blatt, a.ev); break;
    case 'ergebnis': zeichneErgebnis(blatt, a.ergebnis); break;
    case 'vorhaben': zeichneVorhaben(blatt, a.liste); break;
    case 'wahl': zeichneWahl(blatt, a.ergebnis); break;
    case 'ende': zeichneEnde(blatt); break;
    default: E.weiter(sz, s); return zeichne();
  }
  Sp.speichere('auto', { ...s, gespeichert: Date.now() });
  blatt.focus({ preventScroll: true });
}

function zeichneKopf() {
  $('eingang').innerHTML = `<span class="stempel">${esc(E.zeitLang(s.zeit))}<small>Runde ${s.runde} von ${E.zeitIndex(sz.ende) - E.zeitIndex(sz.start) + 1}</small></span>`;
  $('kopf-regierung').innerHTML = `<strong>Bundeskanzler ${esc(s.kanzler)}</strong>, Regierung aus ${esc(regierungText(s))}`;
}

const SKALA = {
  zustimmung: [10, 60], wachstum: [-2, 12], arbeitslosigkeit: [0, 15], ansehen: [-30, 30], haushalt: [0, 100],
};

function zeichneLage() {
  const basis = s.verlauf.length ? s.verlauf[s.verlauf.length - 1] : null;
  let html = '';
  for (const gruppe of sz.anzeige) {
    html += `<section class="karte"><h3>${esc(gruppe.titel)}</h3>`;
    for (const k of gruppe.werte) {
      const d = sz.werte[k];
      if (k === 'flucht' && s.f.vereinigt) continue;
      if (k === 'einheit' && s.f.vereinigt) {
        html += `<div class="zeile"><span>${esc(d.kurz)}</span><span class="balken">vollzogen</span><span class="wert"></span><span></span></div>`;
        continue;
      }
      const v = s.w[k];
      const [lo, hi] = SKALA[k] || [d.min, d.max];
      const n = Math.max(0, Math.min(10, Math.round(10 * (v - lo) / (hi - lo))));
      const balken = '█'.repeat(n) + '░'.repeat(10 - n);
      const wert = d.einheit === '%' ? zahl(v, 1) : (k === 'ansehen' && v > 0 ? '+' : '') + Math.round(v);
      let trend = '';
      if (basis && basis[k] !== undefined) {
        const delta = v - basis[k];
        if (Math.abs(delta) >= 0.5) {
          const hoch = delta > 0;
          const gut = d.neutral ? null : (d.invertiert ? !hoch : hoch);
          trend = `<span class="trend ${gut === null ? '' : gut ? 'gut' : 'schlecht'}" title="seit Ende des letzten Halbjahrs: ${delta > 0 ? '+' : ''}${zahl(delta, 1)}">${hoch ? '▲' : '▼'}</span>`;
        }
      }
      const warn = (k === 'sowjet' && v >= 85) || (k === 'haushalt' && v <= 10) || (k === 'koalition' && v <= 15 && s.regierung.length > 1)
        || (['usa', 'frankreich', 'grossbritannien'].includes(k) && v < 20 && !s.f.vereinigt && s.w.souveraenitaet < 50);
      html += `<div class="zeile${warn ? ' warnung' : ''}" title="${esc(d.name)}"><span>${esc(d.kurz)}</span><span class="balken" aria-hidden="true">${balken}</span><span class="wert">${wert}</span>${trend || '<span></span>'}</div>`;
    }
    html += '</section>';
  }
  // Bundestag
  const gesamt = Object.values(s.sitze).reduce((a, b) => a + b, 0);
  const reihenfolge = ['KPD', 'SPD', 'FDP', 'Union', 'Kleine', 'Sonstige'];
  const balken = reihenfolge.filter(p => s.sitze[p]).map(p => `<span style="width:${(100 * s.sitze[p] / gesamt).toFixed(2)}%;background:${sz.parteien[p].farbe}" title="${esc(parteiName(p))}: ${s.sitze[p]} Sitze"></span>`).join('');
  const naechste = (s.wahlplan || []).find(z => E.zeitIndex(z) >= E.zeitIndex(s.zeit));
  const legende = reihenfolge.filter(p => s.sitze[p]).map(p => `${esc(parteiName(p))} ${s.sitze[p]}`).join(', ');
  html += `<section class="karte"><h3>Bundestag</h3><div class="sitzbalken">${balken}</div>
    <div class="legende">${legende}</div>
    <div class="legende">${naechste ? `Nächste Wahl: ${E.zeitText(naechste)}` : 'Bis 1964 keine Wahl mehr'}</div></section>`;
  $('lage').innerHTML = html;
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
  const schritt = () => {
    if (!aktiv) return;
    let budget = 7;
    while (budget > 0 && i < knoten.length) {
      const k = knoten[i];
      const rest = k.t.length - pos;
      const n = Math.min(rest, budget);
      pos += n; budget -= n;
      k.n.data = k.t.slice(0, pos);
      if (pos >= k.t.length) { i++; pos = 0; }
    }
    if (i < knoten.length) requestAnimationFrame(schritt);
    else { aktiv = false; tippAbbruch = null; fertig?.(); }
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

// ---------------------------------------------------------------- Lagebericht

function zeichneLagebericht(blatt) {
  const v = s.verlauf;
  const letzt = v[v.length - 1];
  const vor = v.length > 1 ? v[v.length - 2] : null;
  let html = briefkopf('Lagebericht', 'Presse- und Informationsamt der Bundesregierung');
  html += `<pre class="ascii" aria-hidden="true"></pre>`;
  html += `<h2>Die Lage zu Beginn des ${esc(E.zeitLang(s.zeit).replace('Erstes', 'ersten').replace('Zweites', 'zweiten'))}</h2>`;
  html += `<div class="text">`;
  if (s.runde === 1) html += absaetze(sz.beschreibung + '\n\nDu spielst die Union als Kanzlerpartei. Jedes Halbjahr legen dir Ministerien und Botschaften Vorgänge zur Entscheidung vor; am Ende bringst du ein Regierungsvorhaben ein. 1953, 1957 und 1961 wird gewählt.');
  const meldungen = s.lage?.meldungen || [];
  if (meldungen.length) {
    html += `<p class="unterueberschrift">Aus dem Zeitgeschehen</p><ul class="meldungen">${meldungen.map(m => `<li>${esc(m)}</li>`).join('')}</ul>`;
  }
  if (letzt) {
    html += `<p class="unterueberschrift">Wirtschaft</p>`;
    html += `<p>Die Wirtschaft ist im vergangenen Halbjahr mit einer Jahresrate von ${zahl(letzt.wachstum)}&nbsp;% gewachsen, die Arbeitslosenquote liegt bei ${zahl(letzt.arbeitslosigkeit)}&nbsp;%${vor ? ` (vorher ${zahl(vor.arbeitslosigkeit)}&nbsp;%)` : ''}. Die Union kommt in Umfragen auf ${zahl(letzt.zustimmung)}&nbsp;%.</p>`;
  }
  const wahl = (s.wahlplan || []).some(z => E.zeitIndex(z) === E.zeitIndex(s.zeit));
  if (wahl) html += `<p><strong>In diesem Halbjahr wird ein neuer Bundestag gewählt.</strong></p>`;
  const anzahl = s.queue.filter(id => id !== '@vorhaben').length;
  html += `<p>Auf dem Schreibtisch liegen ${anzahl === 1 ? 'ein Vorgang' : `${anzahl} Vorgänge`} zur Entscheidung.</p>`;
  html += `</div><div class="weiter-zeile"><button class="knopf haupt" data-primaer id="k-weiter">Zum ersten Vorgang</button><span class="tastenhinweis">Eingabetaste</span></div>`;
  blatt.innerHTML = html;
  szene(blatt, s.runde === 1 ? 'bundeshaus' : null);
  $('k-weiter').onclick = () => { E.lageGesehen(sz, s); zeichne(); };
  tippe(blatt.querySelector('.text'));
}

// ---------------------------------------------------------------- Ereignis

function zeichneEreignis(blatt, ev) {
  const akte = ev.art === 'akte';
  blatt.classList.toggle('akte', akte);
  const opts = E.optionen(sz, s, ev);
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
      b.querySelector('.kaestchen').textContent = '☒';
      E.waehle(sz, s, Number(b.dataset.index));
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
  let html = briefkopf('Vermerk', 'Bundeskanzleramt');
  html += `<pre class="ascii" aria-hidden="true"></pre>`;
  if (erg.hist !== null && einst.randvermerke) {
    html += erg.hist
      ? `<span class="stempel hist">Wie in der Geschichte</span>`
      : `<span class="stempel hist abweichend">Abweichung</span>`;
  }
  html += `<h2>${esc(erg.titel)}</h2>`;
  if (!erg.vorhaben && letzter) {
    html += `<div class="gewaehlt"><span class="kaestchen" aria-hidden="true">☒</span><span>${esc(letzter.wahl)} <span class="paraphe">${esc(kurzKanzler(s))}</span></span></div>`;
  }
  html += `<div class="text">${absaetze(erg.texte.join('\n\n'))}</div>`;
  html += aenderungenHtml(erg.aenderungen);
  if (erg.historisch && einst.randvermerke) html += `<div class="randvermerk"><b>Historisch:</b> ${esc(erg.historisch)}</div>`;
  html += `<div class="weiter-zeile"><button class="knopf haupt" data-primaer id="k-weiter">Weiter</button><span class="tastenhinweis">Eingabetaste</span></div>`;
  blatt.innerHTML = html;
  szene(blatt, erg.ascii);
  $('k-weiter').onclick = () => { E.weiter(sz, s); zeichne(); };
}

// ---------------------------------------------------------------- Regierungsvorhaben

function zeichneVorhaben(blatt, liste) {
  let html = briefkopf('Kabinettsvorlage', 'Chef des Bundeskanzleramts');
  html += `<h2>Regierungsvorhaben</h2><p class="datum">${esc(E.zeitLang(s.zeit))}</p>`;
  html += `<div class="text"><p>Für ein großes Vorhaben ist in diesem Halbjahr Zeit im Bundestag. Die Kosten gehen zu Lasten des Haushalts (derzeit ${Math.round(s.w.haushalt)} Punkte).</p></div>`;
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
    b.onclick = () => { E.waehleVorhaben(sz, s, b.dataset.id); zeichne(); };
  });
  $('k-keins').onclick = () => { E.waehleVorhaben(sz, s, null); zeichne(); };
}

// ---------------------------------------------------------------- Wahlabend

function zeichneWahl(blatt, e) {
  const vorher = s.wahlen.length > 1 ? s.wahlen[s.wahlen.length - 2] : null;
  const reihen = Object.entries(e.stimmen).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  let html = briefkopf('Wahlabend', 'Bundeswahlleiter');
  html += `<h2>${e.gesamtdeutsch ? 'Die gesamtdeutsche Wahl' : `Die Bundestagswahl ${E.jahrVon(e.zeit)}`}</h2><p class="datum">Vorläufiges amtliches Endergebnis</p>`;
  html += `<pre class="wahl-balken" id="wahl-balken"></pre>`;
  html += `<p class="unterueberschrift">Sitzverteilung (${e.gesamt} Sitze)</p><div class="sitzreihe" id="sitzreihe"></div>`;
  html += `<div class="weiter-zeile"><button class="knopf haupt" data-primaer id="k-weiter">Zur Regierungsbildung</button><span class="tastenhinweis">Eingabetaste</span></div>`;
  blatt.innerHTML = html;
  const name = k => k === 'Kleine' ? e.kleineName : sz.parteien[k].name;
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
    const iv = setInterval(() => { f = Math.min(1, f + 0.05); male(); if (f >= 1) clearInterval(iv); }, 40);
    stoppSzene = () => { clearInterval(iv); f = 1; male(); };
  }
  const sitze = $('sitzreihe');
  const ordnung = ['KPD', 'SPD', 'FDP', 'Union', 'Kleine'];
  for (const p of ordnung) {
    const n = Math.round((e.sitze[p] || 0) / 5);
    for (let i = 0; i < n; i++) {
      const d = document.createElement('span');
      d.style.background = sz.parteien[p].farbe;
      d.title = `${name(p)}: ${e.sitze[p]} Sitze`;
      sitze.appendChild(d);
    }
  }
  $('k-weiter').onclick = () => { stoppSzene(); E.weiter(sz, s); zeichne(); };
}

// ---------------------------------------------------------------- Ende

function diagramm() {
  const v = s.verlauf;
  if (v.length < 2) return '';
  const W = 640, H = 200, L = 34, R = 10, T = 12, B = 26;
  const x = i => L + (W - L - R) * i / (v.length - 1);
  const reihen = [
    { key: 'zustimmung', farbe: 'var(--farbband)', name: 'Union in Umfragen' },
    { key: 'wachstum', farbe: 'var(--gruen)', name: 'Wachstum' },
    { key: 'arbeitslosigkeit', farbe: 'var(--stempel)', name: 'Arbeitslosigkeit' },
  ];
  const max = 60;
  const y = val => T + (H - T - B) * (1 - Math.max(0, val) / max);
  let svg = `<svg class="diagramm" viewBox="0 0 ${W} ${H}" role="img" aria-label="Verlauf von Umfragewerten, Wachstum und Arbeitslosigkeit">`;
  for (const g of [0, 20, 40, 60]) svg += `<line x1="${L}" x2="${W - R}" y1="${y(g)}" y2="${y(g)}" stroke="var(--linie)" stroke-width="1"/><text x="${L - 6}" y="${y(g) + 4}" text-anchor="end">${g}</text>`;
  v.forEach((p, i) => { if (E.halbVon(p.zeit) === 2 && E.jahrVon(p.zeit) % 2 === 1) svg += `<text x="${x(i)}" y="${H - 6}" text-anchor="middle">${E.jahrVon(p.zeit)}</text>`; });
  for (const r of reihen) {
    svg += `<polyline fill="none" stroke="${r.farbe}" stroke-width="2" points="${v.map((p, i) => `${x(i).toFixed(1)},${y(p[r.key]).toFixed(1)}`).join(' ')}"/>`;
  }
  svg += `</svg><p class="legende">${reihen.map(r => `<span style="color:${r.farbe}">━</span> ${r.name} (%)`).join('&nbsp;&nbsp; ')}</p>`;
  return svg;
}

function zeichneEnde(blatt) {
  const ende = sz.enden[s.ende.id];
  let html = briefkopf(s.ende.id === 'abschluss' ? 'Abschlussbericht' : 'Letzte Meldung', 'Bundeskanzleramt');
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
    const info = st ? `${E.zeitText(st.zeit)}, Kanzler ${esc(st.kanzler)}${st.ende ? ' (beendet)' : ''}<small>${st.gespeichert ? new Date(st.gespeichert).toLocaleString('de-DE') : ''}</small>` : '<small>leer</small>';
    const knopf = modus === 'speichern'
      ? `<button class="knopf klein" data-name="${p.name}">Hier speichern</button>`
      : `<button class="knopf klein" data-name="${p.name}" ${st && st.szenario === sz.id ? '' : 'disabled'}>Laden</button>`;
    return `<li><span class="info"><b>${titel}</b><br>${info}</span>${knopf}</li>`;
  }).join('');
  ul.querySelectorAll('[data-name]').forEach(b => {
    b.onclick = async () => {
      if (modus === 'speichern') {
        await Sp.speichere(b.dataset.name, { ...s, gespeichert: Date.now() });
        $('d-plaetze').close();
        meldung('Gespeichert.');
      } else {
        const st = await Sp.lade(b.dataset.name);
        if (!st) return;
        s = st;
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
}

// ---------------------------------------------------------------- Start

document.addEventListener('DOMContentLoaded', () => {
  $('k-neu').onclick = starteNeu;
  $('k-fortsetzen').onclick = async () => { const st = await Sp.lade('auto'); if (st) { s = st; zeigeSpiel(); } };
  $('k-laden').onclick = () => zeigePlaetze('laden');
  $('k-chronik').onclick = zeigeChronik;
  $('k-speichern').onclick = () => zeigePlaetze('speichern');
  $('k-menue').onclick = () => $('d-menue').showModal();
  $('m-speichern').onclick = () => zeigePlaetze('speichern');
  $('m-laden').onclick = () => zeigePlaetze('laden');
  $('m-hilfe').onclick = () => $('d-hilfe').showModal();
  $('m-titel').onclick = () => { $('d-menue').close(); zeigeTitel(); };
  document.querySelectorAll('[data-schliessen]').forEach(b => { b.onclick = () => b.closest('dialog').close(); });
  einstellungenVerbinden();

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
    } else if (e.key === 'Escape') {
      $('d-menue').showModal();
    }
  });

  zeigeTitel();
});
