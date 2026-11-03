// Gemeinsamer Wertekatalog: Wer ein Land gelernt hat, versteht jedes andere.
//
// Das Lagebild hat in jedem Land dieselben Blöcke in derselben Reihenfolge:
//   Regierung, Wirtschaft, Beziehungen – überall gleich – und zuletzt „Landesspezifisch“.
// Standardwerte haben überall denselben Namen, dieselbe Skala und dieselbe Rolle im Modell;
// wie sie im einzelnen Land gemessen werden, ergänzt die Erklärung in `oberflaeche.js`.
// Bausteine (Europa, Armee, Atomprogramm, Währung, Krieg) sind einheitlich definiert, stehen
// aber im landesspezifischen Block, weil nicht jedes Land sie hat.
//
// Eine Erklärung hat die Teile `was` (was der Wert ist), `hebt`, `senkt` und `wirkt`
// (was er im Spiel bewirkt, mit Schwellen).

export const BLOECKE = [
  { id: 'regierung', titel: 'Regierung' },
  { id: 'wirtschaft', titel: 'Wirtschaft' },
  { id: 'beziehungen', titel: 'Beziehungen' },
  { id: 'land', titel: 'Landesspezifisch' },
];

export const STANDARD = {
  zustimmung: {
    name: 'Umfrage', kurz: 'Umfrage', min: 5, max: 85, einheit: '%', block: 'regierung', keinHinweis: true, skala: [10, 70],
    erklaerung: {
      was: 'Wie viele Menschen hinter der Regierung stehen, in Prozent.',
      hebt: 'Wachstum, das Ansehen des Regierungschefs, ein frischer Amtsbonus.',
      senkt: 'Inflation, Arbeitslosigkeit, Kriegsmüdigkeit, unpopuläre Entscheidungen.',
      wirkt: 'Bestimmt das Wahlergebnis und stützt oder schwächt den Rückhalt der Regierung.',
    },
  },
  ansehen: {
    name: 'Ansehen des Regierungschefs', kurz: 'Ansehen', min: -30, max: 30, block: 'regierung',
    erklaerung: {
      was: 'Die kurzfristige Stimmung über den Regierungschef und seine letzten Entscheidungen, von −30 bis +30.',
      hebt: 'Entscheidungen, die gut ankommen; Erfolge in der Außenpolitik.',
      senkt: 'Unpopuläre Entscheidungen, Skandale, Niederlagen.',
      wirkt: 'Geht Punkt für Punkt in die Umfrage ein. Verblasst jedes Halbjahr um ein Viertel.',
    },
  },
  rueckhalt: {
    name: 'Rückhalt der Regierung', kurz: 'Rückhalt', min: 0, max: 100, block: 'regierung', warnung: v => v <= 15,
    erklaerung: {
      was: 'Wie fest die Regierung im Parlament steht, von 0 bis 100. Niedrig heißt: Die Regierung ist in Gefahr.',
      hebt: 'Eine breite Mehrheit, zufriedene Koalitionsparteien, Erfolge.',
      senkt: 'Entscheidungen, die Koalitionspartner verprellen, Krisen, Niederlagen.',
      wirkt: 'Fällt er zu tief, droht der Sturz der Regierung.',
    },
  },
  wachstum: {
    name: 'Wirtschaftswachstum', kurz: 'Wachstum', min: -10, max: 20, einheit: '%', block: 'wirtschaft', keinHinweis: true, skala: [-2, 12],
    erklaerung: {
      was: 'Reales Wachstum der Wirtschaft im letzten Halbjahr, als Jahresrate in Prozent.',
      hebt: 'Konjunkturprogramme, Investitionen, amerikanische Hilfe, Frieden.',
      senkt: 'Sparhaushalte, Kriege, Streiks, eine schwache Währung.',
      wirkt: 'Hebt die Umfrage, füllt den Haushalt und senkt die Arbeitslosigkeit.',
    },
  },
  inflation: {
    name: 'Inflation', kurz: 'Inflation', min: -5, max: 70, einheit: '%', invertiert: true, block: 'wirtschaft', keinHinweis: true, skala: [0, 20],
    erklaerung: {
      was: 'Anstieg der Preise im Jahr, in Prozent.',
      hebt: 'Haushaltsdefizite, Lohnerhöhungen, Kriege, ein Rohstoffboom.',
      senkt: 'Sparhaushalte, Stabilisierungsprogramme.',
      wirkt: 'Drückt auf die Umfrage und schwächt die Währung.',
    },
  },
  arbeitslosigkeit: {
    name: 'Arbeitslosenquote', kurz: 'Arbeitslose', min: 0.5, max: 25, einheit: '%', invertiert: true, block: 'wirtschaft', keinHinweis: true, skala: [0, 12],
    erklaerung: {
      was: 'Anteil der Arbeitslosen an den Erwerbspersonen, in Prozent.',
      hebt: 'Schwaches Wachstum, Zustrom von Flüchtlingen, Krisen.',
      senkt: 'Starkes Wachstum, Wohnungs- und Straßenbau.',
      wirkt: 'Drückt auf die Umfrage.',
    },
  },
  haushalt: {
    name: 'Haushaltslage', kurz: 'Haushalt', min: -20, max: 100, block: 'wirtschaft', skala: [0, 100], warnung: v => v <= 10,
    erklaerung: {
      was: 'Spielraum im Staatshaushalt in Punkten, von −20 bis 100.',
      hebt: 'Wachstum, Sparhaushalte, Steuererhöhungen.',
      senkt: 'Vorhaben, Kriege, Rüstung, Subventionen.',
      wirkt: 'Vorhaben kosten Haushaltspunkte. Fällt er unter 0, kommt ein Haushaltsnotstand; beim dritten droht der Staatsbankrott.',
    },
  },
};

