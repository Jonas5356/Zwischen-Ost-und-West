// Was die Oberfläche über Frankreich wissen muss: Titel, Nationalversammlung, Zeitung, Wahlabend
import { PARTEIEN, LAGER, parteiKurz } from './modell.js';
import { jahrVon } from '../../../engine.js';
import { ENDEN as KRIEGSENDEN } from './kolonialkriege.js';

/** Wie ein Kolonialkrieg ausgegangen ist, kurz fürs Lagebild: „geteilt (1954)“ */
const kriegsausgang = (s, krieg) => (s.f[krieg + '_ende'] ? `${KRIEGSENDEN[krieg][s.f[krieg + '_ende']][0]} (${jahrVon(s.f[krieg + '_ende_zeit'])})` : null);

const zahl = (x, d = 1) => Number(x).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const REIHENFOLGE = ['PCF', 'SFIO', 'RAD', 'MRP', 'UNAB', 'GAUL', 'POUJ'];
const liste = n => (n.length > 1 ? n.slice(0, -1).join(', ') + ' und ' + n[n.length - 1] : n[0]);

export default {
  amt: s => (s.lager === 'militaer' ? 'Komitee der nationalen Erneuerung' : 'Hôtel Matignon'),
  titelKopf: 'Le Président du Conseil',
  szene: 'eiffel',
  dienst: 'Der Quai d’Orsay',
  rolle: 'Du führst die französische Regierung. In der Vierten Republik stürzen Regierungen oft; dann führst du die nächste weiter – wer sie bildet, entscheidest du mit. Jedes Halbjahr legen dir Ministerien und Botschaften Vorgänge vor; am Ende bringst du ein Regierungsvorhaben ein. Indochina und Algerien führen eigene Kriege, und die Armee ist nicht immer loyal.',
  kopf(s) {
    if (s.lager === 'militaer') return { titel: s.regierungschef, text: 'Militärregierung' };
    if (s.republik === 5) return { titel: `Premierminister ${s.regierungschef}`, text: `unter Präsident ${s.praesident}` };
    if (s.lager === 'de_gaulle') return { titel: 'Ministerpräsident Charles de Gaulle', text: 'Regierung des öffentlichen Heils' };
    if (s.f.provisorisch) return { titel: `Regierungschef ${s.regierungschef}`, text: `Provisorische Regierung: ${liste(s.regierung.map(parteiKurz))}` };
    return { titel: `Ministerpräsident ${s.regierungschef}`, text: `${LAGER[s.lager]?.name}: ${liste(s.regierung.map(parteiKurz))}` };
  },
  paraphe: s => s.regierungschef.replace(/^(General|Charles) /, '').split(' ').map(x => x[0]).join('.') + '.',
  kurzinfo: L => (L.regierungschef ? `${L.republik === 5 ? 'Premierminister' : 'Ministerpräsident'} ${L.regierungschef}` : ''),

  zeile(s, k) {
    if (k === 'indochina' && s.f.indochina_beendet) return kriegsausgang(s, 'indochina') || 'beendet';
    if (k === 'algerien' && (s.f.algerien_unabhaengig || (s.f.algerien_frieden && s.f.algerien_integration) || (s.f.algerien_autonomie && !s.f.algerienkrieg))) return kriegsausgang(s, 'algerien') || 'Krieg beendet';
    if (k === 'rueckhalt' && s.lager === 'militaer') return 'aufgelöst';
    return null;
  },
  warnung: (s, k, v) => (k === 'armee' && v <= 25) || (k === 'franc' && v <= 15) || (k === 'indochina' && v <= 15) || (k === 'algerien' && v <= 20 && s.f.algerienkrieg),
  // Was die Standardwerte in Frankreich genau messen und bewirken (ergänzt den Katalog in werte.js)
  erklaerung: s => ({
    zustimmung: {
      was: 'Wie viele Franzosen mit der Regierung zufrieden sind, in Prozent.',
      wirkt: 'Hebt oder senkt das Zielniveau des Rückhalts und entscheidet bei Wahlen über Gewinne und Verluste der Regierungsparteien.',
    },
    rueckhalt: s.republik === 5 ? {
      was: 'Rückhalt der Regierung in der Nationalversammlung, von 0 bis 100.',
      wirkt: 'In der Fünften Republik stützt der Präsident die Regierung; der Rückhalt strebt von selbst gegen 70. Sinkt er auf 0, droht ein Misstrauensvotum.',
    } : {
      was: 'Rückhalt der Regierung in der Nationalversammlung, von 0 bis 100.',
      hebt: 'Ein breites Regierungslager, zufriedene Bürger, Verfassungsreformen, Frieden in den Kolonien.',
      senkt: 'Kolonialkriege mit schlechter Lage, Inflation über 8 %, Entscheidungen, die Regierungsparteien verprellen.',
      wirkt: 'Am Ende jedes Halbjahrs stürzt die Regierung mit der Wahrscheinlichkeit (50 − Rückhalt)/30: unter 50 wird es gefährlich, unter 23 fast sicher; bei 0 stürzt sie sofort. Jedes Halbjahr rückt der Wert halb an ein Zielniveau heran, das von der Lage abhängt.',
    },
    inflation: { hebt: 'Haushaltsdefizite, Lohnerhöhungen, der Algerienkrieg; nach dem Krieg die Knappheit.', wirkt: 'Drückt auf die Umfrage (bis zu gut 11 Punkte); über 8 % senkt sie das Zielniveau des Rückhalts, über 12 % bremst sie das Wachstum und schwächt den Franc.' },
    arbeitslosigkeit: { hebt: 'Schwaches Wachstum; 1962 die Heimkehrer aus Algerien.', wirkt: 'Über 2 % drückt sie auf die Umfrage.' },
    haushalt: { wirkt: 'Vorhaben kosten Haushaltspunkte. Unter 25 treibt er die Inflation, unter 15 bremst er das Wachstum; unter 0 kommt ein Haushaltsnotstand, beim dritten der Staatsbankrott.' },
  }),
  parlament: s => ({
    titel: 'Nationalversammlung',
    reihenfolge: REIHENFOLGE,
    sitze: s.sitze,
    name: p => PARTEIEN[p]?.kurz || p,
    farbe: p => PARTEIEN[p]?.farbe || '#999',
    hinweis: s.lager === 'militaer' ? 'Die Nationalversammlung ist aufgelöst.' : undefined,
  }),

  wahlabend: {
    absender: 'Innenministerium',
    titel: e => (e.verfassunggebend ? `Die Wahl zur Verfassunggebenden Versammlung ${jahrVon(e.zeit)}` : `Die Wahl zur Nationalversammlung ${jahrVon(e.zeit)}`),
    unter: 'Ergebnis in Prozent der Stimmen',
    reihenfolge: REIHENFOLGE,
    name: k => PARTEIEN[k]?.name || k,
    farbe: k => PARTEIEN[k]?.farbe || '#999',
  },

  vorhaben: {
    absender: 'Generalsekretariat der Regierung',
    text: s => `Für ein großes Vorhaben ist in diesem Halbjahr Zeit in der Nationalversammlung. Die Kosten gehen zu Lasten des Haushalts (derzeit ${Math.round(s.w.haushalt)} Punkte).`,
  },

  zeitung: {
    titel: 'Le Messager',
    untertitel: 'Unabhängige Tageszeitung für Politik und Kultur',
    ort: () => 'Paris',
    preis: (s, zeit) => (zeit < 1947 ? '3 Francs' : zeit < 1949 ? '6 Francs' : zeit < 1953 ? '12 Francs' : zeit < 1958 ? '15 Francs' : zeit < 1960 ? '20 Francs' : '0,25 Neue Francs'),
    rubrik: 'Aus der Innenpolitik',
    entscheidet: 'Paris entscheidet',
    erste: (s, M) => ({ titel: 'Frankreich im Januar 1946', unter: `${s.regierungschef} folgt General de Gaulle an der Spitze der Provisorischen Regierung`, text: M.beschreibung }),
    wahl(wahl, bildung) {
      const st = Object.entries(wahl.stimmen).sort((a, b) => b[1] - a[1]);
      return {
        titel: `${wahl.verfassunggebend ? 'Wahl zur Verfassunggebenden Versammlung' : 'Wahl zur Nationalversammlung'}: ${PARTEIEN[st[0][0]]?.kurz} vorn mit ${zahl(st[0][1])} Prozent`,
        unter: st.slice(1, 4).map(([k, v]) => `${PARTEIEN[k]?.kurz} ${zahl(v)} %`).join(', '),
        text: bildung ? bildung.ergebnis : '',
      };
    },
    wirtschaft(v, davor) {
      const pfeil = (a, b) => (b === undefined ? '' : a > b ? ' (gestiegen)' : a < b ? ' (gesunken)' : '');
      return `<p>Wachstum im vergangenen Halbjahr: <b>${zahl(v.wachstum)}&nbsp;%</b> (Jahresrate)</p>
        <p>Inflation: <b>${zahl(v.inflation)}&nbsp;%</b>${pfeil(v.inflation, davor?.inflation)}</p>
        <p>Zufrieden mit der Regierung: <b>${zahl(v.zustimmung)}&nbsp;%</b>${pfeil(v.zustimmung, davor?.zustimmung)}</p>`;
    },
    wahljahr: 'In diesem Halbjahr wird eine neue Nationalversammlung gewählt.',
  },

  diagramm: [
    { key: 'zustimmung', farbe: 'var(--farbband)', name: 'Zufriedenheit mit der Regierung' },
    { key: 'wachstum', farbe: 'var(--gruen)', name: 'Wachstum' },
    { key: 'inflation', farbe: 'var(--stempel)', name: 'Inflation' },
  ],

  hilfe: `<p>Du führst die französische Regierung vom Januar 1946 bis zum Frühjahr 1964. Jede Runde ist ein Halbjahr. Zu Beginn regiert Félix Gouin eine Provisorische Regierung aus Kommunisten, Sozialisten und Volksrepublikanern (der „Tripartisme“). Ihre erste Aufgabe ist eine Verfassung: Wie sie aussieht, entscheidest du mit – auch, ob die neue Republik einen starken Präsidenten bekommt.</p>
<p><strong>Regierungsstürze.</strong> In der Vierten Republik hängt jede Regierung an einer brüchigen Mehrheit. Im Lagebild steht der „Rückhalt in der Nationalversammlung“: Er sinkt von selbst, durch die Kolonialkriege, durch Inflation und durch Entscheidungen, die deine Koalitionspartner verprellen. Je geringer er ist, desto eher stürzt die Regierung; dann bestimmst du mit, wer die nächste bildet, und führst sie weiter. Wer das Land stabilisiert – Reform der Verfassung, Wohlstand, Frieden –, regiert lange. Gewählt wird regulär alle fünf Jahre; eine vorzeitige Auflösung erlaubt die Verfassung erst, wenn binnen 18 Monaten zwei Regierungen gestürzt sind. Mit einer Präsidialverfassung (wenn du sie 1946 durchsetzt) stehen die Regierungen fester, und schon ein Sturz erlaubt die Auflösung.</p>
<p><strong>Die Kolonialkriege.</strong> In Indochina verhandelt Paris 1946 mit Ho Chi Minh; scheitern die Gespräche, kämpft das Expeditionskorps gegen die Viet Minh. Ab 1954 beginnt in Algerien ein Aufstand. Die Lage in beiden Ländern, die Kriegsmüdigkeit zu Hause und die Loyalität der Armee hängen von deinen Entscheidungen ab. Fällt die Loyalität der Armee zu tief, droht ein Putsch – und im schlimmsten Fall ein Bürgerkrieg, der das Spiel beendet.</p>
<p><strong>Das Lagebild.</strong> Rechts siehst du Regierung und Wirtschaft, wie Washington, Moskau, London und Bonn zu Frankreich stehen (hoch heißt immer gut), und landesspezifisch die Kolonialkriege, die Armee, das Atomprogramm, die europäische Integration und die Stabilität des Franc.</p>`,
};
