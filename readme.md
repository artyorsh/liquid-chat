# expo-template

[![Build](https://github.com/artyorsh/expo-template/actions/workflows/build.yml/badge.svg?event=push&branch=main)](https://github.com/artyorsh/expo-template/actions?query=branch%3Amain)

## Stack

- [![expo](https://img.shields.io/badge/expo-53.0-blue)](https://github.com/expo/expo/blob/main/packages/expo/CHANGELOG.md)
- [![react-native](https://img.shields.io/badge/react--native-0.79-blue)](https://github.com/facebook/react-native/releases)
- [![react-navigation](https://img.shields.io/badge/react--navigation-7.0-blue)](https://github.com/react-navigation/react-navigation/releases)
- [![react-native-unistyles](https://img.shields.io/badge/react--native--unistyles-3.0-blue)](https://github.com/vitalets/react-native-unistyles/releases)
- [![mobx-react](https://img.shields.io/badge/mobx--react-9.2-blue)](https://github.com/mobxjs/mobx/releases)
- [![inversifyjs](https://img.shields.io/badge/inversifyjs-6.0-blue)](https://github.com/inversify/InversifyJS/releases)
- [![jest](https://img.shields.io/badge/jest-29.7-blue)](https://github.com/jestjs/jest/releases)
- [![react-native-testing-library](https://img.shields.io/badge/testing--library-12.4-blue)](https://github.com/callstack/react-native-testing-library/releases)
- [![typescript](https://img.shields.io/badge/typescript-5.7-blue)](https://github.com/microsoft/TypeScript/releases)
- [![eslint](https://img.shields.io/badge/eslint-8.56-blue)](https://github.com/eslint/eslint/releases)

## Setup

```bash
yarn
```

```bash
cp .env.example .env
```

## Running

Start the Metro bundler and follow the instructions in the terminal to run the app on your device or emulator.

```bash
yarn start
```

## Enabling EAS

- [expo.dev](https://expo.dev) > create a project
- [Project > Overview > ID](https://expo.dev/accounts/[OWNER]/projects/[SLUG]) > update the app.config.ts with project slug, project_id and updates.url
- [Project Settings > Environment Variables](https://expo.dev/accounts/[OWNER]/projects/[SLUG]/environment-variables/new) > upload .env variables
- [Firebase Console](https://console.firebase.google.com/) > create a project > create Android and iOS apps adding your bundle identifier.
- Download the google-services.json and GoogleService-Info.plist files, copy to .firebase folder.
- [Project Settings > Environment Variables](https://expo.dev/accounts/[OWNER]/projects/[SLUG]/environment-variables/new) > create secret variables using the  GOOGLE_SERVICES_FILE_ANDROID and GOOGLE_SERVICES_FILE_IOS keys for the files above.
- Test EAS builds:
  - `npx eas build -p android -e preview --local` (Generate a new Android Keystore? > Yes)
  - `npx eas build -p ios -e ios-simulator`
  - [EAS > Builds](https://expo.dev/accounts/[OWNER]/projects/[SLUG]/builds) > review
- [Credentials > Access Tokens](https://expo.dev/accounts/[OWNER]/settings/access-tokens) > create a token > add EXPO_TOKEN to GitHub repository secrets.

## Branding

- Icon and colors
  - [Generator](https://www.figma.com/community/file/938712838317973976) > update ic-launcher-*.png in assets/images
  - [src/uilib](./src/uilib/index.ts) > update palette (use generators like [Material](https://materialui.co/colors) or [Eva](https://colors.eva.design))
  - [app.config.ts](./app.config.ts) > expo-splash-screen > update background color
- Fonts
  - [Choose a font](https://fonts.google.com) > `npx expo install @expo-google-fonts/FONT_NAME`
  - [app.config.ts](./app.config.ts) > fontFamilies > update the names
  - [src/uilib](./src/uilib/index.ts) > update FontFamily type and theme.typography
- Test the themes:
  - iOS: Search > Dark Mode
  - Android: Settings > Display > Dark Theme
