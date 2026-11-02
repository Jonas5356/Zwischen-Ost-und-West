// Regierungen der Bundesrepublik, wenn das Spiel das Land steuert (ki.js). Welche Regierung im
// Amt ist, ergibt sich aus dem Modell (Kanzler und Kanzlerpartei, `regimeVon`); beim
// Amtsantritt wird ihr verborgener Typ ausgelost.
//
// Ziele (b_g), auf die sich `dient` an den Optionen bezieht:
//   westbindung       feste Verankerung im Westen, Bündnis mit den USA
//   einheit           Wiedervereinigung, notfalls um den Preis der Westbindung
//   europa            europäische Einigung
//   aussoehnung       Aussöhnung und enge Partnerschaft mit Frankreich
//   wiederbewaffnung  eigene Streitkräfte und Gleichberechtigung im Bündnis
//   sozial            sozialer Ausgleich
//   frieden           keinen Krieg mit Moskau riskieren
// Optionen mit `richtung: 'west'` dienen der Westbindung, mit 'ost' der Einheit (regierungen
// bekommen das über `dientAus` im Landesmodul).

const WERTE = {
  usa: 1.0, frankreich: 0.7, grossbritannien: 0.4, moskau: 0.4, souveraenitaet: 1.0, einheit: 0.6, europa: 0.7,
  ansehen: 0.9, koalition: 0.6, haushalt: 0.5, impuls: 0.8, kanzlerbonus: 0.3,
};

