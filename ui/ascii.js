// ASCII-Szenen. Eine Szene ist entweder ein Text (wird zeilenweise aufgebaut)
// oder { bilder: [...], ms } (wird als kleine Animation abgespielt).

const bundeshaus = String.raw`
            _______________________________________
           |  ___   ___   ___   ___   ___   ___   |
           | |   | |   | |   | |   | |   | |   |  |
     ______| |___| |___| |___| |___| |___| |___|  |______
    |      |                                      |      |
    |  []  |   [] [] [] [] [] [] [] [] [] [] []   |  []  |
    |______|______________________________________|______|
 ~~~~~~~~~~~~~~~~~~~~~~~~~~ Rhein ~~~~~~~~~~~~~~~~~~~~~~~~~~`;

const note = String.raw`
     .--------------------------------------------.
     |  NOTE DER REGIERUNG DER UdSSR              |
     |  ----------------------------------------  |
     |  ... Deutschland wird als einheitlicher    |
     |  Staat wiederhergestellt ...               |
     |                          ___               |
     |                         (CCCP)             |
     '--------------------------------------------'`;

const kreml = String.raw`
                 *                    *
                /^\        /\        /^\
               |   |      /  \      |   |
               |[ ]|     | [] |     |[ ]|
          _____|   |_____|    |_____|   |_____
         |  []    []    []  ||  []    []    [] |
         |____________________________________|`;

const plakat = String.raw`
       ___________________________________
      |                                   |
      |    ALLE WEGE DES MARXISMUS        |
      |    FÜHREN NACH MOSKAU             |
      |               ___                 |
      |              (o o)     DARUM CDU  |
      |___________________________________|
                    ||        ||`;

const urne = String.raw`
                   _________________
                  |   _____________ |
                  |  |  STIMMZETTEL| |
                  |  |   (X) CDU   | |
                   \_|_____________|/
                 ____|___________|____
                |    WAHLURNE         |
                |_____________________|`;

const flagge = {
  ms: 320,
  bilder: [String.raw`
           |~~~~~~~~~~~~~~~~
           |################
           |::::::::::::::::
           |................
           |
           |
     ______|______`, String.raw`
           |~~~~~~~~~~~~~~~~~~
           | ##################
           |  ::::::::::::::::::
           | ..................
           |
           |
     ______|______`],
};

const sputnik = {
  ms: 260,
  bilder: [
    String.raw`
                          *             .
        .        o-<>-o                       *
                   \                .
      *              \       ____
                       \    /    \        .
         .               \ | Erde |
                            \____/      *     `,
    String.raw`
                          *             .
        .                     o-<>-o          *
                             /      .
      *                    /  ____
                         /   /    \        .
         .                  | Erde |
                             \____/      *    `,
    String.raw`
                          *             .
        .                                     *
                                    .
      *                       ____     o-<>-o
                             /    \  /     .
         .                  | Erde |
                             \____/      *    `,
  ],
};

const mauer = {
  ms: 380,
  bilder: [0, 1, 2, 3, 4, 5].map(n => {
    const reihen = [];
    for (let i = 5; i >= 0; i--) {
      const versatz = i % 2 ? '  ' : '';
      reihen.push(i < n ? '     ' + versatz + '[__]'.repeat(11) : '');
    }
    return `\n   WEST                                    OST\n${reihen.join('\n')}\n   ~~~~~~~~~~~ Potsdamer Platz, 13. August 1961 ~~~~~~~~~~~`;
  }),
};

const berlin = String.raw`
                          _|_
                         |   |
                         | o |        Funkturm
              ___        |   |          /\
             |   |_______|   |_________/  \______
             | B E R L I N                       |
             |___________________________________|
         ====[ Interzonen-Autobahn ]=================`;

const korea = String.raw`
           .----------------------------.
           |   38. BREITENGRAD          |
           |   ------------------------ |
           |      N  ^ ^ ^ ^ ^ ^        |
           |   ===================      |
           |      S        >>>          |
           '----------------------------'`;

const schiff = {
  ms: 400,
  bilder: [String.raw`
                       |    |
                     __|____|__
             ______/__________\_______
             \  o  o  o  o  o  o  o  /
      ~~~~~~~~\_____________________/~~~~~~~~~~~
         ~~~~      ~~~~~      ~~~~~      ~~~~`, String.raw`
                       |    |
                     __|____|__
             ______/__________\_______
             \  o  o  o  o  o  o  o  /
      ~~~~~~~~~\_____________________/~~~~~~~~~
       ~~~~      ~~~~~      ~~~~~      ~~~~~`],
};

