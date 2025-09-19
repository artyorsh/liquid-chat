# Enabling EAS

- [expo.dev](https://expo.dev) > create a project
- [Project > Overview > ID](https://expo.dev/accounts/[OWNER]/projects/[SLUG]) > update the app.config.ts with project slug, project_id and updates.url
- [Project Settings > Environment Variables](https://expo.dev/accounts/[OWNER]/projects/[SLUG]/environment-variables/new) > upload .env variables
- [Firebase Console](https://console.firebase.google.com/) > create a project > create Android and iOS apps adding your bundle identifier.
- Download the google-services.json and GoogleService-Info.plist files, copy to .firebase folder.
- [Project Settings > Environment Variables](https://expo.dev/accounts/[OWNER]/projects/[SLUG]/environment-variables/new) > create secret variables using the  GOOGLE_SERVICES_FILE_ANDROID and GOOGLE_SERVICES_FILE_IOS keys for the files above.
- [Sentry > Developer Settings > Organization Tokens](https://sentry.io/settings/auth-tokens/) > create a token
- [Project Settings > Environment Variables](https://expo.dev/accounts/[OWNER]/projects/[SLUG]/environment-variables/new) > create a secret variable using the SENTRY_AUTH_TOKEN.
- Test EAS builds:
  - `npx eas build -p android -e preview --local` (Generate a new Android Keystore? > Yes)
  - `npx eas build -p ios -e ios-simulator`
  - [EAS > Builds](https://expo.dev/accounts/[OWNER]/projects/[SLUG]/builds) > review
- [Credentials > Access Tokens](https://expo.dev/accounts/[OWNER]/settings/access-tokens) > create a token > add EXPO_TOKEN to GitHub repository secrets.
