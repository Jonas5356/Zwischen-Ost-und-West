// Die Welt des Kalten Kriegs, 1949–1964: Länder, Startbeziehungen, Weltereignisse
import brd from './brd/index.js';
import usa from './usa.js';
import su from './su.js';
import frankreich from './frankreich/index.js';
import grossbritannien from './grossbritannien.js';
import weltereignisse from './weltereignisse.js';

export default {
  id: 'kalter_krieg',
  titel: 'Zwischen Ost und West',
  beschreibung: 'Europa im Herbst 1949. Vier Jahre nach dem Krieg ist der Kontinent geteilt, Deutschland besetzt und zerrissen, Frankreich erschöpft und in Indochina in einen Kolonialkrieg verstrickt. Washington und Moskau ringen um Europa; dazwischen müssen Bonn und Paris ihren Weg finden – gegeneinander oder miteinander.\n\nDu führst eine Regierung durch fünfzehn Jahre, Halbjahr für Halbjahr. Die anderen Länder verfolgen ihre eigenen Ziele.',
  szene: 'bundeshaus',
  start: 1949.2,
  ende: 1964.1,
  // Reihenfolge = Reihenfolge der Entscheidungen bei gleichem Monat
  laender: { usa, su, grossbritannien, frankreich, brd },
  spielbar: ['brd', 'frankreich'],
  // Wie Land A Land B sieht (0 = feindlich, 100 = engste Partnerschaft); fehlende Paare: 50
  startBeziehungen: {
    usa: { brd: 55, su: 25, frankreich: 60 },
    frankreich: { brd: 30 },
    brd: { frankreich: 40 },
    grossbritannien: { brd: 40, frankreich: 60 },
    su: { brd: 50, usa: 25, frankreich: 35 },
  },
  weltereignisse,
  // Enden, die jedes Land auslösen kann – auch ein vom Spiel gesteuertes
  weltenden: ['krieg'],
};
