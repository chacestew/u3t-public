import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ITurnInput } from '@u3t/common';
import React from 'react';

import Board from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import GameHeader from '../../Components/GameArea/Header/GameHeader';
import RestartButton from '../../Components/GameArea/TurnList/RestartButton';
import TurnList from '../../Components/GameArea/TurnList/TurnList';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useGameReducer from '../../hooks/useGameReducer';
import { RelativeBox } from '../../styles/Utils';

export default function HotSeat() {
  const [state, { playTurn, restart }] = useGameReducer();
  useDocumentTitle('Hotseat');

  const onValidTurn = ({ board, cell }: ITurnInput) => {
    const player = state.currentPlayer;

    playTurn({ player, board, cell });
  };

  return (
    <>
      <GameHeader seat={state.currentPlayer} state={state} onPlayAgainConfirm={restart} />
      <RelativeBox>
        <Board state={state} seat={state.currentPlayer} onValidTurn={onValidTurn} />
        <TurnList
          state={state}
          lobbyState={{ started: true }}
          RestartButton={
            <RestartButton
              onClick={restart}
              text="Restart"
              icon={<FontAwesomeIcon icon={faRedo} />}
            />
          }
        />
      </RelativeBox>
    </>
  );
}
