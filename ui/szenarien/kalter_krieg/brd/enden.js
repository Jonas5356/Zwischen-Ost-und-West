// Enden des Spiels und der Abschlussbericht
import { jahrVon, zeitText } from '../../../engine.js';

const pct = x => `${x.toFixed(1).replace('.', ',')}\u00a0%`;

function spdKandidat(s) {
  const j = jahrVon(s.zeit);
  if (j < 1960) return 'Erich Ollenhauer';
  return 'Willy Brandt';
}

export const ENDEN = {
  wahlniederlage: {
    titel: 'Die Union in der Opposition',
    ascii: 'urne',
    text: s => {
      const e = s.wahlen[s.wahlen.length - 1];
      const j = jahrVon(s.zeit);
      return `${e.gesamtdeutsch ? 'Bei der Wahl im vereinten Deutschland' : `Bei der Bundestagswahl ${j}`} kommt die Union auf ${pct(e.stimmen.Union)}. Für eine Regierung reicht es nicht. ${spdKandidat(s)} wird mit den Stimmen von SPD${e.sitze.FDP ? ' und FDP' : ''} zum Bundeskanzler gewählt.

${e.gesamtdeutsch ? 'Die Einheit, für die du so viel riskiert hast, wird nun von anderen gestaltet. In den Geschichtsbüchern wirst du trotzdem stehen: als der Kanzler, der sie möglich gemacht hat.' : `${s.kanzler} räumt das Palais Schaumburg. Die Union muss lernen, was Opposition heißt.`}`;
    },
  },
  misstrauensvotum: {
    titel: 'Das konstruktive Misstrauensvotum',
    ascii: 'bundeshaus',
    text: s => `Die Koalition ist zerbrochen. Mit den Stimmen der früheren Partner wählt der Bundestag ${spdKandidat(s)} zum neuen Bundeskanzler. Das Grundgesetz hat genau diesen Fall vorgesehen: Ein Kanzler kann nur gestürzt werden, wenn zugleich ein neuer gewählt wird.

Die Ära der Union endet ${zeitText(s.zeit)} – früher als in der Geschichte.`,
  },
  krieg: {
    titel: 'Der Krieg',
    ascii: 'pilz',
    text: s => `${s.f.vereinigt ? 'Es beginnt mit einem Zwischenfall an der Oder, einem Missverständnis, einem Befehl, der zu spät widerrufen wird. Binnen Stunden stoßen sowjetische Panzer auf Berlin vor; das neutrale Deutschland hat ihnen wenig entgegenzusetzen. Am dritten Tag greifen die Amerikaner ein – mit taktischen Atomwaffen, auf deutschem Boden.' : 'Es beginnt mit einem Zwischenfall an der Zonengrenze, einem Missverständnis, einem Befehl, der zu spät widerrufen wird. Binnen Stunden rollen Panzer durch die Fulda-Lücke. Am zweiten Tag setzt die NATO taktische Atomwaffen ein, um den Vormarsch aufzuhalten – auf deutschem Boden.'}

Was die Göttinger Achtzehn vorhergesagt haben, tritt ein. Zwischen Elbe und Rhein bleibt wenig, was man noch verteidigen könnte.

Das Spiel endet ${zeitText(s.zeit)}. Der Kalte Krieg ist heiß geworden – und Deutschland war das Schlachtfeld.`,
  },
  staatsbankrott: {
    titel: 'Der Staatsbankrott',
    ascii: 'presse',
    text: s => `Zum dritten Mal sind die Kassen des Bundes leer. Die Bundesbank verweigert jede weitere Hilfe, ausländische Kreditgeber ziehen sich zurück. Die Erinnerung an 1923 und 1948 bricht mit Macht hervor; die Menschen tauschen ihr Geld in Sachwerte. Die Regierung tritt zurück.

Das Wirtschaftswunder ist ${zeitText(s.zeit)} zu Ende gegangen – nicht wegen der Märkte, sondern wegen der Politik.`,
  },
  besatzungsrecht: {
    titel: 'Die Rückkehr der Hohen Kommissare',
    ascii: 'flagge',
    text: s => `Die drei Westmächte haben das Vertrauen in die Bundesregierung verloren. Gestützt auf ihre vorbehaltenen Rechte aus dem Besatzungsstatut erklären die Hohen Kommissare den Notstand, setzen Bundesgesetze außer Kraft und verlangen eine neue Regierung.

Die Bundesrepublik, kaum gegründet, ist wieder ein besetztes Land. ${zeitText(s.zeit)}.`,
  },
  abschluss: {
    titel: s => bericht(s).titel,
    ascii: 'bundeshaus',
    text: s => bericht(s).text,
  },
};

