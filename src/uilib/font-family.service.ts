import { Platform } from 'react-native';

import { FontFamily, IFontFamilyService } from '.';

interface IFontFamilyParser {
  getName(family: FontFamily): string;
}

export class FontFamilyService implements IFontFamilyService {

  private cache: Record<string, string> = {};

  constructor(private parser: IFontFamilyParser) {

  }

  public getFontName = (family: FontFamily): string => {
    if (this.cache[family]) {
      return this.cache[family];
    }

    const result: string = this.parser.getName(family);
    this.cache[family] = result;

    return result;
  };
}

class AndroidFontFamilyParser implements IFontFamilyParser {
  public getName = (family: FontFamily): string => {
    const [name, weightStyle] = family.split('/');

    return `${name}_${weightStyle}`;
  };
}

class IOSFontFamilyParser implements IFontFamilyParser {
  public getName = (family: FontFamily): string => {
    const [name, weightStyle] = family.split('/');

    return `${name}-${weightStyle.substring(3)}`;
  };
}

const parser: IFontFamilyParser = Platform.select({
  default: new AndroidFontFamilyParser(),
  ios: new IOSFontFamilyParser(),
});

export const fontFamilyService: IFontFamilyService = new FontFamilyService(parser);
