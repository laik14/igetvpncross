# WireGuard Native Mobile

Cross-platform VPN shell for web, Android, and iOS/TestFlight builds.

## Web

```bash
npm install
npm run dev
```

Production web assets are generated into `dist`:

```bash
npm run build
```

## Android

The Android target is a Kotlin project in `android`.

```bash
npm run build
cd android
./gradlew assembleRelease
```

Signed releases need these environment variables:

- `ANDROID_KEYSTORE_PATH`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

## iOS

The iOS target is generated from `ios/App/project.yml` with XcodeGen.

```bash
npm run build
cd ios/App
xcodegen generate
open WireGuardNative.xcodeproj
```

For TestFlight, configure Apple Developer signing for:

- `com.wireguard.nativemobile`
- `com.wireguard.nativemobile.PacketTunnel`

See `docs/CODEMAGIC_SETUP.md` for cloud build setup.
