//! Zwischen Ost und West – Programmhülle.
//! Die Spiellogik liegt vollständig in `ui/`; hier werden nur Spielstände gespeichert
//! und Updates über GitHub-Releases geholt.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;
use tauri::Manager;

/// Ordner für Spielstände, z. B. %APPDATA%\io.github.jonas5356.zwischenostundwest\spielstaende
fn ordner(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("spielstaende");
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}

/// Nur einfache Namen wie "auto" oder "platz1" zulassen
fn datei(app: &tauri::AppHandle, name: &str) -> Result<PathBuf, String> {
    if name.is_empty() || name.len() > 32 || !name.chars().all(|c| c.is_ascii_alphanumeric()) {
        return Err("Ungültiger Name für den Spielstand".into());
    }
    Ok(ordner(app)?.join(format!("{name}.json")))
}

#[tauri::command]
fn spielstand_speichern(app: tauri::AppHandle, name: String, inhalt: String) -> Result<(), String> {
    let ziel = datei(&app, &name)?;
    // erst in eine temporäre Datei schreiben, dann umbenennen
    let tmp = ziel.with_extension("tmp");
    fs::write(&tmp, inhalt).map_err(|e| e.to_string())?;
    fs::rename(&tmp, &ziel).map_err(|e| e.to_string())
}

#[tauri::command]
fn spielstand_laden(app: tauri::AppHandle, name: String) -> Result<Option<String>, String> {
    let ziel = datei(&app, &name)?;
    if !ziel.exists() {
        return Ok(None);
    }
    fs::read_to_string(ziel).map(Some).map_err(|e| e.to_string())
}

#[tauri::command]
fn spielstand_loeschen(app: tauri::AppHandle, name: String) -> Result<(), String> {
    let ziel = datei(&app, &name)?;
    if ziel.exists() {
        fs::remove_file(ziel).map_err(|e| e.to_string())?;
    }
    Ok(())
}

// ---------------------------------------------------------------------------
// Updates über GitHub-Releases (latest.json, signiert)

/// Sucht nach einer neueren Version. Antwort: {verfuegbar, version, notizen}
#[tauri::command]
async fn update_pruefen(app: tauri::AppHandle) -> Result<serde_json::Value, String> {
    use tauri_plugin_updater::UpdaterExt;
    let neu = app
        .updater()
        .map_err(|e| e.to_string())?
        .check()
        .await
        .map_err(|e| format!("Suche nach Updates fehlgeschlagen: {e}"))?;
    Ok(match neu {
        Some(u) => serde_json::json!({ "verfuegbar": true, "version": u.version, "notizen": u.body }),
        None => serde_json::json!({ "verfuegbar": false }),
    })
}

/// Lädt die neue Version, installiert sie und startet das Programm neu.
#[tauri::command]
async fn update_installieren(app: tauri::AppHandle) -> Result<(), String> {
    use tauri_plugin_updater::UpdaterExt;
    let neu = app
        .updater()
        .map_err(|e| e.to_string())?
        .check()
        .await
        .map_err(|e| format!("Suche nach Updates fehlgeschlagen: {e}"))?;
    let Some(u) = neu else { return Ok(()) };
    u.download_and_install(|_, _| {}, || {})
        .await
        .map_err(|e| format!("Update fehlgeschlagen: {e}"))?;
    app.restart();
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            spielstand_speichern,
            spielstand_laden,
            spielstand_loeschen,
            update_pruefen,
            update_installieren
        ])
        .run(tauri::generate_context!())
        .expect("Programm konnte nicht gestartet werden");
}
