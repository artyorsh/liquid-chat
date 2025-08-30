# Branding

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
