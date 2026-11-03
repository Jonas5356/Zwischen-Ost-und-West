// Bundesrepublik: Entscheidungen, die die Regierung jederzeit treffen kann
import { annaeherungen, konjunkturprogramm } from '../entscheidungen.js';

export default [
  ...annaeherungen('brd', { usa: 'west', moskau: 'ost', grossbritannien: 'west', frankreich: 'west' }),
  konjunkturprogramm(),
  {
    id: 'kredit_usa',
    titel: 'Washington um Kredite bitten',
    text: 'Der Wiederaufbau verschlingt mehr, als der Haushalt hergibt. Die Bundesregierung könnte in Washington um zusätzliche Kredite aus dem Marshallplan bitten. Ob die Amerikaner zustimmen, hängt davon ab, was sie von Bonn halten – und was sie mit Westdeutschland vorhaben.',
    ab: 1949.2, bis: 1955.2,
    wenn: s => !s.f.vereinigt && !s.f.neutral,
    kosten: { ansehen: -1 },
    abklingzeit: 4,
    an: { land: 'usa', id: 'usa_kredit_brd' },
    antworten: {
      ja: { w: { haushalt: 7, impuls: 0.6 }, ergebnis: 'Washington gewährt der Bundesrepublik zusätzliche Kredite.' },
      nein: { w: { usa: -1 }, ergebnis: 'Washington lehnt weitere Kredite für die Bundesrepublik ab.' },
    },
    ki: true,
    dient: { westbindung: 0.2 },
  },
];
