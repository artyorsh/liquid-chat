# Localization

Use Lingui components or macros for it to extract messages [automatically](https://lingui.dev/guides/message-extraction). Extraction runs on pre-commit.

This codebase uses `t` macro from `@lingui/react` package.
It allows switching languages at runtime while providing the best developer experience [compared to other options](https://github.com/artyorsh/expo-template/pull/12). Also see [alternative setups](#alternative-setups).

## Adding new languages

- [lingui.config.ts](../lingui.config.ts) > add new locale to the array > `npx lingui extract` > generates the new .po file in [i18n/locales](../src/i18n/locales)
- [i18n/index](../src/i18n/index.ts) > update the ISupportedLocale type > update the provider to return messages for the new locale.
- Translate either manually or with Weblate.

## Alternative Setups

If switching languages at runtime is not required (e.g the app may be restarted instead after changing the language), consider using the same macro from `@lingui/core` package. Then there is no need for `<I18nProvider>` wrapper and `useLingui` hook.

## Weblate

- [Personal access tokens](https://github.com/settings/tokens) > generate new token > (classic) > scopes (repo) > generate token
- [docker-compose](https://docs.weblate.org/en/latest/admin/install/docker.html) > set [WEBLATE_GITHUB_ env vars](https://docs.weblate.org/en/latest/admin/install/docker.html#code-hosting-sites-credentials) > `docker-compose up`
- Weblate > Sign in > ("admin", "password for the admin user")
- Administration > SSH Keys > Ed25519 > Github > Repository Settings > Deploy Keys > Add (Allow write access)
- "+" > Add new translation project > Add new traslation component
  - Version control system: GitHub pull request
  - Source code repository: git@github.com:owner/repo
  - Repository branch: (main)
- "gettext PO file (monolingual)" > Review > Save > Wait until updated > Return to the component

### Automatic translations

- [Open AI > API Keys](https://platform.openai.com/api-keys) > create
- Weblate > Administration > Automatic suggestions > Open AI > model (gpt-4o mini)
- Project > Operations > Add-ons > Automatic translation > Install
  - Mode (Add as translation)
  - Filters (state:<translated)
  - Source of automated translations (Machine translation, Open AI)

### Test

- "+ (Start new translation)" > Select language > Should be added with all translations
- Project > Operations > Repository maintenance > push > see if pull request is opened
