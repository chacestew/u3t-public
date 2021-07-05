import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Board as BoardType,
  Cell as CellType,
  IBoardState,
  ITurnInput,
  Player,
} from '@u3t/common';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { media } from '../../../styles/mixins';
import palette from '../../../utils/palette';
import Grid from '../../Grid';
import { getCellBg } from '../Cell/Cell';
import Cell from './Cell';

const InnerGrid = styled(Grid)<{ bgColor?: string }>`
  grid-gap: 0.25em;
  padding: 0.25em;
  border-style: solid;
  border-color: ${palette.primaryLight};
  border-width: 0 2px 2px 0;

  ${media.aboveMobileL`
    border-width: 0 0.25em 0.25em 0;
    grid-gap: 0.5em; padding: 0.5em;
  `}

  &:nth-child(3n) {
    border-right: 0;
  }
  &:nth-child(n + 7) {
    border-bottom: 0;
  }
  &.flashing {
    background-color: ${(p) => p.bgColor};
  }
`;

interface Props {
  flashing: boolean;
  gameWinner: null | Player;
  winningSet: Array<null | number>;
  data: IBoardState;
  boardIndex: BoardType;
  onClick: (turnInput: Omit<ITurnInput, 'player'>) => void;
  seat: Player;
  activeBoard: BoardType[];
}

const Board = ({
  flashing,
  gameWinner,
  winningSet,
  data: { cells, winner: boardWinner },
  seat,
  boardIndex,
  onClick,
  activeBoard,
}: Props) => {
  const handleClick = (cellIndex: CellType) => {
    onClick({ board: boardIndex, cell: cellIndex });
  };
  const active = !gameWinner && activeBoard.includes(boardIndex);
  const shouldDim = useMemo(
    () => (gameWinner ? !winningSet.includes(boardIndex) : !active),
    [gameWinner, winningSet, boardIndex, active]
  );
  return (
    <InnerGrid
      className={active && flashing ? 'flashing' : undefined}
      bgColor={getCellBg(seat)}
    >
      {boardWinner && (
        <FontAwesomeIcon
          color={palette.primaryLight}
          style={{
            position: 'absolute',
            width: '80%',
            height: '80%',
            top: '50%',
            left: '50%',
            marginTop: '-40%',
            marginLeft: '-40%',
            zIndex: 1,
          }}
          icon={boardWinner === 1 ? faTimes : faCircle}
        />
      )}
      {cells.map((cell, i) => (
        <Cell
          shouldDim={shouldDim}
          inPlayableArea={active}
          onClick={handleClick}
          cellType={cell}
          cellIndex={i as CellType}
          key={i}
        />
      ))}
    </InnerGrid>
  );
};

export default Board;
