import { css } from 'styled-components';

export const flexColumns = `
  display: flex;
  flex-direction: column;
`;

export const boxShadow = `
  box-shadow: 0px 2px 2px rgba(204, 197, 185, 0.5);
`;

export const media = {
  aboveMobileS: (styles: TemplateStringsArray) => css`
    @media (min-width: 321px) {
      ${css(styles)}
    }
  `,
  aboveMobileM: (styles: TemplateStringsArray) => css`
    @media (min-width: 375px) {
      ${css(styles)}
    }
  `,
  aboveMobileL: (styles: TemplateStringsArray) => css`
    @media (min-width: 426px) {
      ${css(styles)}
    }
  `,
  aboveTablet: (styles: TemplateStringsArray) => css`
    @media (min-width: 767px) {
      ${css(styles)}
    }
  `,
};
