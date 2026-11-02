// Automatische Spieler für Tests und Balancing
import * as E from '../ui/engine.js';
import sz0 from '../ui/szenarien/brd1949/index.js';

export const sz = E.bereiteVor(sz0);

/** strategie: 'zufall' | 'historisch' | 'ost' | 'west' */
export function spiele(seed, strategie = 'zufall', log = null) {
  const s = E.neuesSpiel(sz, seed);
  let schritte = 0;
  const gesehen = [];
  const r = () => E.zufall({ get rng() { return s._r ?? (s._r = seed * 7 + 1); }, set rng(v) { s._r = v; } });
  while (!s.ende && schritte < 2000) {
    schritte++;
    const a = E.aktuelles(sz, s);
    if (a.typ === 'lage') { E.lageGesehen(sz, s); continue; }
    if (a.typ === 'ergebnis') {
      for (const x of a.ergebnis.texte) if (typeof x !== 'string' || x.includes('undefined')) throw new Error('Ergebnistext fehlerhaft: ' + a.ergebnis.titel);
    }
    if (a.typ === 'ergebnis' || a.typ === 'wahl') { E.weiter(sz, s); continue; }
    if (a.typ === 'rundenende') { E.weiter(sz, s); continue; }
    if (a.typ === 'vorhaben') {
      const l = a.liste.filter(v => v.leistbar);
      let v = null;
      if (strategie === 'historisch') v = l.find(x => x.historisch) || null;
      else if (l.length && r() < 0.8) v = l[Math.floor(r() * l.length)];
      if (s.w.haushalt < 15) v = l.find(x => x.id === 'konsolidierung') || null;
      E.waehleVorhaben(sz, s, v ? v.id : null);
      continue;
    }
    if (a.typ === 'ereignis') {
      gesehen.push(a.ev.id);
      // Alle Texte einmal auswerten, damit Fehler in Textfunktionen auffallen
      for (const k of ['titel', 'datum', 'text', 'historisch', 'absender']) {
        const v = E.txt(a.ev[k], s);
        if (k === 'text' && (typeof v !== 'string' || v.includes('undefined') || v.includes('NaN'))) throw new Error('Text fehlerhaft: ' + a.ev.id);
      }
      const opts = E.optionen(sz, s, a.ev).filter(o => o.verfuegbar);
      let o;
      if (strategie === 'historisch') o = opts.find(x => x.hist) || opts[0];
      else if (strategie === 'einheit') {
        const einheitsfrage = /^n_|stalin_note|berliner_konferenz/.test(a.ev.id);
        if (einheitsfrage) o = (a.ev.id === 'stalin_note' ? opts[2] : a.ev.id === 'n_abkommen' ? opts[0] : opts.find(x => x.richtung === 'ost')) || opts[0];
        else o = opts.find(x => x.hist) || [...opts].sort((x, y) => ((typeof y.w === 'object' && y.w?.ansehen) || 0) - ((typeof x.w === 'object' && x.w?.ansehen) || 0))[0];
      }
      else if (strategie === 'ost') o = opts.find(x => x.richtung === 'ost') || opts[Math.floor(r() * opts.length)];
      else if (strategie === 'west') o = opts.find(x => x.richtung === 'west') || opts.find(x => x.hist) || opts[0];
      else o = opts[Math.floor(r() * opts.length)];
      if (log) log(`${E.zeitText(s.zeit)} ${E.txt(a.ev.titel, s)} → ${E.txt(o.text, s)}`);
      E.waehle(sz, s, o.index);
      continue;
    }
    throw new Error('Unbekannter Zustand ' + a.typ);
  }
  if (!s.ende) throw new Error('Spiel endet nicht (Seed ' + seed + ')');
  return { s, gesehen };
}
