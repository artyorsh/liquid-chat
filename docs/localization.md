# Localization

- `npx lingui extract` > [i18n/locales/en.json](../src/i18n/locales/en.json)
- The extract command is part of [pre-commit script](../.husky/pre-commit)

## Weblate (Optional)

- [Personal access tokens](https://github.com/settings/tokens) > generate new token > (classic) > scopes (repo) > generate token
- [docker-compose](https://docs.weblate.org/en/latest/admin/install/docker.html) > set [WEBLATE_GITHUB_ env vars](https://docs.weblate.org/en/latest/admin/install/docker.html#code-hosting-sites-credentials)
- Weblate > Administration > SSH Keys > Ed25519 > Github > Repository Settings > Deploy Keys > Add
- Weblate > Configure the project > Update locales > check if opens pull requests.
