// Frankreich: Enden des Spiels und der Abschlussbericht
import { zeitText, zeitIndex } from '../../../engine.js';
import { LAGER, PARTEIEN } from './modell.js';
import { aufloesung } from '../aufloesung.js';

const pct = x => `${x.toFixed(1).replace('.', ',')} %`;

/** Alle Regierungschefs mit Amtszeit */
function chefText(s) {
  const l = s.chefliste || [];
  return l.map((c, i) => {
    const bis = l[i + 1]?.ab;
    const zeit = bis ? (c.ab === bis ? zeitText(c.ab) : `${zeitText(c.ab)}–${zeitText(bis)}`) : `seit ${zeitText(c.ab)}`;
    return `${c.name}${c.partei && PARTEIEN[c.partei] ? ` (${PARTEIEN[c.partei].kurz})` : ''}, ${zeit}`;
  }).join('; ');
}

function bericht(s) {
  const f = s.f;
  const w = s.w;
  const absaetze = [];
  const anzahl = (s.chefliste || []).length;
  const stuerze = (s.stuerze || []).length;
  let titel = 'Frankreich im Frühjahr 1964';
  if (s.lager === 'militaer') titel = 'Frankreich unter den Generälen';
  else if (s.republik === 5 && s.lager === 'de_gaulle') titel = 'Die Republik des Generals';
  else if (s.republik === 4) titel = 'Die Vierte Republik lebt';

  absaetze.push(`Frühjahr 1964. ${s.republik === 5 ? `Frankreich ist eine Präsidialrepublik; ${s.praesident} regiert aus dem Élysée, Premierminister ist ${s.regierungschef}.` : s.lager === 'militaer' ? `Frankreich wird von einer Militärregierung unter ${s.regierungschef} regiert. Die Republik ist suspendiert.` : `Die Vierte Republik besteht noch. Ministerpräsident ist ${s.regierungschef}, getragen von der Formel „${LAGER[s.lager]?.name}“.`}`);
  absaetze.push(`Seit 1946 hatte Frankreich ${anzahl} Regierungschefs; ${stuerze ? `${stuerze}-mal ist eine Regierung gestürzt` : 'keine Regierung ist gestürzt'}. Zum Vergleich: In der Geschichte zählte Frankreich zwischen 1946 und 1958 mehr als zwanzig Regierungen.${f.praesidialverfassung ? ' Die Präsidialverfassung von 1946 hat die Regierungen gestützt.' : ''}\n\nRegierungschefs: ${chefText(s)}.`);

  const kolonien = [];
  const indochina = {
    ausgleich: 'Vietnam wurde ohne Krieg unabhängig',
    gehalten: 'Vietnam ist unter Bao Dai unabhängig und mit Frankreich verbündet',
    genf: f.dien_bien_phu ? 'nach Điện Biên Phủ wurde Vietnam in Genf geteilt' : 'Vietnam wurde in Genf geteilt',
    frieden: 'Vietnam wurde nach einem Frieden mit Ho Chi Minh unabhängig',
    rueckzug: 'Frankreich hat Indochina aufgegeben',
    niederlage: 'der Krieg in Indochina ging verloren',
  }[f.indochina_ende];
  if (indochina) kolonien.push(indochina);
  else if (f.indochina_beendet) kolonien.push('der Indochina-Krieg wurde beendet');
  else if (f.indochinakrieg) kolonien.push('in Indochina wird noch immer gekämpft');
  if (f.algerien_unabhaengig) kolonien.push('Algerien ist unabhängig');
  else if (f.algerien_integration && f.algerien_frieden) kolonien.push('Algerien ist französisch geblieben, mit gleichen Rechten für alle');
  else if (f.algerien_autonomie) kolonien.push('Algerien hat Autonomie innerhalb Frankreichs, ohne Krieg');
  else if (f.algerienkrieg) kolonien.push('der Algerienkrieg dauert an');
  if (f.maghreb_unabhaengig) kolonien.push('Marokko und Tunesien sind unabhängig');
  if (f.afrika_entschieden && !f.maghreb_krieg) kolonien.push('in Afrika sind die meisten Kolonien selbständig geworden');
  absaetze.push(`Das Empire: ${kolonien.join(', ')}.`);

  const europa = [];
  if (f.montanunion_ratifiziert) europa.push('die Montanunion');
  if (s.weltflags.evg === 'ratifiziert') europa.push('die Europäische Verteidigungsgemeinschaft');
  if (f.rom_ratifiziert) europa.push('die Europäische Wirtschaftsgemeinschaft');
  if (f.elysee) europa.push('den Freundschaftsvertrag mit Bonn');
  const nachbar = s.welt.laender.brd?.nie
    ? ' Einen deutschen Staat gibt es nicht; Deutschland ist noch immer besetzt.'
    : ` Das Verhältnis zur Bundesrepublik ist ${w.brd >= 70 ? 'eng wie nie' : w.brd >= 50 ? 'gut' : w.brd >= 30 ? 'kühl' : 'zerrüttet'}.`;
  absaetze.push(europa.length ? `Europa: Frankreich hat ${europa.join(', ').replace(/, ([^,]*)$/, ' und $1')} mitgetragen.${nachbar}` : `Europa: Frankreich ist allen Plänen einer europäischen Einigung ferngeblieben.${nachbar}`);
  absaetze.push(`Die Bombe: ${f.atomtest ? 'Frankreich ist Atommacht.' : f.atombombe ? 'Frankreich arbeitet an einer eigenen Bombe.' : 'Frankreich hat keine eigenen Atomwaffen.'}`);
  absaetze.push(`Wirtschaft: zuletzt ${pct(w.wachstum)} Wachstum bei ${pct(w.inflation)} Inflation; der Franc ${w.franc >= 60 ? 'ist stabil' : w.franc >= 30 ? 'hält' : 'ist schwach'}${f.neuer_franc ? ', seit 1960 als Neuer Franc' : ''}.`);
  const a = aufloesung(s, 'Paris');
  if (a) absaetze.push(a);
  return { titel, text: absaetze.join('\n\n') };
}

