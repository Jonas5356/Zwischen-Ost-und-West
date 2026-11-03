// Regierungen Frankreichs, wenn das Spiel das Land steuert (ki.js). Welche Regierung im Amt
// ist, ergibt sich aus dem Modell (Lager der Regierung, `regimeVon`); beim Amtsantritt wird
// ihr verborgener Typ ausgelost.
//
// Ziele (b_g), auf die sich `dient` an den Optionen bezieht:
//   deutschland_einbinden  die Bundesrepublik in europäische Strukturen einbinden
//   deutschland_klein      Deutschland schwach halten, keine deutschen Soldaten
//   saar                   die Saar an Frankreich binden
//   europa                 europäische Einigung
//   westbindung            Bündnis mit den USA, NATO
//   unabhaengigkeit        Unabhängigkeit von Washington, „Grandeur“
//   atom                   eine eigene Atomstreitmacht
//   kolonien               Indochina und Algerien halten
//   frieden_kolonien       die Kolonialkriege beenden
//   sozial                 soziale Reformen
//   modernisierung         Modernisierung von Wirtschaft und Staat
//   stabilitaet            stabile Institutionen

const WERTE = {
  usa: 0.5, brd: 0.3, grossbritannien: 0.3, moskau: 0.15, rang: 1.0, europa: 0.4, atom: 0.3,
  indochina: 0.6, algerien: 0.8, armee: 0.6, ansehen: 0.8, mehrheit: 0.9, haushalt: 0.4, franc: 0.4,
  impuls: 0.8, preisdruck: -0.6, inflation: -0.5, wachstum: 0.4, kriegsmuede: -0.5, bonus: 0.3,
};
const BASIS = {
  deutschland_einbinden: 1.0, deutschland_klein: 0.6, saar: 0.8, europa: 0.8, westbindung: 1.0, unabhaengigkeit: 0.5,
  atom: 0.4, kolonien: 1.0, frieden_kolonien: 0.4, sozial: 0.5, modernisierung: 0.5, stabilitaet: 0.6,
};

