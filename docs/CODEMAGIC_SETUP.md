# Codemagic setup

Use GitHub login in Codemagic and add the repository `laik14/igetvpncross`.

## Android

Create an environment variable group named `android_credentials`.

Required for signed release builds:

- `ANDROID_KEYSTORE_BASE64`: base64-encoded `.jks` or `.keystore` file.
- `ANDROID_KEYSTORE_PASSWORD`: keystore password.
- `ANDROID_KEY_ALIAS`: key alias.
- `ANDROID_KEY_PASSWORD`: key password.

If the keystore group is missing, the workflow can still build an unsigned release artifact, but it cannot be uploaded to Google Play.

## iOS / TestFlight

Required Apple-side setup:

- Active Apple Developer Program membership.
- App Store Connect app record for `com.wireguard.nativemobile`.
- Bundle IDs:
  - `com.wireguard.nativemobile`
  - `com.wireguard.nativemobile.PacketTunnel`
- Network Extension capability with Packet Tunnel Provider enabled.
- App Group `group.com.wireguard.nativemobile`, if the app and extension will share VPN configs.
- App Store Connect API key connected to Codemagic.

Required Codemagic variables:

- `DEVELOPMENT_TEAM`: Apple Team ID, stored as an encrypted variable.

In Codemagic, enable iOS automatic code signing for App Store distribution. The extension needs its own provisioning profile; Codemagic can fetch matching profiles for the main bundle ID and `com.wireguard.nativemobile.*`.

The workflow builds the web app, generates the Xcode project with XcodeGen, applies signing profiles with `xcode-project use-profiles`, builds an `.ipa`, and submits it to TestFlight.

## Current native VPN note

The project now has buildable native shell targets. The actual WireGuard tunnel backend is still marked as TODO in both Android and iOS service code. Before production release, replace the placeholder tunnel startup with the real WireGuard backend and move VPN private keys/configs out of source code.
