import {
  Board,
  Cell,
  ErrorParams,
  Errors,
  IGameState,
  isInvalidTurn,
  ITurnInput,
  Player,
} from '@u3t/common';
import React, { useState } from 'react';
import styled from 'styled-components';

import { gridSize } from '../../../utils/palette';
import Grid from '../../Grid';
import LocalBoard from '../LocalBoard/LocalBoard';

interface Props {
  state: IGameState;
  seat?: null | Player;
  error?: ErrorParams | null;
  dismissError?: () => void;
  onValidTurn?: (turnInput: ITurnInput) => void;
  onInvalidTurn?: (error: Errors) => void;
  Alert?: false | React.ReactElement;
  disabled?: boolean;
  Modal?: React.ReactElement | null;
}

const Container = styled.div`
  position: relative;
`;

const OuterGrid = styled(Grid)<{ disabled?: boolean }>`
  width: 100vw;
  height: 100vw;
  max-width: ${gridSize};
  max-height: ${gridSize};

  ${(props) =>
    props.disabled &&
    `
      pointer-events: none; 
      opacity: 0.6;
    `}
`;

export default function GameView({
  state,
  seat,
  onValidTurn,
  onInvalidTurn,
  Modal,
  Alert,
  disabled,
}: Props) {
  const { boards, activeBoard, winner, winningSet } = state;
  const [flashing, setFlashing] = useState(false);

  const onPlay = (turnInput: { board: Board; cell: Cell }) => {
    if (disabled) return;
    const turn = { player: seat!, ...turnInput };
    const invalidTurnError = isInvalidTurn(state, turn);
    if (invalidTurnError) {
      onInvalidTurn && onInvalidTurn(invalidTurnError);
      if (invalidTurnError === Errors.BoardNotPlayable) {
        if (flashing) return;
        setFlashing(true);
        setTimeout(() => {
          setFlashing(false);
        }, 350);
      }
    } else {
      onValidTurn && onValidTurn(turn);
    }
  };

  return (
    <Container>
      {Modal && Modal}
      {Alert && Alert}
      <OuterGrid disabled={disabled}>
        {boards.map((b, i) => (
          <LocalBoard
            seat={seat!}
            key={i}
            data={b}
            flashing={flashing}
            gameWinner={winner}
            winningSet={winningSet}
            boardIndex={i as Cell}
            activeBoard={activeBoard}
            onClick={onPlay}
          />
        ))}
      </OuterGrid>
    </Container>
  );
}
