import Foundation
import AVFoundation
import Speech

/// Sprachausgabe (AVSpeechSynthesizer) und Spracherkennung (SFSpeechRecognizer) für die Web-Oberfläche.
/// Alle Methoden müssen auf dem Main-Thread aufgerufen werden.
final class SpeechBridge: NSObject, AVSpeechSynthesizerDelegate {

    /// Wird mit Ereignissen für die Web-Oberfläche aufgerufen (type: speakEnd / voices / listen).
    var emit: (([String: Any]) -> Void)?

    // MARK: Sprachausgabe

    private let synthesizer = AVSpeechSynthesizer()
    private var utteranceIds: [ObjectIdentifier: Int] = [:]

    // MARK: Spracherkennung

    private let recognizer = SFSpeechRecognizer(locale: Locale(identifier: "es-ES"))
    private var audioEngine: AVAudioEngine?
    private var request: SFSpeechAudioBufferRecognitionRequest?
    private var task: SFSpeechRecognitionTask?
    private var activeListenId = 0
    private var lastText = ""
    private var silenceTimer: Timer?
    private var startTimer: Timer?
    private var hardLimitTimer: Timer?
    private var fallbackTimer: Timer?

    override init() {
        super.init()
        synthesizer.delegate = self
        configurePlaybackSession()
    }

    // MARK: Audio-Sitzung

    private func configurePlaybackSession() {
        let session = AVAudioSession.sharedInstance()
        do {
            try session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try session.setActive(true)
        } catch {
            // Ton läuft notfalls mit den Standardeinstellungen weiter.
        }
    }

    private func configureRecordingSession() throws {
        let session = AVAudioSession.sharedInstance()
        try session.setCategory(.playAndRecord, mode: .measurement, options: [.duckOthers, .defaultToSpeaker])
        try session.setActive(true, options: .notifyOthersOnDeactivation)
    }

    // MARK: Stimmen

    private func spanishVoices() -> [AVSpeechSynthesisVoice] {
        return AVSpeechSynthesisVoice.speechVoices().filter { $0.language.hasPrefix("es") }
    }

    private func languageRank(_ language: String) -> Int {
        if language == "es-ES" { return 0 }
        if language == "es-MX" || language == "es-US" || language == "es-419" { return 1 }
        return 2
    }

    private func bestVoice(preferred: String) -> AVSpeechSynthesisVoice? {
        if !preferred.isEmpty, let chosen = AVSpeechSynthesisVoice(identifier: preferred) {
            return chosen
        }
        let sorted = spanishVoices().sorted { a, b in
            let ra = languageRank(a.language)
            let rb = languageRank(b.language)
            if ra != rb { return ra < rb }
            return a.quality.rawValue > b.quality.rawValue
        }
        return sorted.first ?? AVSpeechSynthesisVoice(language: "es-ES")
    }

    func sendVoices() {
        var list: [[String: Any]] = []
        for voice in spanishVoices() {
            list.append([
                "id": voice.identifier,
                "name": voice.name,
                "lang": voice.language,
                "quality": voice.quality.rawValue
            ])
        }
        emit?(["type": "voices", "voices": list])
    }

    // MARK: Sprechen

    func speak(id: Int, text: String, rate: Double, pitch: Double, voice: String) {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty {
            emit?(["type": "speakEnd", "id": id])
            return
        }
        let utterance = AVSpeechUtterance(string: trimmed)
        utterance.voice = bestVoice(preferred: voice)
        let scaled = Double(AVSpeechUtteranceDefaultSpeechRate) * rate
        utterance.rate = Float(min(0.65, max(0.15, scaled)))
        utterance.pitchMultiplier = Float(min(2.0, max(0.5, pitch)))
        utterance.volume = 1.0
        utteranceIds[ObjectIdentifier(utterance)] = id
        synthesizer.speak(utterance)
    }

    func stopSpeaking() {
        if synthesizer.isSpeaking || synthesizer.isPaused {
            synthesizer.stopSpeaking(at: .immediate)
        }
    }

