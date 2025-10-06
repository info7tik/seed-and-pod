# Seed&Pod

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.4.

## Development server

To start a local development server, run:

```bash
npm run
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm run test
```

## Android (Capacitor) quickstart

### Build and install on the connected phone
To build the android app and install it over the connected phone, run the script [build-and-install.sh](./tools/build-and-install.sh):
```bash
bash tools/build-and-install.sh
```

### Step by step
- Build web assets:

```bash
npm run build
```

- Sync to Android project:

```bash
npx cap sync android
```

- Open Android Studio:

```bash
npx cap open android
```

- Or build debug APK via CLI:

```bash
cd android && ./gradlew assembleDebug
```

APK output: `android/app/build/outputs/apk/debug/app-debug.apk`.

Run on a device:
- Enable USB debugging, connect device, then:

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```
