import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Player } from '@u3t/common';
import React from 'react';
import styled from 'styled-components';

import { boxShadow } from '../../../styles/mixins';
import palette from '../../../utils/palette';

export const getCellBg = (cellType: null | Player) => {
  switch (cellType) {
    case 1:
      return palette.red;
    case 2:
      return palette.yellow;
    default:
      return palette.white;
  }
};

export interface Props {
  cellType: null | Player;
  size?: string;
  className?: string;
}

const CellContainer = styled.button<Props>`
  border-radius: 4px;
  color: ${palette.primaryLight};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 0;
  outline: 0;
  background-color: ${({ cellType }) => getCellBg(cellType)};
  ${({ size }) => size && `width: ${size}; height: ${size};`}
  ${boxShadow}
  && > svg {
    width: 50%;
    height: 50%;
  }
`;

export default function Cell({ ...rest }: Props) {
  const label = rest.cellType ? 'Empty Cell' : rest.cellType === 1 ? 'X Cell' : 'O Cell';
  return (
    <CellContainer aria-label={label} {...rest}>
      {rest.cellType && (
        <FontAwesomeIcon icon={rest.cellType === 1 ? faTimes : faCircle} />
      )}
    </CellContainer>
  );
}
