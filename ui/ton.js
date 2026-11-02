// Geräusche, synthetisch erzeugt (keine Tondateien): Schreibmaschine, Glocke,
// Stempel, Papier und Fernschreiber.

let ctx = null;
let haupt = null;
let rauschen = null;
let an = true;
let lautstaerke = 0.6;

function bereit() {
  if (!an) return false;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { an = false; return false; }
    ctx = new AC();
    haupt = ctx.createGain();
    haupt.gain.value = lautstaerke;
    haupt.connect(ctx.destination);
    // eine Sekunde weißes Rauschen als Rohmaterial
    rauschen = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = rauschen.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  return true;
}

export function einstellen({ ton, laut }) {
  if (ton !== undefined) an = !!ton;
  if (laut !== undefined) lautstaerke = laut;
  if (haupt) haupt.gain.value = lautstaerke;
}

function huelle(gain, t, spitze, anstieg, abfall) {
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(spitze, t + anstieg);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + anstieg + abfall);
}

function rauschStoss(t, { frequenz, q = 1, typ = 'bandpass', spitze, abfall, dauer = abfall + 0.02 }) {
  const quelle = ctx.createBufferSource();
  quelle.buffer = rauschen;
  const filter = ctx.createBiquadFilter();
  filter.type = typ;
  filter.frequency.value = frequenz;
  filter.Q.value = q;
  const g = ctx.createGain();
  huelle(g, t, spitze, 0.001, abfall);
  quelle.connect(filter).connect(g).connect(haupt);
  quelle.start(t, Math.random() * 0.5, dauer);
  return filter;
}

function ton(t, { frequenz, typ = 'sine', spitze, abfall, anstieg = 0.002 }) {
  const o = ctx.createOscillator();
  o.type = typ;
  o.frequency.value = frequenz;
  const g = ctx.createGain();
  huelle(g, t, spitze, anstieg, abfall);
  o.connect(g).connect(haupt);
  o.start(t);
  o.stop(t + anstieg + abfall + 0.05);
}

/** Ein Tastenanschlag: heller Klack des Typenhebels plus dumpfer Aufschlag auf die Walze */
export function taste(staerke = 1) {
  if (!bereit()) return;
  const t = ctx.currentTime;
  const v = staerke * (0.75 + Math.random() * 0.5);
  rauschStoss(t, { frequenz: 2600 + Math.random() * 1600, q: 1.4, spitze: 0.5 * v, abfall: 0.025 });
  ton(t + 0.004, { frequenz: 140 + Math.random() * 60, typ: 'triangle', spitze: 0.25 * v, abfall: 0.03 });
}

/** Leertaste klingt tiefer */
export function leertaste() {
  if (!bereit()) return;
  const t = ctx.currentTime;
  rauschStoss(t, { frequenz: 1200, q: 0.8, spitze: 0.35, abfall: 0.04 });
}

/** Die Glocke vor dem Zeilenende, danach der Wagenrücklauf */
export function glocke() {
  if (!bereit()) return;
  const t = ctx.currentTime;
  ton(t, { frequenz: 2093, spitze: 0.22, abfall: 0.9 });
  ton(t, { frequenz: 3140, spitze: 0.08, abfall: 0.5 });
  const f = rauschStoss(t + 0.18, { frequenz: 900, q: 0.7, spitze: 0.12, abfall: 0.32, dauer: 0.36 });
  f.frequency.setValueAtTime(700, t + 0.18);
  f.frequency.linearRampToValueAtTime(2000, t + 0.48);
  rauschStoss(t + 0.52, { frequenz: 1800, q: 1.2, spitze: 0.4, abfall: 0.04 });
}

/** Stempel: dumpfer Schlag mit kurzem Holzklang */
export function stempel() {
  if (!bereit()) return;
  const t = ctx.currentTime;
  ton(t, { frequenz: 80, typ: 'sine', spitze: 0.6, abfall: 0.16 });
  rauschStoss(t, { frequenz: 500, typ: 'lowpass', q: 0.7, spitze: 0.5, abfall: 0.09 });
  rauschStoss(t + 0.005, { frequenz: 2400, q: 2, spitze: 0.15, abfall: 0.03 });
}

/** Papier wird umgeblättert */
export function blatt() {
  if (!bereit()) return;
  const t = ctx.currentTime;
  const f = rauschStoss(t, { frequenz: 1500, q: 0.6, spitze: 0.1, abfall: 0.28, dauer: 0.32 });
  f.frequency.setValueAtTime(900, t);
  f.frequency.exponentialRampToValueAtTime(4500, t + 0.25);
}

/** Fernschreiber: schnelle, gleichmäßige Anschläge */
export function fernschreiber(dauer = 1.2) {
  if (!bereit()) return;
  const t0 = ctx.currentTime;
  for (let x = 0; x < dauer; x += 0.045 + Math.random() * 0.02) {
    rauschStoss(t0 + x, { frequenz: 3200 + Math.random() * 800, q: 2, spitze: 0.18, abfall: 0.018 });
    ton(t0 + x, { frequenz: 220, typ: 'square', spitze: 0.03, abfall: 0.015 });
  }
}
