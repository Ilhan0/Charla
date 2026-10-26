import SwiftUI

@main
struct CharlaApp: App {
    var body: some Scene {
        WindowGroup {
            // Nur die Ränder (Statusleiste, Home-Indikator) ignorieren; die Tastatur schiebt die Ansicht weiterhin hoch.
            WebContainer()
                .ignoresSafeArea(.container)
        }
    }
}

/// Bettet den WebView-Controller in SwiftUI ein.
struct WebContainer: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> WebViewController {
        return WebViewController()
    }

    func updateUIViewController(_ uiViewController: WebViewController, context: Context) {}
}