    private func utteranceEnded(_ utterance: AVSpeechUtterance) {
        let key = ObjectIdentifier(utterance)
        guard let id = utteranceIds.removeValue(forKey: key) else { return }
        emit?(["type": "speakEnd", "id": id])
    }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        DispatchQueue.main.async { self.utteranceEnded(utterance) }
    }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        DispatchQueue.main.async { self.utteranceEnded(utterance) }
    }

    // MARK: Zuhören

    func listen(id: Int, hint: String) {
        cancelListening()
        activeListenId = id
        lastText = ""

        guard let recognizer = recognizer, recognizer.isAvailable else {
            failListening(id: id, code: "service-not-allowed")
            return
        }

        SFSpeechRecognizer.requestAuthorization { status in
            DispatchQueue.main.async {
                guard self.activeListenId == id else { return }
                guard status == .authorized else {
                    self.failListening(id: id, code: "not-allowed")
                    return
                }
                AVAudioSession.sharedInstance().requestRecordPermission { granted in
                    DispatchQueue.main.async {
                        guard self.activeListenId == id else { return }
                        guard granted else {
                            self.failListening(id: id, code: "not-allowed")
                            return
                        }
                        self.beginListening(id: id, hint: hint)
                    }
                }
            }
        }
    }

    private func beginListening(id: Int, hint: String) {
        guard let recognizer = recognizer else {
            failListening(id: id, code: "service-not-allowed")
            return
        }
        stopSpeaking()

        do {
            try configureRecordingSession()
        } catch {
            failListening(id: id, code: "audio-capture")
            return
        }

        let request = SFSpeechAudioBufferRecognitionRequest()
        request.shouldReportPartialResults = true
        if !hint.isEmpty {
            var words: [String] = [hint]
            for part in hint.split(separator: " ") {
                let word = String(part).trimmingCharacters(in: .punctuationCharacters)
                if !word.isEmpty && !words.contains(word) { words.append(word) }
            }
            request.contextualStrings = Array(words.prefix(50))
        }

        let engine = AVAudioEngine()
        let input = engine.inputNode
        let format = input.outputFormat(forBus: 0)
        guard format.sampleRate > 0 else {
            failListening(id: id, code: "audio-capture")
            return
        }
        input.installTap(onBus: 0, bufferSize: 1024, format: format) { buffer, _ in
            request.append(buffer)
        }
        engine.prepare()
        do {
            try engine.start()
        } catch {
            input.removeTap(onBus: 0)
            failListening(id: id, code: "audio-capture")
            return
        }

        audioEngine = engine
        self.request = request

        task = recognizer.recognitionTask(with: request) { [weak self] result, error in
            DispatchQueue.main.async {
                self?.handleRecognition(id: id, result: result, error: error)
            }
        }

        // Keine Sprache innerhalb von 7 Sekunden: aufhören. Harte Obergrenze: 15 Sekunden.
        startTimer = Timer.scheduledTimer(withTimeInterval: 7.0, repeats: false) { [weak self] _ in
            guard let self = self, self.activeListenId == id, self.lastText.isEmpty else { return }
            self.finishListening(id: id, text: "")
        }
        hardLimitTimer = Timer.scheduledTimer(withTimeInterval: 15.0, repeats: false) { [weak self] _ in
            guard let self = self, self.activeListenId == id else { return }
            self.finishListening(id: id, text: self.lastText)
        }
    }

    private func handleRecognition(id: Int, result: SFSpeechRecognitionResult?, error: Error?) {
        guard activeListenId == id else { return }

        if let result = result {
            let text = result.bestTranscription.formattedString
            lastText = text
            if result.isFinal {
                finishListening(id: id, text: text)
                return
            }
            emit?(["type": "listen", "id": id, "phase": "partial", "text": text])
            // Nach 1,8 Sekunden Stille ist der Satz zu Ende.
            silenceTimer?.invalidate()
            silenceTimer = Timer.scheduledTimer(withTimeInterval: 1.8, repeats: false) { [weak self] _ in
                guard let self = self, self.activeListenId == id else { return }
                self.endAudioInput()
                self.scheduleFallback(id: id)
            }
        }

        if let error = error {
            if !lastText.isEmpty {
                // Mit erkanntem Text gilt der Abbruch als normales Ende.
                finishListening(id: id, text: lastText)
            } else if (error as NSError).domain == NSURLErrorDomain {
                // Der Erkenner braucht Internet und erreicht den Dienst nicht.
                failListening(id: id, code: "network")
            } else {
                // Meist „keine Sprache erkannt“: die Oberfläche bittet um einen neuen Versuch.
                finishListening(id: id, text: "")
            }
        }
    }

    /// Wird von der Oberfläche aufgerufen, wenn der Nutzer das Mikrofon erneut antippt.
    func stopListening(id: Int) {
        guard activeListenId == id, id != 0 else { return }
        if audioEngine != nil {
            endAudioInput()
            scheduleFallback(id: id)
        } else {
            finishListening(id: id, text: "")
        }
    }

    private func endAudioInput() {
        audioEngine?.stop()
        audioEngine?.inputNode.removeTap(onBus: 0)
        request?.endAudio()
    }

    /// Falls der Erkenner nach dem Ende der Aufnahme kein Endergebnis liefert.
    private func scheduleFallback(id: Int) {
        fallbackTimer?.invalidate()
        fallbackTimer = Timer.scheduledTimer(withTimeInterval: 1.5, repeats: false) { [weak self] _ in
            guard let self = self, self.activeListenId == id else { return }
            self.finishListening(id: id, text: self.lastText)
        }
    }

    private func finishListening(id: Int, text: String) {
        guard activeListenId == id else { return }
        teardownListening()
        activeListenId = 0
        emit?(["type": "listen", "id": id, "phase": "final", "text": text])
    }

    private func failListening(id: Int, code: String) {
        guard activeListenId == id else { return }
        teardownListening()
        activeListenId = 0
        emit?(["type": "listen", "id": id, "phase": "error", "code": code])
    }

    /// Beendet eine laufende Aufnahme, wenn die App in den Hintergrund geht.
    /// Wartet die App nur auf die Erlaubnis (Abfrage von iOS), bleibt der Versuch bestehen.
    func cancelRecordingInBackground() {
        if audioEngine != nil {
            cancelListening()
        }
    }

    /// Bricht eine Aufnahme ab und meldet der Oberfläche ein leeres Ergebnis.
    func cancelListening() {
        if activeListenId != 0 {
            let id = activeListenId
            teardownListening()
            activeListenId = 0
            emit?(["type": "listen", "id": id, "phase": "final", "text": ""])
        }
    }

    private func teardownListening() {
        silenceTimer?.invalidate(); silenceTimer = nil
        startTimer?.invalidate(); startTimer = nil
        hardLimitTimer?.invalidate(); hardLimitTimer = nil
        fallbackTimer?.invalidate(); fallbackTimer = nil

        if let engine = audioEngine {
            if engine.isRunning { engine.stop() }
            engine.inputNode.removeTap(onBus: 0)
        }
        audioEngine = nil
        request?.endAudio()
        request = nil
        task?.cancel()
        task = nil
        lastText = ""
        configurePlaybackSession()
    }
}
