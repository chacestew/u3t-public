import { IGameState } from '@u3t/common';
import React from 'react';

import Finished from '../../Components/GameArea/Header/HeaderContents/Finished';
import InPlay from '../../Components/GameArea/Header/HeaderContents/InPlay';
import Loading from '../../Components/GameArea/Header/HeaderContents/Loading';
import Share from '../../Components/GameArea/Header/HeaderContents/Share';
import { IMultiplayerState } from '../../hooks/useLobbyReducer';

export type Mode = 'home' | 'loading' | 'share' | 'local' | 'online' | 'spectator';

interface Props {
  seat: 1 | 2;
  lobbyState: IMultiplayerState;
  state: IGameState;
  restartRequested?: boolean;
  onPlayAgainConfirm: () => void;
}

function SpectatorHeader({ state }: { state: IGameState }) {
  return (
    <InPlay
      text="You are spectating"
      cell={state.currentPlayer}
      boards={state.boards}
      activeBoard={state.activeBoard}
    />
  );
}

function ShareHeader({ lobbyId }: { lobbyId: string }) {
  return <Share lobbyId={lobbyId} />;
}

function ActiveGame({ seat, state }: { seat: 1 | 2; state: IGameState }) {
  return (
    <InPlay
      text={state.currentPlayer === seat ? 'You to play' : 'Opponent to play'}
      cell={seat}
      boards={state.boards}
      activeBoard={state.activeBoard}
    />
  );
}

export default function LobbyHeader({
  lobbyState,
  state,
  seat,
  onPlayAgainConfirm,
  restartRequested,
}: Props) {
  // As spectator
  if (lobbyState.isSpectator) return <SpectatorHeader state={state} />;

  // Before game
  if (lobbyState.lobbyId && !lobbyState.started && lobbyState.hasJoined) {
    return <ShareHeader lobbyId={lobbyState.lobbyId} />;
  }

  // After game
  if (state.finished)
    return (
      <Finished
        winner={state.winner}
        isOnline
        onPlayAgainConfirm={onPlayAgainConfirm}
        restartRequested={restartRequested}
      />
    );

  // During game
  if (lobbyState.playerSeat) return <ActiveGame seat={seat} state={state} />;

  // While loading
  return <Loading />;
}
