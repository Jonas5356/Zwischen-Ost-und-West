// Wer in London regiert: für Texte aller Länder. In London können andere regieren als damals,
// darum nennen Texte britische Politiker nach 1950 nur über diese Helfer.
import { REGIERUNGEN, istLabour } from './regierungen.js';

/** Regierung in London (für jede Landsicht, auch die britische) */
export const londonerRegime = s => s.welt?.laender.grossbritannien?.regime || 'attlee';
/** „Winston Churchill“ */
export const londonerChef = s => REGIERUNGEN[londonerRegime(s)].name;
/** „Churchill“ */
export const londonerChefKurz = s => REGIERUNGEN[londonerRegime(s)].kurz;
export const labourRegiert = s => istLabour(londonerRegime(s));

const AUSSEN = {
  bevin: ['Ernest Bevin', 'Bevin'], morrison: ['Herbert Morrison', 'Morrison'], eden: ['Anthony Eden', 'Eden'],
  macmillan: ['Harold Macmillan', 'Macmillan'], lloyd: ['Selwyn Lloyd', 'Selwyn Lloyd'], home: ['Lord Home', 'Home'],
  butler: ['R. A. Butler', 'Butler'], bevan: ['Aneurin Bevan', 'Bevan'], walker: ['Patrick Gordon Walker', 'Gordon Walker'],
};

function aussenId(r, z) {
  switch (r) {
    case 'attlee': return z < 1951.1 ? 'bevin' : 'morrison';
    case 'churchill': return 'eden';
    case 'eden': return z < 1956.1 ? 'macmillan' : 'lloyd';
    case 'macmillan': case 'butler': return z < 1960.2 ? 'lloyd' : 'home';
    case 'home': return 'butler';
    case 'gaitskell': return z < 1960.2 ? 'bevan' : 'walker';
    default: return 'walker';
  }
}
/** Der britische Außenminister: „Anthony Eden“ */
export const londonerAussen = s => AUSSEN[aussenId(londonerRegime(s), s.zeit)][0];
/** … und sein Nachname: „Eden“ */
export const londonerAussenKurz = s => AUSSEN[aussenId(londonerRegime(s), s.zeit)][1];

/** Der Schatzkanzler (nur in britischen Texten) */
export function schatzkanzler(s) {
  const z = s.zeit;
  switch (londonerRegime(s)) {
    case 'attlee': return z < 1948.1 ? 'Hugh Dalton' : z < 1950.2 ? 'Stafford Cripps' : 'Hugh Gaitskell';
    case 'churchill': return 'R. A. Butler';
    case 'eden': return z < 1956.1 ? 'R. A. Butler' : 'Harold Macmillan';
    case 'macmillan': return z < 1958.1 ? 'Peter Thorneycroft' : z < 1960.2 ? 'Derick Heathcoat-Amory' : z < 1962.2 ? 'Selwyn Lloyd' : 'Reginald Maudling';
    case 'gaitskell': return 'Harold Wilson';
    case 'wilson': return 'James Callaghan';
    default: return 'Reginald Maudling';
  }
}