export const REGIERUNGEN = {
  adenauer: {
    name: 'Konrad Adenauer', kurz: 'Adenauer', titel: 'Bundeskanzler Konrad Adenauer',
    lambda: 2.0, werte: WERTE, ziele: { westbindung: 1.4, europa: 1.2, aussoehnung: 1.2, einheit: 0.4, wiederbewaffnung: 0.8, sozial: 0.4, frieden: 1.0 },
    frage: 'Will Adenauer die Westbindung um jeden Preis – auch um den der Einheit?',
    typen: {
      westbindung: { p: 0.8, name: 'Westbindung zuerst', kurz: 'ja – die Einheit kommt nur durch Stärke des Westens',
        beschreibung: 'Adenauer misstraut jeder Neutralität. Die Einheit soll erst kommen, wenn der Westen stark genug ist, um sie zu seinen Bedingungen zu erzwingen.',
        ziele: { westbindung: 1.9, einheit: 0.2 },
        berichte: ['Der Kanzler soll im kleinen Kreis gesagt haben, ein neutrales Deutschland sei ein Deutschland im Vorhof Moskaus.', 'Adenauer hat den Westmächten versichert, Bonn werde keine Verhandlungen über die Köpfe der Verbündeten hinweg führen.'] },
      einheit_offen: { p: 0.2, name: 'Einheit offenhalten', kurz: 'nein – er würde über die Einheit verhandeln',
        beschreibung: 'Hinter seiner Westpolitik hält Adenauer sich die Tür nach Moskau offen.',
        ziele: { einheit: 1.3, westbindung: 1.0 },
        berichte: ['Ein Vertrauter Adenauers hat in Wien Kontakt zu einem sowjetischen Diplomaten aufgenommen.', 'Im Kanzleramt wird über eine „österreichische Lösung“ für Deutschland nachgedacht.'] },
    },
  },
  erhard: {
    name: 'Ludwig Erhard', kurz: 'Erhard', titel: 'Bundeskanzler Ludwig Erhard',
    lambda: 1.8, werte: WERTE, ziele: { westbindung: 1.3, europa: 0.9, aussoehnung: 0.7, einheit: 0.5, wiederbewaffnung: 0.5, sozial: 0.5, frieden: 1.0 },
    frage: 'Atlantiker oder Partner de Gaulles?',
    typen: {
      atlantiker: { p: 0.75, name: 'Atlantiker', kurz: 'Atlantiker – Washington geht vor',
        beschreibung: 'Erhard setzt auf Washington und den Freihandel; mit de Gaulles Europa der Vaterländer kann er wenig anfangen.',
        ziele: { westbindung: 1.7, aussoehnung: 0.4 },
        berichte: ['Erhard soll gesagt haben, ein Europa ohne Großbritannien sei „ein Rumpf“.', 'Der Kanzler reist zuerst nach Washington, nicht nach Paris.'] },
      europaeer: { p: 0.25, name: 'Partner de Gaulles', kurz: 'Partner Frankreichs – Paris geht vor',
        beschreibung: 'Erhard führt Adenauers Politik der engen Bindung an Frankreich fort.',
        ziele: { aussoehnung: 1.4, westbindung: 1.0 },
        berichte: ['Erhard hat de Gaulle zugesagt, den Élysée-Vertrag „mit Leben zu füllen“.', 'Im Kanzleramt ist von einer gemeinsamen deutsch-französischen Initiative die Rede.'] },
    },
  },
  union: {
    name: 'Unionsgeführte Bundesregierung', kurz: 'Bonn', titel: 'Unionsgeführte Bundesregierung',
    lambda: 1.8, werte: WERTE, ziele: { westbindung: 1.3, europa: 1.0, aussoehnung: 0.9, einheit: 0.5, wiederbewaffnung: 0.6, sozial: 0.5, frieden: 1.0 },
    frage: 'Atlantiker oder Partner Frankreichs?',
    typen: {
      atlantiker: { p: 0.6, name: 'Atlantiker', kurz: 'Atlantiker – Washington geht vor',
        beschreibung: 'Der Kanzler setzt vor allem auf Washington.',
        ziele: { westbindung: 1.6, aussoehnung: 0.5 },
        berichte: ['Der Kanzler soll gesagt haben, ohne die Amerikaner sei Berlin nicht zu halten.', 'Bonn stimmt sich in allen Fragen zuerst mit Washington ab.'] },
      europaeer: { p: 0.4, name: 'Partner Frankreichs', kurz: 'Partner Frankreichs – Paris geht vor',
        beschreibung: 'Der Kanzler setzt auf die enge Partnerschaft mit Frankreich.',
        ziele: { aussoehnung: 1.4, westbindung: 1.0 },
        berichte: ['Im Kanzleramt ist von einer „Achse Paris–Bonn“ die Rede.', 'Der Kanzler reist zuerst nach Paris.'] },
    },
  },
  spd: {
    name: 'SPD-geführte Bundesregierung', kurz: 'Bonn', titel: 'SPD-geführte Bundesregierung',
    lambda: 1.6, werte: { ...WERTE, usa: 0.7, moskau: 0.6, einheit: 0.9 }, ziele: { westbindung: 0.6, europa: 0.7, aussoehnung: 0.8, einheit: 1.3, wiederbewaffnung: 0.2, sozial: 1.2, frieden: 1.3 },
    frage: 'Würde die SPD-Regierung die Westbindung für die Einheit opfern?',
    typen: {
      neutralist: { p: 0.55, name: 'Einheit vor Bündnis', kurz: 'ja – die Einheit geht vor',
        beschreibung: 'Die Regierung würde für ein vereintes Deutschland auch die Bündnisbindung aufgeben.',
        ziele: { einheit: 1.8, westbindung: 0.2 },
        berichte: ['Der Kanzler soll gesagt haben, über ein neutrales Deutschland lasse sich reden.', 'Sozialdemokratische Abgesandte haben in Ost-Berlin sondiert.'] },
      westlich: { p: 0.45, name: 'Im Westen', kurz: 'nein – auch sie bleibt im Westen',
        beschreibung: 'Die SPD-Regierung hält an Bündnis und Europa fest; die Einheit soll im Einvernehmen mit dem Westen kommen.',
        ziele: { westbindung: 1.2, einheit: 0.9 },
        berichte: ['Der Kanzler hat dem NATO-Rat versichert, die Bundesrepublik bleibe ein verlässlicher Verbündeter.', 'Die SPD-Führung stellt sich hinter die Pariser Verträge.'] },
    },
  },
};

/** Welche Regierung ist im Amt? */
export function regimeVon(s) {
  if (s.kanzlerpartei === 'SPD') return 'spd';
  if (s.kanzler === 'Adenauer') return 'adenauer';
  if (s.kanzler === 'Erhard') return 'erhard';
  return 'union';
}

/**
 * Ziele, die sich aus einer Option ergeben, ohne dass sie dort stehen (für die gesteuerte
 * Bundesregierung): Westkurs dient der Westbindung, Ostkurs der Einheit, und wer Moskau
 * schwer provoziert, gefährdet den Frieden.
 */
export function dientAus(o) {
  const d = {};
  if (o.richtung === 'west') { d.westbindung = 0.6; d.einheit = -0.2; }
  if (o.richtung === 'ost') { d.einheit = 0.7; d.westbindung = -0.7; }
  const moskau = typeof o.w === 'object' ? o.w?.moskau : undefined;
  if (moskau !== undefined && moskau <= -10) d.frieden = moskau / 12;
  return Object.keys(d).length ? d : null;
}
