// Land: Bundesrepublik Deutschland (spielbar)
import * as modell from './modell.js';
import teil1 from './ereignisse_1949_1953.js';
import teil2 from './ereignisse_1954_1958.js';
import teil3 from './ereignisse_1959_1964.js';
import einheit from './einheit.js';
import akten from './akten.js';
import vorhaben from './vorhaben.js';
import zeitgeschehen from './zeitgeschehen.js';
import { ENDEN } from './enden.js';
import oberflaeche from './oberflaeche.js';
import { REGIERUNGEN, regimeVon, dientAus } from './regierungen.js';
import { zeitIndex } from '../../../engine.js';

function lagebericht(s) {
  const meldungen = zeitgeschehen
    .filter(m => zeitIndex(m.zeit) === zeitIndex(s.zeit) && (!m.wenn || m.wenn(s)))
    .map(m => (typeof m.text === 'function' ? m.text(s) : m.text));
  // Notizen aus dem Modell (z. B. Rücktritt eines Kanzlers) erscheinen in der nächsten Ausgabe
  if (s.notizen?.length) { meldungen.unshift(...s.notizen); s.notizen = []; }
  return { meldungen };
}

export default {
  id: 'brd',
  name: 'Bundesrepublik Deutschland',
  kurz: 'Bundesrepublik',
  hauptstadt: 'Bonn',
  titel: 'Bundesrepublik Deutschland',
  untertitel: '1949–1964',
  rolle: 'Bundesregierung',
  // Die Bundesrepublik entsteht im Herbst 1949 – wenn die Westmächte einen Weststaat wollen,
  // Paris (wo nötig) zustimmt und Berlin nicht aufgegeben wurde. Wird sie gespielt, entsteht sie immer.
  gruendung: {
    zeit: 1949.2,
    wenn: welt => {
      const f = welt.weltflags;
      if (f.weststaat_usa === 'vier' || f.berlin_aufgegeben) return false;
      if (f.weststaat_usa === 'nur_mit_paris' && f.weststaat_paris !== 'ja') return false;
      return true;
    },
    aktion: welt => {
      const b = welt.beziehungen;
      const plus = (von, zu, d) => { if (b[von]?.[zu] !== undefined) b[von][zu] = Math.max(0, Math.min(100, b[von][zu] + d)); };
      // Ohne Frankreich gegründet: Die französische Zone bleibt außen vor (Fiktion)
      if (welt.weltflags.weststaat_paris === 'nein') { welt.weltflags.ohne_franzoesische_zone = true; plus('brd', 'frankreich', -15); plus('frankreich', 'brd', -10); }
      if (welt.laender.frankreich?.f?.demontagen_hart) plus('brd', 'frankreich', -6);
      if (welt.weltflags.berlin_massnahme === 'luftbruecke') plus('brd', 'usa', 5);
    },
  },
  // Wird die Bundesrepublik vom Spiel gesteuert, regiert sie nach Zielen (ki.js)
  regierungen: REGIERUNGEN,
  regimeVon,
  dientAus,
  beschreibung: 'Herbst 1949. Konrad Adenauer ist mit einer Stimme Mehrheit zum ersten Bundeskanzler gewählt worden. Das Land ist besetzt, geteilt und zerstört; zwölf Millionen Vertriebene suchen ein Zuhause. Zwischen Washington, Paris, London und Moskau muss die junge Republik ihren Weg finden – und wer regiert, muss Wahlen gewinnen.',
  wahlen: [1953.2, 1957.2, 1961.2],
  werte: modell.WERTE,
  parteien: modell.PARTEIEN,
  startzustand: modell.startzustand,
  modell: {
    rundenende: modell.rundenende,
    wahl: modell.wahl,
    pruefeEnde: modell.pruefeEnde,
    pruefeKrise: modell.pruefeKrise,
    nachOption: modell.nachOption,
    aktenProRunde: modell.aktenProRunde,
    lagebericht,
    kleineName: modell.kleineName,
    aufklaerung: modell.aufklaerung,
    nachEntscheidung: s => { modell.notiereKanzler(s); s.w.zustimmung = modell.berechneUmfrage(s); },
  },
  dynamisch: modell.dynamisch,
  ereignisse: [...teil1, ...teil2, ...teil3, ...einheit, ...akten],
  vorhaben,
  enden: ENDEN,
  oberflaeche,
  // Anzeigegruppen im Lagebild
  anzeige: [
    { titel: 'Außenpolitik', werte: ['usa', 'frankreich', 'grossbritannien', 'moskau', 'souveraenitaet', 'einheit', 'europa'] },
    { titel: 'Innenpolitik', werte: ['zustimmung', 'ansehen', 'koalition'] },
    { titel: 'Wirtschaft', werte: ['wachstum', 'arbeitslosigkeit', 'haushalt', 'flucht'] },
  ],
};
