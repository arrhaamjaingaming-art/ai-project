# Agri Defence AI for Android

This Android app is a lightweight WebView wrapper for the live Agri Defence website:
https://ai-project-t2i8.onrender.com/

It requires an internet connection and displays the currently deployed website. Plant-image selection from the phone's gallery is supported where the website provides an image upload control.

## Free APK build

GitHub Actions builds a debug APK automatically when Android app files change. You can also run it manually:

1. Open the repository's Actions tab.
2. Select Build Agri Defence APK.
3. Click Run workflow.
4. Open the completed run and download the agri-defence-android-apk artifact.
5. Extract the downloaded ZIP to get app-debug.apk, then transfer it to your Android phone and install it.

This is a debug APK for personal testing, not a Play Store release. The website and its server-side AI features must remain online for the app to work.
