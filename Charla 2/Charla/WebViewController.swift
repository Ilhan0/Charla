import UIKit
import WebKit

/// Zeigt die Web-Oberfläche (Ordner „www“) in einem WKWebView und verbindet sie mit iOS:
/// Sprachausgabe, Spracherkennung, Haptik, Dark Mode und dauerhafte Speicherung.
final class WebViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler {

    private var webView: WKWebView!
    private let speech = SpeechBridge()
    private var pendingTheme = "auto"

    // MARK: Aufbau

    override func loadView() {
        let controller = WKUserContentController()
        controller.addUserScript(WKUserScript(source: bootScript(),
                                              injectionTime: .atDocumentStart,
                                              forMainFrameOnly: true))
        controller.add(WeakScriptHandler(target: self), name: "charla")

        let config = WKWebViewConfiguration()
        config.userContentController = controller
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []

        let web = WKWebView(frame: .zero, configuration: config)
        web.navigationDelegate = self
        web.allowsLinkPreview = false
        web.allowsBackForwardNavigationGestures = false
        web.isOpaque = false
        web.backgroundColor = UIColor(named: "LaunchBackground") ?? UIColor.systemBackground
        web.scrollView.backgroundColor = web.backgroundColor
        web.scrollView.contentInsetAdjustmentBehavior = .never
        web.scrollView.bounces = false
        web.scrollView.showsVerticalScrollIndicator = false
        web.scrollView.showsHorizontalScrollIndicator = false
        web.scrollView.pinchGestureRecognizer?.isEnabled = false

        webView = web
        view = web
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        speech.emit = { [weak self] event in
            self?.send(event)
        }

        let center = NotificationCenter.default
        center.addObserver(self, selector: #selector(appWillResignActive),
                           name: UIApplication.willResignActiveNotification, object: nil)

        loadApp()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        applyTheme(pendingTheme)
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    private func loadApp() {
        guard let www = Bundle.main.url(forResource: "www", withExtension: nil) else {
            webView.loadHTMLString("<h2 style='font-family:-apple-system;padding:24px'>Charla: Der Ordner „www“ fehlt im App-Paket.</h2>",
                                   baseURL: nil)
            return
        }
        let index = www.appendingPathComponent("index.html")
        webView.loadFileURL(index, allowingReadAccessTo: www)
    }

    /// Gibt der Seite beim Start den gespeicherten Lernstand mit.
    private func bootScript() -> String {
        let payload: [String: Any] = ["state": StateStore.shared.load()]
        guard let data = try? JSONSerialization.data(withJSONObject: payload, options: []),
              let json = String(data: data, encoding: .utf8) else {
            return ""
        }
        return "window.__CHARLA_NATIVE__ = \(json);"
    }

    // MARK: Nachrichten von der Seite

    func userContentController(_ userContentController: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let type = body["type"] as? String else { return }

        switch type {
        case "saveState":
            if let json = body["json"] as? String {
                StateStore.shared.save(json)
            }
        case "speak":
            speech.speak(id: intValue(body["id"]),
                         text: body["text"] as? String ?? "",
                         rate: doubleValue(body["rate"], fallback: 1.0),
                         pitch: doubleValue(body["pitch"], fallback: 1.0),
                         voice: body["voice"] as? String ?? "")
        case "stopSpeak":
            speech.stopSpeaking()
        case "voices":
            speech.sendVoices()
        case "listen":
            speech.listen(id: intValue(body["id"]), hint: body["hint"] as? String ?? "")
        case "stopListen":
            speech.stopListening(id: intValue(body["id"]))
        case "haptic":
            haptic(body["style"] as? String ?? "light")
        case "theme":
            applyTheme(body["value"] as? String ?? "auto")
        default:
            break
        }
    }

    private func intValue(_ any: Any?) -> Int {
        return (any as? NSNumber)?.intValue ?? 0
    }

    private func doubleValue(_ any: Any?, fallback: Double) -> Double {
        return (any as? NSNumber)?.doubleValue ?? fallback
    }

    // MARK: Nachrichten an die Seite

    func send(_ event: [String: Any]) {
        guard JSONSerialization.isValidJSONObject(event),
              let data = try? JSONSerialization.data(withJSONObject: event, options: []),
              let json = String(data: data, encoding: .utf8) else { return }
        let script = "if (window.CharlaNative) { window.CharlaNative.onEvent(\(json)); }"
        DispatchQueue.main.async { [weak self] in
            self?.webView.evaluateJavaScript(script, completionHandler: nil)
        }
    }

    // MARK: Haptik

    private func haptic(_ style: String) {
        switch style {
        case "success":
            let generator = UINotificationFeedbackGenerator()
            generator.notificationOccurred(.success)
        case "error":
            let generator = UINotificationFeedbackGenerator()
            generator.notificationOccurred(.error)
        case "warning":
            let generator = UINotificationFeedbackGenerator()
            generator.notificationOccurred(.warning)
        case "medium":
            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        case "heavy":
            UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
        default:
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        }
    }

    // MARK: Erscheinungsbild

    private func applyTheme(_ value: String) {
        pendingTheme = value
        let style: UIUserInterfaceStyle
        switch value {
        case "light": style = .light
        case "dark": style = .dark
        default: style = .unspecified
        }
        overrideUserInterfaceStyle = style
        view.window?.overrideUserInterfaceStyle = style
        let background = UIColor(named: "LaunchBackground") ?? UIColor.systemBackground
        webView.backgroundColor = background
        webView.scrollView.backgroundColor = background
    }

    // MARK: Lebenszyklus

    @objc private func appWillResignActive() {
        speech.stopSpeaking()
        speech.cancelRecordingInBackground()
        webView.evaluateJavaScript("if (window.Charla && window.Charla.store) { window.Charla.store.flush(); }",
                                   completionHandler: nil)
    }

    // MARK: WKNavigationDelegate

    func webView(_ webView: WKWebView,
                 decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if let url = navigationAction.request.url,
           let scheme = url.scheme?.lowercased(),
           scheme == "http" || scheme == "https" || scheme == "mailto" {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }

    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        loadApp()
    }
}

/// Verhindert, dass der Nachrichtenkanal den Controller festhält.
private final class WeakScriptHandler: NSObject, WKScriptMessageHandler {
    private weak var target: WKScriptMessageHandler?

    init(target: WKScriptMessageHandler) {
        self.target = target
        super.init()
    }

    func userContentController(_ userContentController: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        target?.userContentController(userContentController, didReceive: message)
    }
}
