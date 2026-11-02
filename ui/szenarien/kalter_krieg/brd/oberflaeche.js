// Was die Oberfläche über die Bundesrepublik wissen muss: Titel, Bundestag, Zeitung, Wahlabend
import { PARTEIEN, kleineName } from './modell.js';
import { zeitIndex } from '../../../engine.js';

const parteiName = (k, s) => (k === 'Kleine' ? kleineName(s) : PARTEIEN[k]?.name || k);
const liste = n => (n.length > 1 ? n.slice(0, -1).join(', ') + ' und ' + n[n.length - 1] : n[0]);
const zahl = (x, d = 1) => Number(x).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });

/** Kurzname der Kanzlerpartei, die zum Halbjahr `zeit` (vor einer Regierungsbildung darin) regierte */
function kanzlerparteiZu(s, zeit) {
  const l = s.kanzlerliste || [];
  const k = [...l].reverse().find(x => zeitIndex(x.ab) < zeitIndex(zeit)) || l[0];
  return k?.partei === 'SPD' ? 'SPD' : 'Union';
}

export default {
  amt: 'Bundeskanzleramt',
  titelKopf: 'Der Bundeskanzler',
  szene: 'bundeshaus',
  rolle: 'Du führst die Bundesregierung. Zu Beginn stellt die Union den Kanzler; verliert sie ihre Mehrheit, regierst du mit der neuen Regierung weiter. Jedes Halbjahr legen dir Ministerien und Botschaften Vorgänge zur Entscheidung vor; am Ende bringst du ein Regierungsvorhaben ein. 1953, 1957 und 1961 wird gewählt.',
  kopf: s => ({ titel: `Bundeskanzler ${s.kanzler}`, text: `Regierung aus ${liste(s.regierung.map(p => parteiName(p, s)))}` }),
  paraphe: s => s.kanzler.replace(/^von /, '').charAt(0) + '.',
  kurzinfo: L => (L.kanzler ? `Kanzler ${L.kanzler}` : ''),

  // Lagebild
  skala: { zustimmung: [10, 60], wachstum: [-2, 12], arbeitslosigkeit: [0, 15], ansehen: [-30, 30], haushalt: [0, 100] },
  zeile(s, k) {
    if (k === 'flucht' && s.f.vereinigt) return 'aus';
    if (k === 'einheit' && s.f.vereinigt) return 'vollzogen';
    return null;
  },
  warnung: (s, k, v) => (k === 'moskau' && v <= 15) || (k === 'haushalt' && v <= 10) || (k === 'koalition' && v <= 15 && s.regierung.length > 1)
    || (['usa', 'frankreich', 'grossbritannien'].includes(k) && v < 20 && !s.f.vereinigt && s.w.souveraenitaet < 50),
  wertTitel: (s, k) => (k === 'zustimmung' ? `${s.kanzlerpartei === 'SPD' ? 'SPD' : 'Union'} in Umfragen` : null),
  parlament: s => ({
    titel: 'Bundestag',
    reihenfolge: ['KPD', 'SPD', 'FDP', 'Union', 'Kleine', 'Sonstige'],
    sitze: s.sitze,
    name: p => parteiName(p, s),
    farbe: p => PARTEIEN[p]?.farbe || '#999',
  }),

  // Wahlabend
  wahlabend: {
    absender: 'Bundeswahlleiter',
    titel: e => (e.gesamtdeutsch ? 'Die gesamtdeutsche Wahl' : `Die Bundestagswahl ${Math.floor(e.zeit)}`),
    reihenfolge: ['KPD', 'SPD', 'FDP', 'Union', 'Kleine'],
    name: (k, e) => (k === 'Kleine' ? e.kleineName : PARTEIEN[k]?.name || k),
    farbe: k => PARTEIEN[k]?.farbe || '#999',
  },

  vorhaben: {
    absender: 'Chef des Bundeskanzleramts',
    text: s => `Für ein großes Vorhaben ist in diesem Halbjahr Zeit im Bundestag. Die Kosten gehen zu Lasten des Haushalts (derzeit ${Math.round(s.w.haushalt)} Punkte).`,
  },

  zeitung: {
    titel: 'Die Depesche',
    untertitel: 'Unabhängige Zeitung für Politik, Wirtschaft und Kultur',
    ort: s => (s.f.hauptstadt_berlin ? 'Berlin' : 'Bonn'),
    preis: () => 'Preis 20 Pfennig',
    rubrik: 'Aus der Bundespolitik',
    entscheidet: 'Bonn entscheidet',
    erste: (s, M) => ({ titel: 'Die neue Republik', unter: `Bundeskanzler ${s.kanzler} tritt sein Amt an`, text: M.beschreibung }),
    wahl(wahl, bildung) {
      const st = wahl.stimmen;
      const [erste, zweite] = st.SPD > st.Union ? ['SPD', 'Union'] : ['Union', 'SPD'];
      return {
        titel: `${wahl.gesamtdeutsch ? 'Gesamtdeutsche Wahl' : 'Bundestagswahl'}: ${erste} ${zahl(st[erste])} Prozent`,
        unter: `${zweite} ${zahl(st[zweite])} %, FDP ${zahl(st.FDP)} %`,
        text: bildung ? bildung.ergebnis : '',
      };
    },
    wirtschaft(v, davor, s, vor) {
      const pfeil = (a, b) => (b === undefined ? '' : a > b ? ' (gestiegen)' : a < b ? ' (gesunken)' : '');
      return `<p>Wachstum im vergangenen Halbjahr: <b>${zahl(v.wachstum)}&nbsp;%</b> (Jahresrate)</p>
        <p>Arbeitslosenquote: <b>${zahl(v.arbeitslosigkeit)}&nbsp;%</b>${pfeil(v.arbeitslosigkeit, davor?.arbeitslosigkeit)}</p>
        <p>${kanzlerparteiZu(s, vor) === 'SPD' ? 'Die SPD' : 'Die Union'} in Umfragen (Kanzlerpartei): <b>${zahl(v.zustimmung)}&nbsp;%</b>${pfeil(v.zustimmung, davor?.zustimmung)}</p>`;
    },
    wahljahr: 'In diesem Halbjahr wählen die Bürger einen neuen Bundestag. Die Parteien rüsten zum Wahlkampf.',
  },

  diagramm: [
    { key: 'zustimmung', farbe: 'var(--farbband)', name: 'Kanzlerpartei in Umfragen' },
    { key: 'wachstum', farbe: 'var(--gruen)', name: 'Wachstum' },
    { key: 'arbeitslosigkeit', farbe: 'var(--stempel)', name: 'Arbeitslosigkeit' },
  ],

  hilfe: `<p>Du führst die Bundesregierung durch die ersten fünfzehn Jahre der Bundesrepublik, vom Herbst 1949 bis zum Frühjahr 1964. Jede Runde ist ein Halbjahr. Zu Beginn stellt die Union mit Konrad Adenauer den Kanzler.</p>
<p>In jedem Halbjahr landen die historischen Ereignisse als Vorlagen auf deinem Schreibtisch, dazu Briefe von Ministern, Verbänden und Bürgern. Am Ende des Halbjahrs bringst du ein Regierungsvorhaben in den Bundestag ein. Deine Entscheidungen verändern das Lagebild – und sie können die Geschichte in eine andere Richtung lenken: Wer die Stalin-Note ernst nimmt, erlebt vielleicht keinen Mauerbau.</p>
<p><strong>Wahlen und Regierungswechsel.</strong> 1953, 1957 und 1961 wird gewählt. Kann die Kanzlerpartei eine Mehrheit bilden, wählst du die Koalition. Verliert sie die Mehrheit oder zerbricht die Koalition, bildet sich eine neue Regierung – etwa unter einem SPD-Kanzler – und du führst sie weiter. Die Umfragewerte im Lagebild gelten immer der Partei, die den Kanzler stellt. Vorbei ist das Spiel nur bei einem Krieg mit Moskau, einem Staatsbankrott oder wenn die Westmächte das Besatzungsrecht wieder in Kraft setzen.</p>
<p><strong>Das Lagebild.</strong> Rechts siehst du, wie Washington, Paris, London und Moskau zur Bundesrepublik stehen (hoch heißt immer gut, bei 0 droht bei Moskau der Krieg), wie souverän die Bundesrepublik ist und wie realistisch die Einheit bleibt. Darunter Umfragen, Koalitionsklima und Wirtschaftsdaten. Beziehungen kehren langsam zur Mitte zurück, wenn man sie nicht pflegt; das Ansehen des Kanzlers verblasst mit der Zeit.</p>`,
};
