// Land: Frankreich – spielbar, sonst vom Spiel gesteuert (Regierungen nach Lager, ki.js)
import * as modell from './modell.js';
import teil1 from './ereignisse_1949_1954.js';
import teil2 from './ereignisse_1955_1958.js';
import teil3 from './ereignisse_1959_1964.js';
import akten from './akten.js';
import vorhaben from './vorhaben.js';
import zeitgeschehen from './zeitgeschehen.js';
import { ENDEN } from './enden.js';
import oberflaeche from './oberflaeche.js';
import { REGIERUNGEN } from './regierungen.js';
import { zeitIndex } from '../../../engine.js';

function lagebericht(s) {
  const meldungen = zeitgeschehen
    .filter(m => zeitIndex(m.zeit) === zeitIndex(s.zeit) && (!m.wenn || m.wenn(s)))
    .map(m => (typeof m.text === 'function' ? m.text(s) : m.text));
  if (s.notizen?.length) { meldungen.unshift(...s.notizen); s.notizen = []; }
  return { meldungen };
}

export default {
  id: 'frankreich',
  name: 'Frankreich',
  kurz: 'Frankreich',
  hauptstadt: 'Paris',
  rolle: 'Französische Regierung',
  untertitel: '1949–1964',
  beschreibung: 'Herbst 1949. Frankreich hat den Krieg gewonnen und fühlt sich doch besiegt. Seine Regierungen halten selten länger als ein paar Monate, in Indochina führt es einen Kolonialkrieg, den es nicht gewinnen kann, die Kommunisten sind die stärkste Partei. Washington verlangt, dass Paris die Deutschen wieder aufrüsten lässt. Zwischen Grandeur und Abhängigkeit, Empire und Europa muss die Republik ihren Platz finden.',
  wahlen: [1951.1, 1956.1],
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
    aufklaerung: modell.aufklaerung,
    lagebericht,
    nachEntscheidung: s => { modell.notiereChef(s); s.w.zustimmung = modell.berechneUmfrage(s); },
  },
  dynamisch: modell.dynamisch,
  ereignisse: [...teil1, ...teil2, ...teil3, ...akten],
  vorhaben,
  enden: ENDEN,
  oberflaeche,
  regierungen: REGIERUNGEN,
  regimeVon: modell.regimeVon,
  anzeige: [
    { titel: 'Außenpolitik', werte: ['usa', 'brd', 'grossbritannien', 'moskau', 'rang', 'europa', 'atom'] },
    { titel: 'Kolonien und Armee', werte: ['indochina', 'algerien', 'armee'] },
    { titel: 'Innenpolitik', werte: ['zustimmung', 'ansehen', 'mehrheit'] },
    { titel: 'Wirtschaft', werte: ['wachstum', 'inflation', 'haushalt', 'franc'] },
  ],
};
