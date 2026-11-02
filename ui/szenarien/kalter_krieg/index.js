// Die Welt des Kalten Kriegs, 1949–1964: Länder, Startbeziehungen, Weltereignisse
import brd from './brd/index.js';
import usa from './usa.js';
import su from './su.js';
import frankreich from './frankreich.js';
import grossbritannien from './grossbritannien.js';
import weltereignisse from './weltereignisse.js';

export default {
  id: 'kalter_krieg',
  titel: 'Zwischen Ost und West',
  start: 1949.2,
  ende: 1964.1,
  // Reihenfolge = Reihenfolge der Entscheidungen bei gleichem Monat
  laender: { usa, su, grossbritannien, frankreich, brd },
  spielbar: ['brd'],
  // Wie Land A Land B sieht (0 = feindlich, 100 = engste Partnerschaft); fehlende Paare: 50
  startBeziehungen: {
    usa: { brd: 55 },
    frankreich: { brd: 30 },
    grossbritannien: { brd: 40 },
    su: { brd: 50 },
  },
  weltereignisse,
};
