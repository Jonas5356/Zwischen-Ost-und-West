// Großbritannien: Entscheidungen, die die Regierung jederzeit treffen kann
import { annaeherungen, konjunkturprogramm } from '../entscheidungen.js';

export default [
  ...annaeherungen('grossbritannien'),
  konjunkturprogramm(),
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
