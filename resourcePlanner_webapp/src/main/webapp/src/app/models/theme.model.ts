export class Theme {
  /**
   * Which {@link Theme.Mode theme} is currently active
   */
  public static currentTheme: Theme.Mode;

  /**
   * Default value for {@link Theme.Mode theme}
   */
  public static defaultTheme: Theme.Mode = 'dark-theme' as Theme.Mode;

  /**
   * Parse a String into a Theme key
   * @param str Theme
   * @returns Parsed Theme or default
   */
  public static getTheme(str: string | null): Theme.Mode {
    return str as keyof typeof Theme.Mode as Theme.Mode;
  }
}

export namespace Theme {
  export enum Mode {
    light = 'light-theme',
    dark = 'dark-theme',
  }
}
