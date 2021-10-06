import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    pageMargin: {
      xl: number;
      lg: number;
      md: number;
      sm: number;
      xs: number;
    };

    breakpoints: {
      lg: number;
      md: number;
      sm: number;
      xs: number;
    };

    colors: {
      primary: {
        light: string;
        main: string;
        dark: string;
      };
      secondary: {
        light: string;
        main: string;
        dark: string;
      };
      backgrounds: {
        dark: string;
        light: string;
      };
    };
  }
}
