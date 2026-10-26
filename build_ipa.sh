#!/bin/bash
# Baut Charla.ipa (unsigniert) auf einem Mac mit Xcode.
# Voraussetzungen: Xcode (inkl. Command Line Tools) und XcodeGen (brew install xcodegen)
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v xcodegen >/dev/null 2>&1; then
  echo "XcodeGen fehlt. Installiere es mit: brew install xcodegen"
  exit 1
fi

echo "==> Xcode-Projekt erzeugen"
mkdir -p Config
xcodegen generate

echo "==> App für iPhone-Geräte bauen (ohne Signatur)"
rm -rf build Charla.ipa
xcodebuild \
  -project Charla.xcodeproj \
  -scheme Charla \
  -configuration Release \
  -sdk iphoneos \
  -derivedDataPath build/DerivedData \
  ONLY_ACTIVE_ARCH=NO \
  CODE_SIGNING_ALLOWED=NO \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGN_IDENTITY="" \
  build

APP=$(find build/DerivedData/Build/Products -maxdepth 2 -name "Charla.app" | head -n 1)
if [ -z "$APP" ]; then
  echo "Fehler: Charla.app wurde nicht gefunden."
  exit 1
fi

echo "==> IPA verpacken"
mkdir -p build/Payload
cp -R "$APP" build/Payload/
(cd build && zip -qry ../Charla.ipa Payload)

echo ""
echo "Fertig: $(pwd)/Charla.ipa"
echo "Hinweis: Die IPA ist nicht signiert. Zum Installieren z. B. mit Sideloadly oder AltStore"
echo "mit deiner Apple-ID signieren (siehe README.md)."
