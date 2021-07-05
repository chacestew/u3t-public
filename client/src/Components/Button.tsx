import { Link as ReactRouterLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { boxShadow } from '../styles/mixins';
import palette from '../utils/palette';

interface ButtonStyleProps {
  $shadow?: boolean;
  $rounded?: boolean;
  disabled?: boolean;
}

const buttonStyles = css<ButtonStyleProps>`
  display: flex;
  justify-content: center;
  cursor: pointer;
  border: 0;
  text-decoration: none;
  padding: 0.5em;
  font-weight: bold;
  background-color: ${palette.white};
  color: ${palette.primaryDark};
  ${({ $shadow }) => $shadow && boxShadow}
  ${({ $rounded }) => $rounded && 'border-radius: 4px;'}
  ${({ disabled }) => disabled && 'opacity: 0.5; pointer-events: none;'}
  :active, :hover, :focus {
    filter: brightness(90%);
  }
`;

export const Button = styled.button`
  ${buttonStyles}
`;

export const ButtonLink = styled(ReactRouterLink)`
  ${buttonStyles}
`;
