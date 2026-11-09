// Großbritannien: Entscheidungen, die die Regierung jederzeit treffen kann
import { annaeherungen, konjunkturprogramm } from '../entscheidungen.js';
import { aufloesen, legislaturAlter, wahlAngesetzt, premier } from './modell.js';

export default [
  ...annaeherungen('grossbritannien'),
  konjunkturprogramm(),
  {
    id: 'aufloesung',
    titel: 'Das Unterhaus auflösen',
    text: 'Du bittest den Monarchen, das Unterhaus aufzulösen; gewählt wird am Ende dieses Halbjahrs. Wer gut in den Umfragen liegt, kann sich eine neue, größere Mehrheit holen – wer sich verschätzt, verliert die Regierung. Spätestens fünf Jahre nach der letzten Wahl muss ohnehin gewählt werden.',
    moeglich: s => (wahlAngesetzt(s) ? 'Die Wahl ist schon angesetzt.' : legislaturAlter(s) < 2 ? 'Das Unterhaus ist gerade erst gewählt worden.' : true),
    abklingzeit: 1,
    aktion: s => aufloesen(s),
    ergebnis: s => `${premier(s)} löst das Unterhaus auf. Gewählt wird noch in diesem Halbjahr.`,
    historisch: [1950.1, 1951.2, 1955.1, 1959.2],
  },
  {
    id: 'pfund_abwertung',
    titel: 'Das Pfund abwerten',
    text: 'Das Pfund ist überbewertet; die Ausfuhren lahmen, die Reserven schmelzen. Eine Abwertung würde Vertrauen zurückbringen – aber die Einfuhren verteuern, das Ansehen der Regierung kosten und das Commonwealth, das seine Reserven in Pfund hält, verärgern.',
    wenn: s => s.w.pfund < 30,
    kosten: { ansehen: -3 },
    w: { pfund: 15, inflation: 1.5, impuls: 0.8, haushalt: 2, empire: -2 },
    abklingzeit: 6,
    ergebnis: 'London wertet das Pfund ab. Die Ausfuhren ziehen an, die Einfuhren werden teurer.',
    ki: true,
    dient: { pfund: 0.4, empire: -0.2 },
  },
];
