# My Prayers

Daily prayer times, qibla compass, and salah reminders — as a PWA or a native Android app.

## Option A — Install as a PWA (fastest)

Android can't install a raw HTML file, but once these files are hosted over HTTPS, Chrome lets you install the app like any other — home screen icon, full screen, no address bar.

1. Host the `www` folder (or the project root files) on **GitHub Pages** or **Netlify Drop**.
2. Open the hosted URL in Chrome on your phone.
3. Menu → **Install app** / **Add to Home screen**.

## Option B — Build a real Android app (APK)

This project includes a **Capacitor** Android wrapper so you can build an installable `.apk` or publish to the Play Store.

### What you need

- [Node.js](https://nodejs.org/) (already used for dependencies)
- [Android Studio](https://developer.android.com/studio) with Android SDK
- JDK 17+ (bundled with recent Android Studio)

### Build steps

1. Install dependencies (once):

   ```bash
   npm install
   ```

2. Sync web files into the Android project:

   ```bash
   npm run cap:sync
   ```

3. Open the Android project in Android Studio:

   ```bash
   npm run android
   ```

   Or manually: open the `android` folder in Android Studio.

4. In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

5. Install the APK on your phone (enable “Install unknown apps” if sideloading).

### After editing the app

Edit `index.html` at the project root, then run:

```bash
npm run cap:sync
```

Rebuild in Android Studio.

### Android features

- **Location** — used for prayer times and qibla (permissions are in `AndroidManifest.xml`).
- **Compass** — uses the phone’s orientation sensors in the WebView.
- **Settings** — saved with `localStorage` on the device.
- **Notifications** — browser notifications work while the app is open; background push would need extra native plugins later.

## Project layout

| Path | Purpose |
|------|---------|
| `index.html` | Main app (edit this) |
| `www/` | Copy synced into the Android app by Capacitor |
| `manifest.json` | PWA install metadata |
| `service-worker.js` | Offline shell caching |
| `android/` | Native Android Studio project |
| `capacitor.config.json` | Capacitor settings |

## Notes

- Prayer times are fetched live from the [Aladhan API](https://aladhan.com/prayer-times-api) — internet is required for daily times.
- The app shell (UI, icons, saved settings) works offline after first load.
- For Play Store release, sign the app in Android Studio (**Build → Generate Signed Bundle / APK**).

## Alternative — PWA Builder

If you host the app on HTTPS, you can also package it at [PWABuilder](https://www.pwabuilder.com/) without Android Studio. Capacitor gives you more control and bundles everything locally.
