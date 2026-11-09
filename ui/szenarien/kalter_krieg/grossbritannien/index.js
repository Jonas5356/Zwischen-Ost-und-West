// Land: Großbritannien – spielbar, sonst vom Spiel gesteuert (Regierung = Premierminister, ki.js)
import * as modell from './modell.js';
import aussen from './ereignisse.js';
import teil0 from './ereignisse_1946_1949.js';
import teil1 from './ereignisse_1950_1954.js';
import teil2 from './ereignisse_1955_1958.js';
import teil3 from './ereignisse_1959_1964.js';
import akten from './akten.js';
import vorhaben from './vorhaben.js';
import entscheidungen from './entscheidungen.js';
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
  id: 'grossbritannien',
  name: 'Vereinigtes Königreich',
  kurz: 'Großbritannien',
  hauptstadt: 'London',
  rolle: 'Britische Regierung',
  untertitel: '1946–1964',
  beschreibung: 'Januar 1946. Großbritannien hat den Krieg gewonnen und ist pleite. Im Juli hat das Land Winston Churchill abgewählt; Clement Attlee regiert mit einer riesigen Labour-Mehrheit und will Kohle, Bahnen und Stahl verstaatlichen und einen Gesundheitsdienst für alle schaffen. Brot und Fleisch sind rationiert, das Pfund hängt am Tropf eines amerikanischen Kredits. Noch gebietet London über ein Viertel der Menschheit, doch in Indien, Palästina und Malaya wankt das Empire, und in Europa stehen die Sowjets an der Elbe. Großbritannien muss entscheiden, wo es hingehört: zum Commonwealth, zu Amerika – oder zu Europa.',
  // Spätestens im Juli 1950 muss gewählt werden (fünf Jahre nach 1945); die Regierung kann früher auflösen
  wahlen: [1950.2],
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
  ereignisse: [...aussen, ...teil0, ...teil1, ...teil2, ...teil3, ...akten],
  vorhaben,
  entscheidungen,
  enden: ENDEN,
  oberflaeche,
  regierungen: REGIERUNGEN,
  regimeVon: modell.regimeVon,
  landesspezifisch: modell.LANDESSPEZIFISCH,
};