const aufstand = String.raw`
          o    o  \o/   o    \o/   o    o
         /|\  /|\  |   /|\    |   /|\  /|\
         / \  / \ / \  / \   / \  / \  / \
       ___________________________________
        [####]>          [####]>
         (oo)             (oo)`;

const presse = String.raw`
       .---------------------------------------.
       |  DER SPIEGEL                          |
       |  =================================    |
       |  BEDINGT ABWEHRBEREIT                 |
       |  ---------------------                |
       |  ~~~~~~~~~~ ~~~~~~~ ~~~~~~~~~~~~~     |
       '---------------------------------------'`;

const flut = {
  ms: 300,
  bilder: [
    String.raw`
           _[]_      _[]_
          |    |    |    |   ___
      ~~~~|____|~~~~|____|~~|___|~~~~~~~~
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,
    String.raw`
           _[]_      _[]_
          |    |    |    |
      ~~~~|~~~~|~~~~|~~~~|~~~~~~~~~~~~~~~~~
     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,
  ],
};

const rakete = {
  ms: 240,
  bilder: [6, 4, 2, 0].map(h => {
    const luft = '\n'.repeat(h);
    return `${luft}
                     /\\
                    |  |
                    |CU|        KUBA
                   /|__|\\
                     ''
           ____________________________`;
  }),
};

const alarm = {
  ms: 450,
  bilder: [String.raw`
        !!!  !!!  !!!  !!!  !!!  !!!  !!!
       ___________________________________
      |   ALARMSTUFE  --  FULDA-LÜCKE     |
      |___________________________________|
        !!!  !!!  !!!  !!!  !!!  !!!  !!!`, String.raw`

       ___________________________________
      |   ALARMSTUFE  --  FULDA-LÜCKE     |
      |___________________________________|
                                           `],
};

const pilz = {
  ms: 500,
  bilder: [
    String.raw`



                      .
                    _.-._
      ____________ (_____) ____________`,
    String.raw`

                    _.---._
                  (         )
                   '--. .--'
                      | |
      ______________ (___) ______________`,
    String.raw`
                 _.-~~~~~-._
              .-'           '-.
             (                 )
              '-._    |    _.-'
                   |  |  |
                   |  |  |
      ____________(_______)____________`,
  ],
};

export const SZENEN = {
  bundeshaus, note, kreml, plakat, urne, flagge, sputnik, mauer, berlin, korea, schiff,
  aufstand, presse, flut, rakete, alarm, pilz,
};

/** Spielt eine Szene in einem <pre> ab. Gibt eine Funktion zum Abbrechen zurück. */
export function spieleSzene(pre, name, { bewegung = true } = {}) {
  const sz = SZENEN[name];
  if (!sz) { pre.hidden = true; return () => {}; }
  pre.hidden = false;
  const timer = [];
  if (typeof sz === 'string') {
    const zeilen = sz.replace(/^\n/, '').split('\n');
    if (!bewegung) { pre.textContent = zeilen.join('\n'); return () => {}; }
    pre.textContent = '';
    zeilen.forEach((z, i) => timer.push(setTimeout(() => {
      pre.textContent = zeilen.slice(0, i + 1).join('\n');
    }, 70 * i)));
    return () => timer.forEach(clearTimeout);
  }
  const bilder = sz.bilder.map(b => b.replace(/^\n/, ''));
  if (!bewegung) { pre.textContent = bilder[bilder.length - 1]; return () => {}; }
  let i = 0;
  pre.textContent = bilder[0];
  // Bewegte Szenen laufen einige Runden und bleiben dann auf dem letzten Bild stehen
  const runden = name === 'mauer' || name === 'rakete' || name === 'pilz' ? 1 : 4;
  const gesamt = bilder.length * runden;
  const iv = setInterval(() => {
    i++;
    if (i >= gesamt) { clearInterval(iv); pre.textContent = bilder[bilder.length - 1]; return; }
    pre.textContent = bilder[i % bilder.length];
  }, sz.ms || 300);
  return () => clearInterval(iv);
}
