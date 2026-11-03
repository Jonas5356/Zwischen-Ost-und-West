// Land: Großbritannien – vorerst vom Spiel gesteuert (Regierungen und Wahlen in regierungen.js, ki.js).
// Aufgebaut wie die spielbaren Länder (Werte aus dem gemeinsamen Katalog, Entscheidungen),
// damit es später spielbar werden kann.
import * as modell from './modell.js';
import ereignisse from './ereignisse.js';
import entscheidungen from './entscheidungen.js';
import { REGIERUNGEN, WECHSEL } from './regierungen.js';

export default {
  id: 'grossbritannien',
  name: 'Vereinigtes Königreich',
  kurz: 'Großbritannien',
  hauptstadt: 'London',
  spielbar: false,
  werte: modell.WERTE,
  landesspezifisch: modell.LANDESSPEZIFISCH,
  startzustand: modell.startzustand,
  startRegime: 'attlee',
  regierungen: REGIERUNGEN,
  wechsel: WECHSEL,
  ereignisse,
  entscheidungen,
  modell: { rundenende: modell.rundenende, aufklaerung: modell.aufklaerung },
};
