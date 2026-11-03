// Land: Frankreich – spielbar, sonst vom Spiel gesteuert (Regierungen nach Lager, ki.js)
import * as modell from './modell.js';
import teil0 from './ereignisse_1946_1949.js';
import teil1 from './ereignisse_1949_1954.js';
import teil2 from './ereignisse_1955_1958.js';
import teil3 from './ereignisse_1959_1964.js';
import akten from './akten.js';
import vorhaben from './vorhaben.js';
import entscheidungen from './entscheidungen.js';
import * as kolonial from './kolonialkriege.js';
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
  untertitel: '1946–1964',
  beschreibung: 'Januar 1946. General de Gaulle ist im Streit mit den Parteien zurückgetreten. Frankreich hat den Krieg gewonnen und fühlt sich doch besiegt: Brot und Kohle sind rationiert, die Preise steigen jeden Monat, in Indochina und Nordafrika wankt das Empire. Kommunisten, Sozialisten und Volksrepublikaner regieren gemeinsam und sollen dem Land eine neue Verfassung geben. Im Rheinland, an der Saar und in Berlin will Paris sicherstellen, dass Deutschland nie wieder angreifen kann – doch die Welt zerfällt gerade in zwei Lager, und Frankreich muss seinen Platz zwischen ihnen finden.',
  // Juni 1946: zweite Verfassunggebende Versammlung (weitere Wahlen setzt das Modell)
  wahlen: [1946.1],
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
  ereignisse: [...teil0, ...teil1, ...teil2, ...teil3, ...kolonial.ereignisse, ...akten],
  vorhaben,
  entscheidungen: [...entscheidungen, ...kolonial.entscheidungen],
  enden: ENDEN,
  oberflaeche,
  regierungen: REGIERUNGEN,
  regimeVon: modell.regimeVon,
  // Landesspezifischer Block im Lagebild (Reihenfolge)
  landesspezifisch: ['indochina', 'algerien', 'armee', 'atom', 'europa', 'franc'],
};
