# Building Fresh Roots APK

## Prerequisites

Ensure you have the following installed:
- Node.js 18+
- JDK 17 (Gradle 9 requires JVM 17+)
- Android SDK (via Android Studio)
- Environment variables configured:
  - `ANDROID_HOME` - Points to Android SDK
  - `JAVA_HOME` - Points to JDK 17

### Windows: Fix "Gradle requires JVM 17" Error

If you see "Gradle requires JVM 17 or later" but have JVM 11 as default, use Android Studio's bundled JVM:

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
cd android
.\gradlew assembleRelease
```

### Get SHA-1 Fingerprint (for Firebase Google Sign-In)

```powershell
keytool -list -v -keystore "$env:USERPROFILE\.android\debug.keystore" -alias androiddebugkey -storepass android
```

Copy the `SHA1:` value and add it in Firebase Console → Project Settings → Your apps → Android app → SHA certificate fingerprints.

See [FIREBASE_SHA_SETUP.md](FIREBASE_SHA_SETUP.md) for details.

## Quick Build Commands

### Debug APK (for testing)
```bash
cd fresh_roots_mobile

# Install dependencies (if not done)
npm install --legacy-peer-deps

# Build debug APK
cd android
./gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (for production)
```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

## Copying APK to D:\

After building, copy the APK:
```powershell
copy android\app\build\outputs\apk\debug\app-debug.apk D:\FreshRoots-debug.apk
# OR for release
copy android\app\build\outputs\apk\release\app-release.apk D:\FreshRoots-release.apk
```

## Environment Configuration

Before building, update the API URL in `src/utils/config.ts`:

### For Development (local backend):
```typescript
const DEV_API_URL = 'http://192.168.X.X:3000/api'; // Your local IP
const ENVIRONMENT: 'development' | 'production' = 'development';
```

### For Production (deployed backend):
```typescript
const PROD_API_URL = 'https://ff700b369.na101.preview.abacusai.app/api';
const ENVIRONMENT: 'development' | 'production' = 'production';
```

## Creating a Signed Release APK

For publishing to Play Store, generate your own keystore:

### 1. Generate Keystore
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore freshroots-release.keystore -alias freshroots -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure in `android/app/build.gradle`
```gradle
signingConfigs {
    release {
        storeFile file('freshroots-release.keystore')
        storePassword 'YOUR_STORE_PASSWORD'
        keyAlias 'freshroots'
        keyPassword 'YOUR_KEY_PASSWORD'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        // ... other settings
    }
}
```

### 3. Build Release
```bash
cd android
./gradlew bundleRelease  # For Play Store AAB
# OR
./gradlew assembleRelease  # For APK
```

## Troubleshooting

### "SDK location not found"
Create `android/local.properties`:
```
sdk.dir=C:\\Users\\USERNAME\\AppData\\Local\\Android\\Sdk
```

### Build fails with memory error
Add to `android/gradle.properties`:
```
org.gradle.jvmargs=-Xmx4096m
```

### "Unable to connect to development server" in APK
- Make sure backend is running
- Update API URL in `src/utils/config.ts` before building
- For physical devices, use your PC's LAN IP, not localhost

## App Details

- **Package Name**: com.freshrootsmobile
- **Version**: 1.0 (versionCode: 1)
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 35 (Android 15)

## File Sizes (Approximate)

- Debug APK: ~50-70 MB
- Release APK: ~20-30 MB (with ProGuard)
- Release AAB: ~15-20 MB
