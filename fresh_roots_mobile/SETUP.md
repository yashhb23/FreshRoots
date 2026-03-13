# Fresh Roots Mobile App - Setup Guide

## Prerequisites

1. **Node.js** 18+ installed
2. **Java Development Kit (JDK) 17** installed
3. **Android Studio** installed with:
   - Android SDK Platform Tools
   - Android SDK Build Tools
   - Android Emulator (optional, can use physical device)
4. **Environment Variables** configured:
   - `ANDROID_HOME` pointing to your Android SDK location
   - Add `%ANDROID_HOME%\platform-tools` to PATH

## Initial Setup

### 1. Install Dependencies
```bash
cd fresh_roots_mobile
npm install --legacy-peer-deps
```

### 2. Configure Backend URL

Edit `src/utils/config.ts` and update `DEV_API_URL` with your PC's local IP:

```typescript
// Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)
const DEV_API_URL = 'http://192.168.1.100:3000/api'; // Replace with your actual IP
```

### 3. Link Native Dependencies

**Android:**
Native modules auto-link via React Native CLI. Vector icon fonts are copied during Gradle build via `fonts.gradle`.

**iOS (if you build iOS later):**
```bash
cd ios && pod install && cd ..
npx react-native-asset   # Copies vector icon fonts into iOS bundle
```

Required libraries (auto-linked):
- react-native-gesture-handler
- react-native-screens
- react-native-safe-area-context
- @react-native-async-storage/async-storage
- react-native-vector-icons (MaterialCommunityIcons)

### 4. Build Android Debug APK

```bash
# Start Metro bundler
npm start

# In another terminal, build and run on connected device/emulator
npm run android
```

## Development Workflow

### Running on Physical Android Device

1. Enable **Developer Options** on your device
2. Enable **USB Debugging**
3. Connect device via USB
4. Verify connection: `adb devices`
5. Run: `npm run android`

### Running on Android Emulator

1. Open Android Studio → AVD Manager
2. Create/Start an emulator
3. Run: `npm run android`

### Viewing Logs

```bash
# React Native logs
npm start

# Android logs
npx react-native log-android
```

## Project Structure

```
src/
├── screens/         # All screen components
│   ├── auth/       # Authentication screens
│   └── main/       # Main app screens
├── navigation/      # Navigation setup
├── components/      # Reusable UI components
│   ├── common/     # Generic components (Button, Input, etc.)
│   ├── product/    # Product-specific components
│   └── cart/       # Cart-specific components
├── services/        # API services
│   └── api/        # API client and endpoints
├── contexts/        # React contexts (Auth, Cart, etc.)
├── utils/          # Utility functions
├── theme/          # Design system (colors, spacing, typography)
├── types/          # TypeScript type definitions
└── assets/         # Images, fonts, etc.
```

## Troubleshooting

### Build Errors

**"SDK location not found"**
- Set `ANDROID_HOME` environment variable
- Create `local.properties` in `android/` folder:
  ```
  sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
  ```

**"Unable to connect to development server"**
- Make sure backend is running
- Update `DEV_API_URL` in `src/utils/config.ts` with correct IP
- On physical device, ensure both device and PC are on same Wi-Fi network

### Metro Bundler Issues

```bash
# Clear cache and restart
npm start -- --reset-cache
```

### Gradle Issues

```bash
cd android
./gradlew clean
cd ..
npm run android
```

## Building Release APK

See `BUILD_APK.md` for detailed instructions on building signed release APK.

## Testing Backend Connection

1. Make sure backend is running on your PC
2. Test health endpoint:
   ```bash
   curl http://YOUR_LOCAL_IP:3000/api/health
   ```
3. If successful, the app should connect properly

## Next Steps

1. Complete auth screens implementation
2. Implement home screen with product listing
3. Add product detail screen
4. Implement cart and checkout
5. Build and test release APK

## Environment Switching

To switch between development and production:

Edit `src/utils/config.ts`:
```typescript
const ENVIRONMENT: 'development' | 'production' = 'production';
```

## Support

For issues, refer to:
- React Native documentation: https://reactnative.dev
- API Contract: `../API_CONTRACT.md`
- Backend setup: `../fresh_roots_backend/nodejs_space/README.md`
