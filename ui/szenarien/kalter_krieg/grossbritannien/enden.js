// Großbritannien: Enden des Spiels und der Abschlussbericht
import { zeitText } from '../../../engine.js';
import { PARTEIEN, premier, labour, mehrheit } from './modell.js';
import { aufloesung } from '../aufloesung.js';

const pct = x => `${x.toFixed(1).replace('.', ',')} %`;

/** Alle Premierminister mit Amtszeit */
function chefText(s) {
  const l = s.chefliste || [];
  return l.map((c, i) => {
    const bis = l[i + 1]?.ab;
    const zeit = bis ? (c.ab === bis ? zeitText(c.ab) : `${zeitText(c.ab)}–${zeitText(bis)}`) : `seit ${zeitText(c.ab)}`;
    return `${c.name} (${PARTEIEN[c.partei]?.kurz || c.partei}), ${zeit}`;
  }).join('; ');
}

function bericht(s) {
  const f = s.f;
  const w = s.w;
  const absaetze = [];
  const titel = w.empire >= 50 ? 'Ein Weltreich, noch immer' : f.ewg_mitglied ? 'Großbritannien in Europa' : 'Großbritannien nach dem Empire';

  absaetze.push(`Frühjahr 1964. Premierminister ist ${premier(s)} an der Spitze einer ${s.koalition ? 'Regierung mit den Liberalen' : labour(s) ? 'Labour-Regierung' : 'konservativen Regierung'}${mehrheit(s) > 0 ? ` mit ${mehrheit(s)} Sitzen Mehrheit` : ' ohne eigene Mehrheit'}.`);
  const wahlen = (s.wahlen || []).map(e => {
    const sieger = e.sitze.CON > e.sitze.LAB ? 'CON' : 'LAB';
    return `${zeitText(e.zeit)}: ${PARTEIEN[sieger].kurz} (${e.sitze[sieger]} Sitze)`;
  });
  absaetze.push(`Seit 1946 hatte Großbritannien ${(s.chefliste || []).length} Premierminister: ${chefText(s)}.${wahlen.length ? `\n\nUnterhauswahlen: ${wahlen.join('; ')}.` : ''} In der Geschichte regierte Labour bis 1951, dann dreizehn Jahre lang die Konservativen.`);

  const empire = [];
  if (f.indien_frei) empire.push('Indien und Pakistan sind unabhängig');
  else if (f.indien_gehalten) empire.push('Indien ist noch immer britisch');
  if (f.afrika_frei) empire.push('die meisten Kolonien in Afrika sind selbständig geworden');
  else if (f.afrika_gehalten) empire.push('London hält an seinen afrikanischen Kolonien fest');
  if (f.malaya_ende) empire.push('Malaya ist unabhängig');
  if (f.zypern_ende) empire.push('Zypern hat seine Unabhängigkeit');
  absaetze.push(`Das Empire: ${empire.length ? empire.join(', ') + '. ' : ''}Sein Zusammenhalt liegt bei ${Math.round(w.empire)} von 100${w.empire >= 50 ? ' – mehr, als in der Geschichte übrig blieb' : ''}.`);

  const europa = f.ewg_mitglied ? 'Großbritannien ist Mitglied der Europäischen Wirtschaftsgemeinschaft.'
    : f.montanunion ? 'Großbritannien gehört der Montanunion an.'
      : f.veto ? 'Der Antrag auf Beitritt zur EWG ist an einem Veto aus Paris gescheitert.'
        : f.efta ? 'Großbritannien führt die Freihandelszone der „äußeren Sieben“ an, steht aber außerhalb der EWG.'
          : 'Großbritannien hält sich von der europäischen Einigung fern.';
  absaetze.push(`Europa: ${europa} Washington sieht London ${w.usa >= 75 ? 'als engsten Verbündeten' : w.usa >= 55 ? 'als verlässlichen Partner' : 'mit Misstrauen'}.`);
  absaetze.push(`Die Bombe: ${f.atommacht ? `Großbritannien ist Atommacht${f.nassau ? ', mit amerikanischen Polaris-Raketen' : ''}.` : f.atomprogramm ? 'Großbritannien arbeitet an einer eigenen Bombe.' : 'Großbritannien hat auf eigene Atomwaffen verzichtet.'}`);
  absaetze.push(`Wirtschaft: zuletzt ${pct(w.wachstum)} Wachstum bei ${pct(w.inflation)} Inflation und ${pct(w.arbeitslosigkeit)} Arbeitslosen; das Pfund ${w.pfund >= 60 ? 'ist stabil' : w.pfund >= 30 ? 'hält' : 'ist schwach'}${f.pfundkrisen ? `, nach ${f.pfundkrisen === 1 ? 'einer Krise' : f.pfundkrisen + ' Krisen'}` : ''}. Mit den Gewerkschaften kommt die Regierung ${w.gewerkschaften >= 60 ? 'gut' : w.gewerkschaften >= 35 ? 'leidlich' : 'schlecht'} aus.`);
  const a = aufloesung(s, 'London');
  if (a) absaetze.push(a);
  return { titel, text: absaetze.join('\n\n') };
}

export const ENDEN = {
  krieg: {
    titel: 'Der Krieg',
    ascii: 'pilz',
    text: s => `${s.weltflags.atomkrieg ? 'Es beginnt mit Kuba: Amerikanische Bomber greifen die sowjetischen Raketenstellungen an, Moskau antwortet in Berlin.' : `Es beginnt ${s.zeit < 1950 ? 'in Berlin' : 'in Deutschland'}, mit einem Zwischenfall, einem Missverständnis, einem Befehl, der zu spät widerrufen wird.`} Binnen Stunden fliegen die ersten Atomwaffen. Die Rheinarmee wird in der Norddeutschen Tiefebene überrollt; sowjetische Bomber erreichen die Flugplätze in East Anglia, auf denen amerikanische Atombomber stehen.

Was Großbritannien seit dem Krieg aufgebaut hat, liegt in Trümmern. Das Spiel endet ${zeitText(s.zeit)}.`,
  },
  abschluss: {
    titel: s => bericht(s).titel,
    ascii: 'bigben',
    text: s => bericht(s).text,
  },
};