/** Beziehungen: Wie das jeweilige Land das eigene sieht (0 = feindlich, 100 = engste Partnerschaft) */
const BEZIEHUNGEN = [
  ['usa', 'usa', 'Washington', 'zu den USA'],
  ['moskau', 'su', 'Moskau', 'zur Sowjetunion'],
  ['grossbritannien', 'grossbritannien', 'London', 'zu Großbritannien'],
  ['frankreich', 'frankreich', 'Paris', 'zu Frankreich'],
  ['brd', 'brd', 'Bonn', 'zur Bundesrepublik'],
];
const BEZIEHUNG_ERKLAERUNG = ort => ({
  was: `Wie man in ${ort} dein Land sieht, von 0 (feindlich) bis 100 (engste Partnerschaft).`,
  hebt: 'Entscheidungen im Sinn dieses Landes, gemeinsame Verträge, Zugeständnisse.',
  senkt: 'Entscheidungen gegen seine Interessen, gebrochene Zusagen, abgelehnte Angebote.',
  wirkt: 'Bestimmt mit, wie dieses Land auf Angebote und Anfragen antwortet. Die Werte streben langsam zu einem Normalniveau zurück.',
});

/** Beziehungswerte eines Landes in fester Reihenfolge, ohne das Land selbst */
export function beziehungen(eigenes) {
  return Object.fromEntries(BEZIEHUNGEN.filter(([, land]) => land !== eigenes).map(([k, land, kurz, zu]) => [k, {
    name: `Beziehung ${zu}`, kurz, min: 0, max: 100, beziehung: land, block: 'beziehungen', warnung: v => v <= 15, erklaerung: BEZIEHUNG_ERKLAERUNG(kurz),
  }]));
}

/** Reihenfolge der Beziehungen im Lagebild */
export const BEZIEHUNGSREIHE = BEZIEHUNGEN.map(([k]) => k);

export const BAUSTEINE = {
  europa: {
    name: 'Europäische Integration', kurz: 'Europa', min: 0, max: 100, block: 'land',
    erklaerung: {
      was: 'Wie weit die europäische Einigung mit deinem Land gediehen ist, von 0 bis 100.',
      hebt: 'Montanunion, EWG, gemeinsame Projekte mit den Nachbarn.',
      senkt: 'Gescheiterte Verträge, Alleingänge, Vetos.',
      wirkt: 'Hebt das Wachstum ein wenig und öffnet Vorlagen wie den Élysée-Vertrag.',
    },
  },
  armee: {
    name: 'Loyalität der Armee', kurz: 'Armee', min: 0, max: 100, block: 'land',
    erklaerung: {
      was: 'Wie sehr die Armee der Regierung gehorcht, von 0 bis 100.',
      hebt: 'Eine harte Linie in den Kolonien, Verstärkungen, Rüstung.',
      senkt: 'Verhandlungen mit Aufständischen, Rückzüge, Regierungsstürze während eines Kriegs.',
      wirkt: 'Unter 40 droht ein Aufstand der Generäle; unter 12 meutert die Armee.',
    },
  },
  atom: {
    name: 'Atomprogramm', kurz: 'Atomprogramm', min: 0, max: 100, block: 'land',
    erklaerung: {
      was: 'Fortschritt auf dem Weg zu einer eigenen Atombombe, von 0 bis 100.',
      hebt: 'Ein Atomprogramm (Vorhaben), Zusammenarbeit mit anderen Ländern.',
      senkt: 'Verzicht, Teststopp.',
      wirkt: 'Ab 80 kann die erste Bombe getestet werden.',
    },
  },
  waehrung: (kurz, name) => ({
    name: `Stabilität ${name}`, kurz, min: 0, max: 100, block: 'land',
    erklaerung: {
      was: `Vertrauen in die Währung, von 0 bis 100.`,
      hebt: 'Ein solider Haushalt, Stabilisierungsprogramme, niedrige Inflation.',
      senkt: 'Inflation, Haushaltsdefizite, Kriege.',
      wirkt: 'Unter 20 kostet eine schwache Währung Wachstum; bei 5 kommt eine Währungskrise.',
    },
  }),
  /** Ein Krieg oder Aufstand: Lage 100 = unter Kontrolle */
  krieg: (kurz, wo) => ({
    name: `Lage in ${wo}`, kurz, min: 0, max: 100, block: 'land',
    erklaerung: {
      was: `Die militärische Lage in ${wo}, von 0 (verloren) bis 100 (unter Kontrolle).`,
      hebt: 'Verstärkungen, Offensiven, amerikanische Hilfe. Der Einsatz bremst den Verfall dauerhaft.',
      senkt: 'Jedes Halbjahr Krieg zehrt an der Lage; Niederlagen, Rückzüge, Hilfe von außen für den Gegner.',
      wirkt: 'Eine schlechte Lage kostet Rückhalt und Ansehen; fällt sie sehr tief, ist der Krieg verloren. Der Krieg selbst kostet Haushalt und macht kriegsmüde.',
    },
  }),
};

/** Skala für die Balken im Lagebild: aus dem Katalog, sonst Minimum bis Maximum */
export const skala = d => d.skala || [d.min, d.max];
