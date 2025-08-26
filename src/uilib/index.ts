import { StyleSheet } from 'react-native-unistyles';

import { fontFamilyService } from './font-family.service';

type AppThemes = typeof config.themes;

type AppTheme = AppThemes[keyof AppThemes];

type AppBreakpoints = typeof config.breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export type UnistylesTheme = AppTheme;
}

/**
 * @see https://m2.material.io/develop/android/theming/color
 */
interface ThemeColors {
  /*
   * Background color for screens.
   */
  background: string;
  /*
   * Foreground (text/icon) color displayed on `background`.
   */
  onBackground: string;
  /*
   * Background color for disabled elements.
   */
  disabled: string;
  /*
   * Foreground (text/icon) color displayed on `disabled`.
   */
  onDisabled: string;
  /*
   * Brand color.
   */
  primary: string;
  /*
   * The darker/lighter variation of the primary color (e.g pressed buttons, focused inputs).
   */
  primaryVariant: string;
  /*
   * Foreground (text/icon) color displayed on `primary`.
   */
  onPrimary: string;
  /*
   * Background color content on screens (e.g cards, bottom sheets).
   */
  surface: string;
  /*
   * Background color content on screens, when pressed.
   */
  surfaceVariant: string;
  /*
   * E.g placeholders, labels, helper texts.
   */
  hint: string;
  /*
   * Border color for content on screen.
   * E.g dividers, card borders.
   */
  outline: string;
}

/**
 * Matches the fonts families loaded in app.config.ts > plugins > expo-font
 */
export type FontFamily =
  | 'Inter/300Light'
  | 'Inter/400Regular'
  | 'Inter/500Medium'
  | 'Inter/600SemiBold';

export interface IFontFamilyService {
  /**
   * @returns platform-specific fontFamily name for the given family and style
   * @example (Android): Inter_500Medium, (iOS): Inter-Medium
   * @see https://docs.expo.dev/develop/user-interface/fonts/#with-expo-font-config-plugin-1
   */
  getFontName(family: FontFamily): string;
}

/**
 * @see https://materialui.co/colors
 * @see https://colors.eva.design
 */
const palette = {
  basic100: '#F5F5F5',
  basic200: '#EEEEEE',
  basic300: '#E0E0E0',
  basic400: '#BDBDBD',
  basic500: '#9E9E9E',
  basic600: '#757575',
  basic700: '#616161',
  basic800: '#424242',
  basic900: '#212121',

  primary100: '#F0F8EC',
  primary200: '#E0F2DA',
  primary300: '#BED8B8',
  primary400: '#93B191',
  primary500: '#5F7D5F',
  primary600: '#456B48',
  primary700: '#2F5937',
  primary800: '#1E4829',
  primary900: '#123B20',
};

const lightTheme = {
  radius: 12,
  gap: (v: number): number => v * 4,
  colors: <ThemeColors> {
    background: palette.basic100,
    onBackground: palette.basic900,
    disabled: palette.basic300,
    onDisabled: palette.basic600,
    primary: palette.primary500,
    primaryVariant: palette.primary400,
    onPrimary: palette.basic100,
    surface: palette.basic100,
    surfaceVariant: palette.basic200,
    hint: palette.basic600,
    outline: palette.basic300,
  },
  typography: {
    heading: (fontScale: number) => ({
      fontFamily: fontFamilyService.getFontName('Inter/600SemiBold'),
      fontSize: fontScale * 26,
      lineHeight: 36,
    }),
    subheading: (fontScale: number) => ({
      fontFamily: fontFamilyService.getFontName('Inter/500Medium'),
      fontSize: fontScale * 20,
      lineHeight: 30,
    }),
    paragraph: (fontScale: number) => ({
      fontFamily: fontFamilyService.getFontName('Inter/400Regular'),
      fontSize: fontScale * 15,
      lineHeight: 20,
    }),
    control: (fontScale: number) => ({
      fontFamily: fontFamilyService.getFontName('Inter/500Medium'),
      fontSize: fontScale * 15,
      lineHeight: 20,
    }),
  },
};

const darkTheme = {
  ...lightTheme,
  colors: <ThemeColors> {
    background: palette.basic900,
    onBackground: palette.basic100,
    disabled: palette.basic700,
    onDisabled: palette.basic400,
    primary: palette.primary500,
    primaryVariant: palette.primary400,
    onPrimary: palette.basic100,
    surface: palette.basic900,
    surfaceVariant: palette.basic800,
    hint: palette.basic400,
    outline: palette.basic700,
  },
};

/**
 * @see https://www.unistyl.es/v3/guides/theming
 */
const config = {
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  breakpoints: {
    xs: 0,
  },
};

StyleSheet.configure({
  ...config,
  settings: {
    adaptiveThemes: true,
  },
});
