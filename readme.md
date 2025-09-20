# expo-template

[![Validate](https://github.com/artyorsh/expo-template/actions/workflows/validate.yml/badge.svg?event=push&branch=main)](https://github.com/artyorsh/expo-template/actions?query=branch%3Amain+event%3Apush)
[![Build](https://github.com/artyorsh/expo-template/actions/workflows/build.yml/badge.svg?event=schedule&branch=main)](https://github.com/artyorsh/expo-template/actions?query=branch%3Amain+event%3Aschedule)

React Native template with built-in modules, automation workflows and customisation options.

## Stack

- [![expo](https://img.shields.io/badge/expo-54.0-blue)](https://github.com/expo/expo/blob/main/packages/expo/CHANGELOG.md)
- [![react-native](https://img.shields.io/badge/react--native-0.81-blue)](https://github.com/facebook/react-native/releases)
- [![react-navigation](https://img.shields.io/badge/react--navigation-7.0-blue)](https://github.com/react-navigation/react-navigation/releases)
- [![react-native-unistyles](https://img.shields.io/badge/react--native--unistyles-3.0-blue)](https://github.com/vitalets/react-native-unistyles/releases)
- [![mobx-react](https://img.shields.io/badge/mobx--react-9.2-blue)](https://github.com/mobxjs/mobx/releases)
- [![inversifyjs](https://img.shields.io/badge/inversifyjs-7-blue)](https://github.com/inversify/InversifyJS/releases)
- [![jest](https://img.shields.io/badge/jest-29.7-blue)](https://github.com/jestjs/jest/releases)
- [![react-native-testing-library](https://img.shields.io/badge/testing--library-12.4-blue)](https://github.com/callstack/react-native-testing-library/releases)
- [![typescript](https://img.shields.io/badge/typescript-5.9-blue)](https://github.com/microsoft/TypeScript/releases)
- [![eslint](https://img.shields.io/badge/eslint-9-blue)](https://github.com/eslint/eslint/releases)

## Features

- Splash Screen Animation, fully compatible with expo-splash-screen.
- Authentication flows: login, registration, refresh and restore.
- Push Notifications with permission request.
- Light and Dark themes with [flexible customization](https://github.com/artyorsh/expo-template/wiki/Branding).
- Crash reporting with [Sentry](https://sentry.io).
- Remote logging with [Grafana](https://github.com/artyorsh/grafana-mobile-observability).
- CI/CD with GitHub Actions and [EAS](https://github.com/artyorsh/expo-template/wiki/Enabling-EAS).
- Modularized architecture with Dependency Injection.

## Setup

Install [Bun](https://github.com/oven-sh/homebrew-bun#install).

```bash
bun i
```

```bash
cp .env.example .env
```

## Running

Start Metro bundler and follow the instructions in terminal to run the app.

```bash
bun run start
```

## Documentation

See [docs](./docs/readme.md).

## Example apps

- [Schiffradar](https://github.com/artyorsh/schiffradar)
- [LiquidChat](https://github.com/artyorsh/liquid-chat)

## Author

[Artur Yersh](https://artyorsh.me)