export function bericht(s) {
  const w = s.w;
  const f = s.f;
  let titel;
  if (f.vereinigt) titel = 'Einig und neutral';
  else if (f.freistadt_vereinbart) titel = 'Der Preis der Ruhe';
  else if (f.westintegration_gescheitert || (!f.nato && !f.evg)) titel = 'Zwischen den Blöcken';
  else if (w.europa >= 60 && w.frankreich >= 70 && w.usa < 55) titel = 'Der Europäer';
  else if (w.usa >= 70 && w.frankreich < 45) titel = 'Der Atlantiker';
  else if (w.usa >= 55 && w.frankreich >= 55 && w.europa >= 45) titel = 'Westbindung und Aussöhnung';
  else titel = 'Ein Staat im Werden';

  const absaetze = [];
  // Außenpolitik
  if (f.vereinigt) {
    absaetze.push(`Deutschland ist seit ${zeitText(f.vereinigt)} wieder vereint – neutral, ohne Besatzungstruppen, zwischen den Blöcken. ${f.grenze_anerkannt ? 'Der Preis war die Anerkennung der Oder-Neiße-Grenze.' : 'Die Grenze im Osten ist bis zu einem endgültigen Friedensvertrag offen geblieben.'} ${f.ewg ? 'Wirtschaftlich gehört es zur Europäischen Wirtschaftsgemeinschaft – ein ständiger Streitpunkt mit Moskau.' : ''}`);
  } else {
    const teile = [];
    if (f.nato) teile.push('Die Bundesrepublik ist Mitglied der NATO');
    else if (f.evg) teile.push('Die Bundesrepublik ist Teil einer Europäischen Verteidigungsgemeinschaft');
    else teile.push('Die Bundesrepublik gehört keinem Bündnis an');
    if (f.ewg) teile.push('Gründungsmitglied der EWG');
    if (f.elysee) teile.push('mit Frankreich durch den Élysée-Vertrag verbunden');
    absaetze.push(teile.join(', ') + '. ' + (f.mauer ? 'Seit 1961 trennt eine Mauer Berlin.' : f.freistadt_vereinbart ? 'West-Berlin ist eine Freie Stadt, deren Zugänge die DDR kontrolliert.' : 'Eine Mauer durch Berlin gibt es nicht.') + (f.saar_zurueck ? ' Die Saar ist zurückgekehrt.' : f.saar_europaeisch ? ' Die Saar ist ein europäisches Territorium.' : ''));
  }
  // Wirtschaft
  const wachstum = s.verlauf.map(v => v.wachstum);
  const mittel = wachstum.length ? wachstum.reduce((a, b) => a + b, 0) / wachstum.length : w.wachstum;
  absaetze.push(`Die Wirtschaft ist im Durchschnitt um ${pct(mittel)} im Jahr gewachsen (historisch rund 8 %). Die Arbeitslosigkeit liegt bei ${pct(w.arbeitslosigkeit)} (historisch 1963: 0,8 %). Die Haushaltslage ist ${w.haushalt >= 50 ? 'solide' : w.haushalt >= 25 ? 'angespannt, aber beherrschbar' : 'kritisch'}.`);
  // Innenpolitik
  if (s.wahlen.length) {
    absaetze.push('Wahlergebnisse der Union: ' + s.wahlen.map(e => `${jahrVon(e.zeit)}: ${pct(e.stimmen.Union)}`).join(' · ') + ' (historisch 1953: 45,2 %, 1957: 50,2 %, 1961: 45,3 %).');
  }
  absaetze.push(`Kanzler: ${s.kanzler}${f.praesident_adenauer ? ' – Konrad Adenauer ist Bundespräsident' : ''}. Regierungsparteien: ${s.regierung.map(p => ({ Union: 'CDU/CSU', SPD: 'SPD', FDP: 'FDP', Kleine: 'DP/BHE' }[p] || p)).join(', ')}.`);
  // Geschichtsnähe
  const mitHist = s.chronik.filter(c => c.hist !== null);
  const gleich = mitHist.filter(c => c.hist).length;
  if (mitHist.length) {
    const q = Math.round(100 * gleich / mitHist.length);
    absaetze.push(`In ${gleich} von ${mitHist.length} Entscheidungen (${q} %) hast du so entschieden wie die historische Bundesregierung.`);
  }
  return { titel, text: absaetze.join('\n\n'), absaetze };
}
