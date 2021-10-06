import { DefaultTheme } from 'styled-components';
import { purple, gold } from '@ant-design/colors';

export const theme: DefaultTheme = {
  pageMargin: {
    xl: 80,
    lg: 80,
    md: 80,
    sm: 40,
    xs: 40,
  },
  breakpoints: {
    lg: 1200,
    md: 992,
    sm: 768,
    xs: 576,
  },
  colors: {
    primary: {
      light: purple[3],
      main: purple[4],
      dark: purple[5],
    },
    secondary: {
      light: gold[3],
      main: gold[4],
      dark: gold[5],
    },
    backgrounds: {
      dark: '#001529',
      light: '#f0f2f5',
    },
  },
};
