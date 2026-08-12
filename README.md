# My Salah — install on Android

This is a Progressive Web App (PWA). Android can't install a raw HTML file as
an app, but once these files are hosted on the web (even for free), Chrome
will let you install it like a normal app — home screen icon, its own window,
no address bar.

## 1. Host the files (pick one, both are free)

**GitHub Pages**
1. Create a new GitHub repo and upload all files in this folder
   (`index.html`, `manifest.json`, `service-worker.js`, the three icon PNGs).
2. Go to the repo's Settings → Pages → set source to the `main` branch.
3. GitHub gives you a URL like `https://yourname.github.io/salah-app/`.

**Netlify Drop** (no account needed)
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page.
3. Netlify gives you a live HTTPS URL immediately.

A PWA can only be installed from an `https://` URL, not from a file opened
directly on your phone — that's an Android/Chrome requirement, not something
this app can work around.

## 2. Install it on your phone

1. Open the hosted URL in Chrome on your Android phone.
2. Tap the **⋮** menu in the top right.
3. Tap **Install app** (or **Add to Home screen**).
4. Confirm — the icon appears on your home screen and opens full-screen,
   like any other app.

## Notes

- Prayer times still need an internet connection to fetch (they come from
  the Aladhan API live each day). The app shell itself (layout, icons, your
  saved settings) works offline once installed.
- Your location, reminder toggles, and preferences are stored on your device
  and carry over between sessions.
- If you'd rather have a real `.apk`/Play Store listing later, you can feed
  the hosted URL into https://www.pwabuilder.com, which packages an
  installed PWA into a signed Android app bundle for you.
