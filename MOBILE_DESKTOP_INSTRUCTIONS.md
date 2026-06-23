# Mobile & Desktop Deployment Instructions for Haven

### Supported Platforms
- **Windows** (desktop, Tauri)
- **Linux** (desktop, Tauri)
- **Android** (mobile, Capacitor)

> **Note:** macOS and iOS are explicitly NOT supported targets.

## Windows/Linux desktop (run on respective OS, or cross-compile via GitHub Actions)
To develop locally:
\`\`\`bash
npm run tauri:dev
\`\`\`

To build locally:
\`\`\`bash
npm run tauri:build
\`\`\`

### Icon Generation Instructions
Create an original 1024x1024 PNG logo at \`src-tauri/icons/icon.png\`.
Then run:
\`\`\`bash
npx tauri icon src-tauri/icons/icon.png
\`\`\`

## Android APK (Capacitor)

### Requirements
- Android Studio installed
- Capacitor initialized

### Debug APK (Sideloadable without Play Store)
\`\`\`bash
npx cap sync android
cd android && ./gradlew assembleDebug
\`\`\`

### Release APK (Self-Signed)
Generate a free self-signed keystore:
\`\`\`bash
keytool -genkey -v -keystore haven-release.keystore -alias haven -keyalg RSA -keysize 2048 -validity 10000
\`\`\`
Then build release:
\`\`\`bash
cd android && ./gradlew assembleRelease
\`\`\`
*(Optional: Use jarsigner and zipalign to package for direct distribution).*
