# 📱 CROSS-PLATFORM BUILD PIPELINE (TAURI + CAPACITOR)

HAVEN OS supports cross-platform client compile setups out of the box using **Tauri 2 (Desktop)** and **Capacitor (Android)**. This manual lists the absolute CLI commands and environment variables required to build production-ready packages.

---

## 💻 1. Tauri 2 (Desktop: Windows & Linux)

### Prerequisites (Local Host OS)
- **Rust Toolchain**: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- **Linux Packages** (Debian/Ubuntu):
  `sudo apt install pkg-config libssl-dev libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libayatana-appindicator3-dev librsvg2-dev`

### Compilation Commands
```bash
# 1. Build the frontend web assets
npm run build

# 2. Compile Desktop Application bundle
npx tauri build
```
- **Build Output**: Located in `src-tauri/target/release/bundle/`
  - Linux: `.deb` / `.AppImage`
  - Windows: `.msi` / `.exe`

---

## 🤖 2. Capacitor (Android Mobile App)

### Prerequisites
- **Java Development Kit**: JDK 17 (Required)
- **Android SDK Tools**: Installed and mapped in your shell profile:
  ```bash
  export ANDROID_HOME=$HOME/Android/Sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  ```

### Build Workflow Commands
```bash
# 1. Compile web assets
npm run build

# 2. Sync web assets with Capacitor Android wrapper
npx cap sync android

# 3. Open project in Android Studio (optional)
npx cap open android

# 4. Direct headless CLI Gradle build for APK
cd android && ./gradlew assembleRelease
```
- **Build Output**: Located in `android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## ✍️ 3. Production Keystore Signing (Android)

To release to the Google Play Store, sign your APK with a secure keystore:

```bash
# 1. Generate release keystore
keytool -genkey -v -keystore haven-release-key.keystore -alias haven_alias -keyalg RSA -keysize 2048 -validity 10000

# 2. Align the APK
zipalign -v 4 android/app/build/outputs/apk/release/app-release-unsigned.apk haven-aligned.apk

# 3. Sign the APK with apksigner
apksigner sign --keystore haven-release-key.keystore --out haven-signed-release.apk haven-aligned.apk
```

---

## 💡 Troubleshooting & Common Issues

### Issue: Android build fails with "SDK location not found"
- **Solution**: Create a `local.properties` file inside your `/android` directory:
  ```properties
  sdk.dir=/Users/YOUR_USER_NAME/Library/Android/sdk
  ```

### Issue: Tauri build fails with WebKitGTK missing
- **Solution**: Ensure you have installed the WebKitGTK-4.1 packages, NOT the older 4.0 versions. Tauri 2 requires GTK-4.1+.
