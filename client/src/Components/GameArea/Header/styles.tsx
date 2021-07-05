import styled from 'styled-components';

import palette from '../../../utils/palette';
import BaseCell from '../Cell/Cell';

export const Text = styled.div<{
  fontSize?: string;
  justify?: string;
  opacity?: number;
}>`
  font-weight: bold;
  display: flex;
  align-items: center;
  opacity: ${({ opacity }) => opacity || 1};
  justify-content: ${({ justify }) => justify};
`;

export const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${palette.primaryLight};
  padding: 1em;
  color: ${palette.white};
  margin-bottom: 0.5em;
  width: 100%;
`;

export const Cell = styled(BaseCell).attrs({ forwardedAs: 'div' })`
  width: 2em;
  height: 2em;
`;
