// Weltereignisse: geschehen ohne Entscheidung eines Landes und setzen Weltflags.
// Länder können darauf mit eigenen Ereignissen reagieren (Bedingung über s.weltflags).
export default [
  { id: 'koreakrieg', ab: 1950.2, aktion: (welt, a) => a.weltflag('koreakrieg') },
  { id: 'koreakrieg_ende', ab: 1953.2, aktion: (welt, a) => { a.weltflag('koreakrieg', false); a.weltflag('waffenstillstand_korea'); } },
  { id: 'stalin_tot', ab: 1953.1, aktion: (welt, a) => a.weltflag('stalin_tot') },
  { id: 'sputnik', ab: 1957.2, aktion: (welt, a) => a.weltflag('sputnik') },
];
