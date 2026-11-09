// Was die Oberfläche über Großbritannien wissen muss: Titel, Unterhaus, Zeitung, Wahlabend
import { PARTEIEN, REIHENFOLGE, premier, mehrheit, labour, spaetestens, wahlAngesetzt } from './modell.js';
import { REGIERUNGEN } from './regierungen.js';
import { jahrVon, zeitText } from '../../../engine.js';

const zahl = (x, d = 1) => Number(x).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const mehrheitText = s => {
  const m = mehrheit(s);
  if (s.koalition) return `mit den Liberalen, Mehrheit ${m}`;
  return m > 0 ? `Mehrheit ${m} Sitze` : `Minderheitsregierung (${-m} Sitze fehlen)`;
};

export default {
  amt: '10 Downing Street',
  titelKopf: 'The Prime Minister',
  szene: 'bigben',
  dienst: 'Das Foreign Office',
  rolle: 'Du führst die britische Regierung. Zu Beginn regiert Labour unter Clement Attlee mit großer Mehrheit; verliert die Regierungspartei eine Wahl, führst du die neue Regierung weiter. Wann gewählt wird, entscheidest du – spätestens nach fünf Jahren. Jedes Halbjahr legen dir Ministerien, Botschaften und Gouverneure Vorgänge vor; am Ende bringst du ein Regierungsvorhaben ein. Das Empire zerfällt, das Pfund ist schwach, und Washington ist ein schwieriger Freund.',
  kopf: s => ({
    titel: `Premierminister ${premier(s)}`,
    text: `${s.koalition ? 'Bündnis aus ' + (labour(s) ? 'Labour' : 'Konservativen') + ' und Liberalen' : labour(s) ? 'Labour-Regierung' : 'Konservative Regierung'}, ${mehrheitText(s)}`,
  }),
  paraphe: s => REGIERUNGEN[s.premierId].name.split(/[ -]/).filter(x => /^[A-Z]/.test(x)).map(x => x[0]).join('.') + '.',
  kurzinfo: L => (L.premierId ? `Premierminister ${REGIERUNGEN[L.premierId].name}` : ''),

  zeile: () => null,
  warnung: () => false,
  // Was die Standardwerte in Großbritannien genau messen und bewirken (ergänzt den Katalog in werte.js)
  erklaerung: s => ({
    zustimmung: {
      was: `Wie viele Briten mit der ${labour(s) ? 'Labour-Regierung' : 'konservativen Regierung'} zufrieden sind, in Prozent.`,
      wirkt: 'Entscheidet bei Unterhauswahlen, wie viele Stimmen die Regierungspartei bekommt: Jeder Punkt mehr oder weniger verschiebt ihren Anteil an den Stimmen beider großen Parteien um etwa ein Viertel Prozentpunkt – und das Kubikgesetz macht aus kleinen Verschiebungen große Unterschiede bei den Sitzen. Hebt auch den Rückhalt in der Fraktion.',
    },
    rueckhalt: {
      was: 'Wie geschlossen die Regierungsfraktion hinter dem Premierminister steht, von 0 bis 100.',
      hebt: 'Eine große Mehrheit im Unterhaus, gute Umfragen, ein neuer Premierminister.',
      senkt: 'Eine knappe Mehrheit, schlechte Umfragen, eine gespaltene Partei, Entscheidungen gegen die Überzeugungen der Fraktion.',
      wirkt: 'Unter 18 rebellieren die Hinterbänkler; bei 0 verliert die Regierung ein Misstrauensvotum und muss das Unterhaus auflösen oder den Premierminister wechseln.',
    },
    inflation: { hebt: 'Lohnabschlüsse, Haushaltsdefizite, Abwertungen, schlechte Beziehungen zu den Gewerkschaften; 1951 die Rohstoffpreise im Koreakrieg.', wirkt: 'Über 3,5 % drückt sie auf die Umfrage, sie schwächt das Pfund und verärgert die Gewerkschaften.' },
    arbeitslosigkeit: { hebt: 'Schwaches Wachstum, Sparprogramme.', wirkt: 'Über 2 % drückt sie auf die Umfrage. Unter 1,5 % werden die Gewerkschaften fordernder.' },
    haushalt: { wirkt: 'Vorhaben kosten Haushaltspunkte. Unter 15 treibt er die Inflation, unter 10 bremst er das Wachstum; unter 0 schlägt das Schatzamt Alarm.' },
  }),
  parlament: s => ({
    titel: 'Unterhaus',
    reihenfolge: REIHENFOLGE,
    sitze: s.sitze,
    name: p => PARTEIEN[p]?.kurz || p,
    farbe: p => PARTEIEN[p]?.farbe || '#999',
    hinweis: wahlAngesetzt(s) ? 'Gewählt wird am Ende dieses Halbjahrs.' : `Nächste Wahl spätestens ${zeitText(spaetestens(s))}`,
  }),

  wahlabend: {
    absender: 'BBC, Wahlnacht',
    titel: e => `Die Unterhauswahl ${jahrVon(e.zeit)}`,
    unter: 'Ergebnis in Prozent der Stimmen',
    reihenfolge: REIHENFOLGE,
    name: k => PARTEIEN[k]?.name || k,
    farbe: k => PARTEIEN[k]?.farbe || '#999',
  },

  vorhaben: {
    absender: 'Kabinettssekretariat',
    text: s => `Im Unterhaus ist in diesem Halbjahr Zeit für ein großes Gesetz. Die Kosten gehen zu Lasten des Haushalts (derzeit ${Math.round(s.w.haushalt)} Punkte).`,
  },

  zeitung: {
    titel: 'The London Courier',
    untertitel: 'Eine unabhängige Zeitung für Politik, Handel und Kultur',
    ort: () => 'London',
    preis: (s, zeit) => (zeit < 1951 ? '1 Penny' : zeit < 1956 ? '1½ Pence' : zeit < 1960 ? '2 Pence' : '3 Pence'),
    rubrik: 'Aus Westminster',
    entscheidet: 'Downing Street entscheidet',
    erste: (s, M) => ({ titel: 'Großbritannien im Januar 1946', unter: 'Premierminister Clement Attlee regiert mit der größten Mehrheit, die Labour je hatte', text: M.beschreibung }),
    wahl(wahl, bildung) {
      const st = wahl.stimmen;
      const s = wahl.sitze;
      const sieger = s.CON > s.LAB ? 'CON' : 'LAB';
      const m = 2 * s[sieger] - wahl.gesamt;
      return {
        titel: m > 0 ? `Unterhauswahl: ${PARTEIEN[sieger].name} ${wahl.regierung === sieger ? 'behält' : 'gewinnt'} die Mehrheit` : 'Unterhauswahl: Keine Partei hat die Mehrheit',
        unter: `${['CON', 'LAB', 'LIB'].map(k => `${PARTEIEN[k].kurz} ${zahl(st[k])} % (${s[k]} Sitze)`).join(', ')}`,
        text: bildung ? bildung.ergebnis : '',
      };
    },
    wirtschaft(v, davor) {
      const pfeil = (a, b) => (b === undefined ? '' : a > b ? ' (gestiegen)' : a < b ? ' (gesunken)' : '');
      return `<p>Wachstum im vergangenen Halbjahr: <b>${zahl(v.wachstum)}&nbsp;%</b> (Jahresrate)</p>
        <p>Inflation: <b>${zahl(v.inflation)}&nbsp;%</b>${pfeil(v.inflation, davor?.inflation)}</p>
        <p>Arbeitslose: <b>${zahl(v.arbeitslosigkeit)}&nbsp;%</b></p>
        <p>Zufrieden mit der Regierung: <b>${zahl(v.zustimmung)}&nbsp;%</b>${pfeil(v.zustimmung, davor?.zustimmung)}</p>`;
    },
    wahljahr: 'Das Unterhaus ist aufgelöst; am Ende des Halbjahrs wird gewählt.',
  },

  diagramm: [
    { key: 'zustimmung', farbe: 'var(--farbband)', name: 'Zufriedenheit mit der Regierung' },
    { key: 'wachstum', farbe: 'var(--gruen)', name: 'Wachstum' },
    { key: 'inflation', farbe: 'var(--stempel)', name: 'Inflation' },
  ],

  hilfe: `<p>Du führst die britische Regierung vom Januar 1946 bis zum Frühjahr 1964. Jede Runde ist ein Halbjahr. Zu Beginn regiert Labour unter Clement Attlee, gewählt im Juli 1945 mit 146 Sitzen Mehrheit. Gespielt wird die Regierung, nicht eine Partei: Gewinnen die Konservativen eine Wahl, führst du ihre Regierung weiter.</p>
<p><strong>Wahlen.</strong> Das Unterhaus wird spätestens fünf Jahre nach der letzten Wahl neu gewählt. Früher wählen lässt du über die Entscheidung „Das Unterhaus auflösen“: Gewählt wird dann am Ende des Halbjahrs. Wer gut in den Umfragen liegt, wählt gern früh; wer knapp regiert, sucht eine sichere Mehrheit. Gewählt wird in Wahlkreisen mit relativer Mehrheit. Die Sitze folgen ungefähr dem „Kubikgesetz“: Das Verhältnis der Sitze der beiden großen Parteien ist etwa die dritte Potenz des Verhältnisses ihrer Stimmen. Ein Vorsprung von 52 zu 48 Prozent wird so zu etwa 56 zu 44 Prozent der Sitze. Bis zur Neueinteilung der Wahlkreise von 1955 sind die Konservativen dabei leicht im Vorteil, weil Labour viele Stimmen in sicheren Hochburgen „verschwendet“.</p>
<p><strong>Die Fraktion.</strong> Wie fest die eigenen Abgeordneten hinter dir stehen, zeigt der Rückhalt. Bei knapper Mehrheit und schlechten Umfragen rebellieren die Hinterbänkler; verliert die Regierung ein Misstrauensvotum, musst du auflösen oder den Premierminister wechseln. Wer Premierminister wird, wenn einer geht – nach Churchill, nach Eden, nach Macmillan –, entscheidest du mit.</p>
<p><strong>Das Lagebild.</strong> Landesspezifisch sind das Empire, das Pfund, das Verhältnis zu den Gewerkschaften, das Atomprogramm und die Bindung an Europa. Das Pfund ist Reservewährung des Commonwealth und ständig in Gefahr; die Gewerkschaften entscheiden über Löhne und Streiks.</p>`,
};
