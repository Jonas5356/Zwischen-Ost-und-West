// Spielstände: im Programm über die Rust-Seite als Dateien im Datenordner,
// im Browser (Entwicklung) über localStorage.

const tauri = () => window.__TAURI__?.core;

export async function speichere(name, daten) {
  const inhalt = JSON.stringify(daten);
  if (tauri()) return tauri().invoke('spielstand_speichern', { name, inhalt });
  try { localStorage.setItem('zow:' + name, inhalt); } catch { /* ohne Speicher spielen */ }
}

export async function lade(name) {
  try {
    const inhalt = tauri()
      ? await tauri().invoke('spielstand_laden', { name })
      : localStorage.getItem('zow:' + name);
    return inhalt ? JSON.parse(inhalt) : null;
  } catch {
    return null;
  }
}

export async function loesche(name) {
  if (tauri()) return tauri().invoke('spielstand_loeschen', { name }).catch(() => {});
  try { localStorage.removeItem('zow:' + name); } catch { /* egal */ }
}

/** Kurzinfo zu allen Speicherplätzen */
export async function plaetze(namen) {
  const out = [];
  for (const n of namen) {
    const s = await lade(n);
    out.push({ name: n, stand: s });
  }
  return out;
}

export function einstellungen() {
  const std = { hinweise: true, schreibmaschine: true, randvermerke: true, ton: true, laut: 0.6, geschichtstreue: 0.75 };
  try { return { ...std, ...JSON.parse(localStorage.getItem('zow:einstellungen') || '{}') }; } catch { return std; }
}
export function speichereEinstellungen(e) {
  try { localStorage.setItem('zow:einstellungen', JSON.stringify(e)); } catch { /* egal */ }
}
