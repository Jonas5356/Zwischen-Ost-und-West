// Die Welt des Kalten Kriegs, 1946–1964: Länder, Startbeziehungen, Weltereignisse
import brd from './brd/index.js';
import usa from './usa.js';
import su from './su.js';
import frankreich from './frankreich/index.js';
import grossbritannien from './grossbritannien.js';
import weltereignisse from './weltereignisse.js';
import { BLOECKE, STANDARD, BEZIEHUNGSREIHE } from './werte.js';

export default {
  id: 'kalter_krieg',
  titel: 'Zwischen Ost und West',
  beschreibung: 'Europa im Winter 1946. Der Krieg ist seit einem halben Jahr vorbei, Deutschland ist besetzt und in vier Zonen geteilt, Frankreich erschöpft, sein Empire in Aufruhr. Noch sind Washington und Moskau Verbündete – doch über Iran, Deutschland und Osteuropa zerbricht die Allianz der Sieger. Ob und wie aus den Trümmern ein westdeutscher Staat entsteht, ist offen.\n\nDu führst eine Regierung durch die Jahre des Kalten Kriegs, Halbjahr für Halbjahr – Frankreich ab 1946, die Bundesrepublik ab ihrer Gründung 1949. Die anderen Länder verfolgen ihre eigenen Ziele.',
  szene: 'bundeshaus',
  start: 1946.1,
  ende: 1964.1,
  // Reihenfolge = Reihenfolge der Entscheidungen bei gleichem Monat
  laender: { usa, su, grossbritannien, frankreich, brd },
  spielbar: ['brd', 'frankreich'],
  // Wie Land A Land B sieht (0 = feindlich, 100 = engste Partnerschaft); fehlende Paare: 50
  startBeziehungen: {
    // 1946: Die Sieger sind noch Verbündete; die Werte zur Bundesrepublik gelten ab ihrer Gründung
    usa: { brd: 55, su: 40, frankreich: 55 },
    frankreich: { brd: 30 },
    brd: { frankreich: 40 },
    grossbritannien: { brd: 40, frankreich: 60 },
    su: { brd: 50, usa: 40, frankreich: 50 },
  },
  weltereignisse,
  // Lagebild: in jedem Land dieselben Blöcke; Standardwerte und Beziehungen in fester Reihenfolge
  bloecke: BLOECKE,
  werteReihe: [...Object.keys(STANDARD), ...BEZIEHUNGSREIHE],
  // Enden, die jedes Land auslösen kann – auch ein vom Spiel gesteuertes
  weltenden: ['krieg'],
};
