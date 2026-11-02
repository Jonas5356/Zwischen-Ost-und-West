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
  absaetze.push(`In fünfzehn Jahren hatte Frankreich ${anzahl} Regierungschefs; ${stuerze ? `${stuerze}-mal ist eine Regierung gestürzt` : 'keine Regierung ist gestürzt'}. Zum Vergleich: In der Geschichte zählte allein die Vierte Republik zwischen 1949 und 1958 siebzehn Kabinette.\n\nRegierungschefs: ${chefText(s)}.`);

  const kolonien = [];
  if (f.indochina_beendet) kolonien.push(f.dien_bien_phu ? 'Indochina ging nach Điện Biên Phủ verloren' : 'der Indochina-Krieg wurde beendet');
  else kolonien.push('in Indochina wird noch immer gekämpft');
  if (f.algerien_unabhaengig) kolonien.push('Algerien ist unabhängig');
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
  absaetze.push(europa.length ? `Europa: Frankreich hat ${europa.join(', ').replace(/, ([^,]*)$/, ' und $1')} mitgetragen. Das Verhältnis zur Bundesrepublik ist ${w.brd >= 70 ? 'eng wie nie' : w.brd >= 50 ? 'gut' : w.brd >= 30 ? 'kühl' : 'zerrüttet'}.` : 'Europa: Frankreich ist allen Plänen einer europäischen Einigung ferngeblieben.');
  absaetze.push(`Die Bombe: ${f.atomtest ? 'Frankreich ist Atommacht.' : f.atombombe ? 'Frankreich arbeitet an einer eigenen Bombe.' : 'Frankreich hat keine eigenen Atomwaffen.'} Rang in der Welt: ${Math.round(w.rang)} von 100.`);
  absaetze.push(`Wirtschaft: zuletzt ${pct(w.wachstum)} Wachstum bei ${pct(w.inflation)} Inflation; der Franc ${w.franc >= 60 ? 'ist stabil' : w.franc >= 30 ? 'hält' : 'ist schwach'}${f.neuer_franc ? ', seit 1960 als Neuer Franc' : ''}.`);
  const a = aufloesung(s, 'Paris');
  if (a) absaetze.push(a);
  return { titel, text: absaetze.join('\n\n') };
}

export const ENDEN = {
  krieg: {
    titel: 'Der Krieg',
    ascii: 'pilz',
    text: s => `${s.weltflags.atomkrieg ? 'Es beginnt mit Kuba: Amerikanische Bomber greifen die sowjetischen Raketenstellungen an, Moskau antwortet in Berlin.' : 'Es beginnt in Deutschland, mit einem Zwischenfall, einem Missverständnis, einem Befehl, der zu spät widerrufen wird.'} Binnen Stunden fliegen die ersten Atomwaffen. Sowjetische Panzer stoßen durch Deutschland auf den Rhein vor; die französischen Divisionen in Baden werden überrollt.

Was Frankreich in fünfzehn Jahren aufgebaut hat, liegt in Trümmern. Das Spiel endet ${zeitText(s.zeit)}.`,
  },
  buergerkrieg: {
    titel: 'Der Bürgerkrieg',
    ascii: 'alarm',
    text: s => `Fallschirmjäger aus Algerien landen auf den Flugplätzen um Paris. In den Vororten errichten Arbeiter Barrikaden, Gendarmen und Soldaten schießen aufeinander, die Kommunisten rufen zum Generalstreik. Die Republik, die die Armee nicht mehr gehorchen ließ, versinkt in dem Bürgerkrieg, den sie seit 1958 gefürchtet hat.

Das Spiel endet ${zeitText(s.zeit)}.`,
  },
  staatsbankrott: {
    titel: 'Der Staatsbankrott',
    ascii: 'presse',
    text: s => `Zum dritten Mal sind die Kassen leer. Die Banque de France verweigert weitere Vorschüsse, Washington jede weitere Hilfe. Der Franc stürzt ab, die Franzosen tauschen ihr Geld in Gold und Napoléons. Die Regierung tritt zurück; niemand will ihre Nachfolge antreten.

Das Spiel endet ${zeitText(s.zeit)}.`,
  },
  abschluss: {
    titel: s => bericht(s).titel,
    ascii: 'eiffel',
    text: s => bericht(s).text,
  },
};
