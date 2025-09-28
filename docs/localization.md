# Localization

- `npx lingui extract` > [i18n/locales/en.json](../src/i18n/locales/en.json)
- The extract command is part of [pre-commit script](../.husky/pre-commit)

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
