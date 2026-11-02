// Updates über GitHub-Releases. Nur im installierten Programm (Tauri); im Browser ohne Funktion.

const tauri = () => window.__TAURI__;

export const verfuegbar = () => !!tauri()?.core;

/** Installierte Version, z. B. "0.3.0" (im Browser null) */
export async function version() {
  try { return await tauri()?.app?.getVersion?.() ?? null; } catch { return null; }
}

/** { verfuegbar: bool, version?, notizen? }; wirft bei Netzwerkfehlern */
export async function pruefen() {
  if (!verfuegbar()) return { verfuegbar: false };
  return tauri().core.invoke('update_pruefen');
}

/** Lädt, installiert und startet neu (kehrt bei Erfolg nicht zurück) */
export async function installieren() {
  return tauri().core.invoke('update_installieren');
}
