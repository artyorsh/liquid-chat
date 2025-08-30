# expo-template

[![Build](https://github.com/artyorsh/expo-template/actions/workflows/build.yml/badge.svg?event=push&branch=main)](https://github.com/artyorsh/expo-template/actions?query=branch%3Amain)

React Native template with built-in modules, automation workflows and customisation options.

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

## Features

- Splash Screen Animation, fully compatible with expo-splash-screen.
- Authentication flows: login, registration, refresh and restore.
- Push Notifications with permission request.
- Light and Dark themes with [flexible customization](https://github.com/artyorsh/expo-template/wiki/Branding).
- Remote logging with [Grafana](https://github.com/artyorsh/grafana-mobile-observability).
- CI/CD with GitHub Actions and [EAS](https://github.com/artyorsh/expo-template/wiki/Enabling-EAS).
- Modularized architecture with Dependency Injection.

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

## Documentation

See [docs](./docs/readme.md).

## Example apps

[Schiffradar](https://github.com/artyorsh/schiffradar)

## Author

[Artur Yersh](https://github.com/artyorsh)