export const ENDEN = {
  krieg: {
    titel: 'Der Krieg',
    ascii: 'pilz',
    text: s => `${s.weltflags.atomkrieg ? 'Es beginnt mit Kuba: Amerikanische Bomber greifen die sowjetischen Raketenstellungen an, Moskau antwortet in Berlin.' : `Es beginnt ${s.zeit < 1950 ? 'in Berlin' : 'in Deutschland'}, mit einem Zwischenfall, einem Missverständnis, einem Befehl, der zu spät widerrufen wird.`} Binnen Stunden fliegen die ersten Atomwaffen. Sowjetische Panzer stoßen durch Deutschland auf den Rhein vor; die französischen Divisionen in Baden werden überrollt.

Was Frankreich seit dem Krieg aufgebaut hat, liegt in Trümmern. Das Spiel endet ${zeitText(s.zeit)}.`,
  },
  buergerkrieg: {
    titel: 'Der Bürgerkrieg',
    ascii: 'alarm',
    text: s => `Fallschirmjäger aus Algerien landen auf den Flugplätzen um Paris. In den Vororten errichten Arbeiter Barrikaden, Gendarmen und Soldaten schießen aufeinander, die Kommunisten rufen zum Generalstreik. Die Republik, die die Armee nicht mehr gehorchen ließ, versinkt in dem Bürgerkrieg, den sie seit 1958 gefürchtet hat.

Das Spiel endet ${zeitText(s.zeit)}.`,
  },
  staatsbankrott: {
    titel: 'Der Staatsbankrott',
    ascii: 'presse_fr',
    text: s => `Zum dritten Mal sind die Kassen leer. Die Banque de France verweigert weitere Vorschüsse, Washington jede weitere Hilfe. Der Franc stürzt ab, die Franzosen tauschen ihr Geld in Gold und Napoléons. Die Regierung tritt zurück; niemand will ihre Nachfolge antreten.

Das Spiel endet ${zeitText(s.zeit)}.`,
  },
  abschluss: {
    titel: s => bericht(s).titel,
    ascii: 'eiffel',
    text: s => bericht(s).text,
  },
};
