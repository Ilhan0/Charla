import Foundation

/// Speichert den Lernstand als JSON-Datei im Documents-Ordner der App.
/// Der Ordner ist über die Dateien-App sichtbar (UIFileSharingEnabled), so lässt sich der Stand sichern.
final class StateStore {
    static let shared = StateStore()

    private let queue = DispatchQueue(label: "charla.statestore", qos: .utility)
    private let fileURL: URL

    private init() {
        let fm = FileManager.default
        let base = fm.urls(for: .documentDirectory, in: .userDomainMask).first ?? fm.temporaryDirectory
        fileURL = base.appendingPathComponent("charla-lernstand.json")
    }

    /// Liefert den gespeicherten Stand oder einen leeren String.
    func load() -> String {
        guard let data = try? Data(contentsOf: fileURL),
              let text = String(data: data, encoding: .utf8) else {
            return ""
        }
        return text
    }

    /// Schreibt den Stand atomar im Hintergrund.
    func save(_ json: String) {
        let url = fileURL
        queue.async {
            guard let data = json.data(using: .utf8) else { return }
            try? data.write(to: url, options: [.atomic])
        }
    }
}
