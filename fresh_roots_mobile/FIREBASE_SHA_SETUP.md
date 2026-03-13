# Firebase SHA-1 Fingerprint Setup

Google Sign-In on Android requires your app's SHA-1 fingerprint to be registered in Firebase.

## Your Debug SHA-1 Fingerprint

```
AB:CC:C3:59:BB:15:32:FA:0B:10:DC:11:B8:B6:EC:9E:B7:8B:01:56
```

## Where to Add It in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (e.g. "new app 01")
3. Click the **gear icon** (Project Settings)
4. Scroll to **"Your apps"**
5. Select your **Android app** (FreshRoots / com.freshrootsmobile)
6. Find the **"SHA certificate fingerprints"** section
7. Click **"Add fingerprint"**
8. Paste: `AB:CC:C3:59:BB:15:32:FA:0B:10:DC:11:B8:B6:EC:9E:B7:8B:01:56`
9. Save

## For Release APK (when you publish)

When you build a release APK, you use a different keystore. Get its SHA-1 with:

```powershell
keytool -list -v -keystore "C:\path\to\your\release.keystore" -alias your-key-alias
```

Add that SHA-1 to Firebase as well.

## Re-run This Command Anytime

To get your debug SHA-1 again:

```powershell
keytool -list -v -keystore "$env:USERPROFILE\.android\debug.keystore" -alias androiddebugkey -storepass android
```

Look for the line: `SHA1: AB:CC:C3:59:BB:15:32:FA:0B:10:DC:11:B8:B6:EC:9E:B7:8B:01:56`