export const REGIERUNGEN = {
  tripartisme: {
    name: 'Tripartisme', kurz: 'Tripartisme', titel: 'Regierung des Tripartisme',
    lambda: 1.7, werte: { ...WERTE, moskau: 0.4 }, ziele: { ...BASIS, sozial: 1.3, deutschland_klein: 1.4, saar: 1.2, westbindung: 0.6, unabhaengigkeit: 0.9 },
    frage: 'Stellt sich Paris im Streit der Großmächte an die Seite Washingtons?',
    typen: {
      westen: { p: 0.6, name: 'Westen', kurz: 'ja – ohne amerikanische Kredite geht es nicht',
        beschreibung: 'Die Regierung weiß, dass Frankreich ohne amerikanisches Geld nicht wieder aufgebaut werden kann, und rückt Schritt für Schritt nach Westen.',
        ziele: { westbindung: 1.3, unabhaengigkeit: 0.5, deutschland_klein: 1.1 },
        berichte: ['Blum soll aus Washington mit der Überzeugung zurückgekehrt sein, Frankreich müsse sich entscheiden.', 'Im Außenministerium heißt es, Bidault habe den Glauben an eine Verständigung mit Molotow verloren.'] },
      bruecke: { p: 0.4, name: 'Brücke', kurz: 'nein – Paris will zwischen den Blöcken vermitteln',
        beschreibung: 'Die Regierung hält an der Rolle Frankreichs als Brücke zwischen Ost und West fest und will Deutschland mit Moskau gemeinsam kleinhalten.',
        ziele: { westbindung: 0.3, unabhaengigkeit: 1.4, deutschland_klein: 1.7 },
        berichte: ['Bidault soll in Moskau einen Vertrag gegen Deutschland nach dem Vorbild von 1944 angeregt haben.', 'Die kommunistischen Minister setzen im Kabinett durch, dass Paris in Deutschlandfragen nicht mit London und Washington stimmt.'] },
    },
  },
  dritte_kraft: {
    name: 'Dritte Kraft', kurz: 'Dritte Kraft', titel: 'Regierung der Dritten Kraft',
    lambda: 1.8, werte: WERTE, ziele: { ...BASIS, europa: 1.2, westbindung: 1.2, deutschland_einbinden: 1.3 },
    frage: 'Will Paris die Bundesrepublik gleichberechtigt in Europa – oder vor allem kontrollieren?',
    typen: {
      europaeer: { p: 0.6, name: 'Europäer', kurz: 'gleichberechtigt – Europa geht vor',
        beschreibung: 'Die Regierung folgt Schuman und Monnet: Deutschland soll als Partner in ein vereintes Europa eingebunden werden.',
        ziele: { europa: 1.7, deutschland_einbinden: 1.6, deutschland_klein: 0.2, saar: 0.5 },
        berichte: ['Am Quai d’Orsay heißt es, Schuman wolle „die Deutschen nicht mehr bewachen, sondern binden“.', 'Monnet hat im Kabinett freie Hand für weitere Integrationspläne bekommen.'] },
      kontrolle: { p: 0.4, name: 'Kontrolle', kurz: 'kontrollieren – Sicherheit vor Deutschland geht vor',
        beschreibung: 'Europa ist für diese Regierung vor allem ein Mittel, die Deutschen unter Aufsicht zu halten.',
        ziele: { deutschland_klein: 1.3, saar: 1.4, europa: 0.7 },
        berichte: ['Im Verteidigungsministerium werden Pläne gewälzt, die deutschen Kontingente auf Bataillonsstärke zu begrenzen.', 'Ein hoher Beamter des Quai d’Orsay soll gesagt haben, die Saar sei „nicht verhandelbar“.'] },
    },
  },
  mitte_rechts: {
    name: 'Mitte-rechts', kurz: 'Mitte-rechts', titel: 'Regierung der rechten Mitte',
    lambda: 1.7, werte: { ...WERTE, haushalt: 0.7, franc: 0.7 }, ziele: { ...BASIS, kolonien: 1.5, saar: 1.1, sozial: 0.2 },
    frage: 'Wird Paris die Europäische Verteidigungsgemeinschaft ratifizieren?',
    typen: {
      evg: { p: 0.35, name: 'Für die EVG', kurz: 'ja – die Regierung steht zur europäischen Armee',
        beschreibung: 'Die Regierung will die EVG durchbringen, notfalls mit der Vertrauensfrage.',
        ziele: { deutschland_einbinden: 1.5, europa: 1.2, deutschland_klein: 0.4 },
        berichte: ['Der Ministerpräsident soll entschlossen sein, die Vertrauensfrage zu stellen.', 'Bidault drängt im Kabinett auf eine rasche Abstimmung über die EVG.'] },
      zaudern: { p: 0.65, name: 'Zaudern', kurz: 'kaum – die EVG wird verschleppt',
        beschreibung: 'Die Regierung fürchtet, an der EVG zu zerbrechen, und schiebt die Ratifizierung hinaus.',
        ziele: { deutschland_klein: 1.2, europa: 0.5, stabilitaet: 1.0 },
        berichte: ['Aus der Umgebung des Ministerpräsidenten heißt es, die EVG könne „noch etwas warten“.', 'Die Regierung verlangt neue Zusatzprotokolle – in Bonn wertet man das als Hinhaltetaktik.'] },
    },
  },
  mendes: {
    name: 'Pierre Mendès France', kurz: 'Mendès France', titel: 'Regierung Mendès France',
    lambda: 1.9, werte: { ...WERTE, indochina: 0.3, rang: 1.2 }, ziele: { ...BASIS, frieden_kolonien: 1.6, modernisierung: 1.3, kolonien: 0.5 },
    frage: 'Steht Mendès France hinter der EVG?',
    typen: {
      neutral: { p: 0.7, name: 'Gleichgültig', kurz: 'nein – er lässt die Abstimmung laufen',
        beschreibung: 'Mendès France hält die EVG für eine Bürde. Er wird sie nicht retten, wenn es seine Regierung kostet.',
        ziele: { europa: 0.4, deutschland_klein: 0.9, stabilitaet: 1.2 },
        berichte: ['Mendès France soll gesagt haben, er werde für die EVG „keine Vertrauensfrage stellen“.', 'Drei gaullistische Minister im Kabinett – das spricht nicht für einen Einsatz zugunsten der EVG.'] },
      europaeer: { p: 0.3, name: 'Für die EVG', kurz: 'ja – er will sie durchbringen',
        beschreibung: 'Mendès France will die EVG retten, um Frankreichs Wort gegenüber den Verbündeten zu halten.',
        ziele: { europa: 1.2, deutschland_einbinden: 1.3 },
        berichte: ['Mendès France soll Washington zugesagt haben, die EVG „mit allen Mitteln“ zu verteidigen.', 'Im Matignon wird an Kompromissformeln gearbeitet, die die Sozialisten gewinnen sollen.'] },
    },
  },
  republikanische_front: {
    name: 'Republikanische Front', kurz: 'Republikanische Front', titel: 'Regierung der Republikanischen Front',
    lambda: 1.8, werte: WERTE, ziele: { ...BASIS, europa: 1.4, sozial: 1.2, deutschland_einbinden: 1.2 },
    frage: 'Will Paris Algerien um jeden Preis halten?',
    typen: {
      hart: { p: 0.7, name: 'Harte Linie', kurz: 'ja – erst die Waffen, dann die Reformen',
        beschreibung: 'Die Regierung will den Aufstand niederschlagen, bevor sie verhandelt.',
        ziele: { kolonien: 1.7, frieden_kolonien: 0.3 },
        berichte: ['Paris schickt weitere Wehrpflichtige nach Algerien; die Dienstzeit wird verlängert.', 'Der Algerienminister soll erklärt haben, mit der FLN werde nicht verhandelt.'] },
      verhandeln: { p: 0.3, name: 'Verhandlungsbereit', kurz: 'nein – sie sucht insgeheim einen Ausgleich',
        beschreibung: 'Hinter der harten Rhetorik sucht die Regierung Kontakte zur FLN.',
        ziele: { frieden_kolonien: 1.5, kolonien: 0.7 },
        berichte: ['Emissäre der Sozialisten sollen sich in Kairo und Belgrad mit Vertretern der FLN getroffen haben.', 'Der Ministerpräsident soll im kleinen Kreis von einem „Waffenstillstand ohne Sieger“ gesprochen haben.'] },
    },
  },
  volksfront: {
    name: 'Volksfront', kurz: 'Volksfront', titel: 'Regierung der Volksfront (Fiktion)',
    lambda: 1.5, werte: { ...WERTE, moskau: 0.5, usa: 0.2 }, ziele: { ...BASIS, sozial: 1.6, frieden_kolonien: 1.5, kolonien: 0.3, westbindung: 0.3, deutschland_klein: 1.2 },
    frage: 'Würde die Volksfront die NATO verlassen?',
    typen: {
      neutralistisch: { p: 0.5, name: 'Neutralistisch', kurz: 'ja – Frankreich soll zwischen den Blöcken stehen',
        beschreibung: 'Die Kommunisten setzen sich durch: Frankreich soll sich aus dem Bündnis lösen.',
        ziele: { westbindung: -0.5, unabhaengigkeit: 1.5 },
        berichte: ['Kommunistische Minister verlangen den Abzug der amerikanischen Stützpunkte.', 'Ein Gesandter Thorez’ soll in Moskau über einen „Neutralitätsvertrag“ gesprochen haben.'] },
      atlantisch: { p: 0.5, name: 'Im Bündnis', kurz: 'nein – die Sozialisten halten am Bündnis fest',
        beschreibung: 'Die Sozialisten setzen durch, dass Frankreich in der NATO bleibt.',
        ziele: { westbindung: 1.0 },
        berichte: ['Der Ministerpräsident versichert dem NATO-Rat, Frankreich bleibe ein „loyaler Verbündeter“.', 'Die Kommunisten haben auf das Außenministerium verzichtet.'] },
    },
  },
  de_gaulle: {
    name: 'Charles de Gaulle', kurz: 'de Gaulle', titel: 'General de Gaulle',
    lambda: 2.2, werte: { ...WERTE, rang: 1.6, mehrheit: 0.4, atom: 0.6 }, ziele: { ...BASIS, unabhaengigkeit: 1.6, atom: 1.6, westbindung: 0.6, frieden_kolonien: 1.1, kolonien: 0.6, europa: 0.6, stabilitaet: 1.2 },
    frage: 'Sucht de Gaulle Bonn als Partner gegen Washington?',
    typen: {
      achse: { p: 0.55, name: 'Achse Paris–Bonn', kurz: 'ja – ein Europa der Vaterländer ohne die Angelsachsen',
        beschreibung: 'De Gaulle will die Bundesrepublik aus der amerikanischen Umarmung lösen und mit ihr ein unabhängiges Europa unter französischer Führung bauen.',
        ziele: { deutschland_einbinden: 1.6, unabhaengigkeit: 1.9, westbindung: 0.3 },
        berichte: ['De Gaulle soll gesagt haben, Europa müsse „europäisch“ sein, nicht atlantisch.', 'Im Élysée wird an einem Vertrag mit Bonn gearbeitet, der über die NATO hinausgeht.'] },
      gleichgewicht: { p: 0.45, name: 'Gleichgewicht', kurz: 'nein – Bonn bleibt ein Juniorpartner unter Aufsicht',
        beschreibung: 'De Gaulle will die Deutschen eng an Frankreich binden, aber sie sollen keine eigene Rolle spielen – und schon gar keine Atomwaffen bekommen.',
        ziele: { deutschland_klein: 1.3, deutschland_einbinden: 0.9, westbindung: 0.8 },
        berichte: ['De Gaulle soll im Kabinett gesagt haben, er liebe Deutschland so sehr, dass er froh sei, dass es zwei davon gebe.', 'Paris lässt in Washington wissen, eine deutsche Beteiligung an Atomwaffen komme nicht in Frage.'] },
    },
  },
  militaer: {
    name: 'Militärregierung', kurz: 'Generäle', titel: 'Militärregierung (Fiktion)',
    lambda: 1.6, werte: { ...WERTE, armee: 1.2, algerien: 1.4, mehrheit: 0.1 }, ziele: { ...BASIS, kolonien: 2.2, frieden_kolonien: 0.1, sozial: 0.1, europa: 0.3 },
    frage: 'Wie weit wollen die Generäle gehen?',
    typen: {
      algerie_francaise: { p: 0.7, name: 'Französisches Algerien', kurz: 'bis zum Ende – Algerien bleibt französisch',
        beschreibung: 'Die Junta hat nur ein Ziel: den Krieg in Algerien zu gewinnen, koste es, was es wolle.',
        ziele: { kolonien: 2.5 },
        berichte: ['Die Junta hat die Einberufung zweier weiterer Jahrgänge angeordnet.', 'In Algier feiern die Siedler die Generäle als Retter.'] },
      ordnung: { p: 0.3, name: 'Ordnung', kurz: 'begrenzt – sie will bald an Zivilisten übergeben',
        beschreibung: 'Die Generäle wollen „Ordnung schaffen“ und dann die Macht an eine neue zivile Regierung übergeben.',
        ziele: { stabilitaet: 1.5, kolonien: 1.6 },
        berichte: ['Ein Sprecher der Junta kündigt eine „verfassunggebende Versammlung“ an.', 'Mehrere Generäle drängen auf baldige Wahlen.'] },
    },
  },
};
