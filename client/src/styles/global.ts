import { createGlobalStyle, css } from 'styled-components';
import styledNormalize from 'styled-normalize';

import palette from '../utils/palette';

const globalStyles = css`
  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    padding: 0;
  }

  p,
  h1,
  h2,
  h3,
  h4 {
    margin: 0;
  }

  body {
    font-family: 'Poppins', sans-serif;

    #root {
      background-color: ${palette.background};
      min-height: 100vh;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
    }
  }
`;

const GlobalStyle = createGlobalStyle`
  ${styledNormalize}
  ${globalStyles}
`;

export default GlobalStyle;
