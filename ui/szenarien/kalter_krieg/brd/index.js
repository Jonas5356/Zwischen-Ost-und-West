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
  titel: 'Bundesrepublik Deutschland',
  untertitel: '1949–1964',
  rolle: 'Bundesregierung',
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
    nachEntscheidung: s => { modell.notiereKanzler(s); s.w.zustimmung = modell.berechneUmfrage(s); },
  },
  dynamisch: modell.dynamisch,
  ereignisse: [...teil1, ...teil2, ...teil3, ...einheit, ...akten],
  vorhaben,
  enden: ENDEN,
  // Anzeigegruppen im Lagebild
  anzeige: [
    { titel: 'Außenpolitik', werte: ['usa', 'frankreich', 'grossbritannien', 'moskau', 'souveraenitaet', 'einheit', 'europa'] },
    { titel: 'Innenpolitik', werte: ['zustimmung', 'ansehen', 'koalition'] },
    { titel: 'Wirtschaft', werte: ['wachstum', 'arbeitslosigkeit', 'haushalt', 'flucht'] },
  ],
};
