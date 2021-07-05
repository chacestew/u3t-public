import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Board as BoardType,
  Board as CellType,
  ClientSocket,
  ErrorParams,
  Events,
  Player,
} from '@u3t/common';
import React, { useEffect, useState } from 'react';
import { StaticContext } from 'react-router';
import { Prompt, RouteComponentProps } from 'react-router-dom';

import ErrorModal from '../../Components/ErrorModal';
import Board from '../../Components/GameArea/GlobalBoard/GlobalBoard';
import RestartButton from '../../Components/GameArea/TurnList/RestartButton';
import TurnList from '../../Components/GameArea/TurnList/TurnList';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useGameReducer from '../../hooks/useGameReducer';
import useMultiplerState from '../../hooks/useLobbyReducer';
import useNavigatorOnline from '../../hooks/useNavigatorOnline';
import { RelativeBox } from '../../styles/Utils';
import LobbyHeader from './LobbyHeader';
import { Reconnecting } from './Reconnecting';

type RouteProps = RouteComponentProps<
  { lobbyId: string },
  StaticContext,
  { lobbyId?: string; playerId?: string }
>;

interface Props extends RouteProps {
  spectator?: boolean;
  socket: ClientSocket;
}

const OnlineGame = ({ history, match, location, spectator, socket }: Props) => {
  const [state, { playTurn, setState, restart }] = useGameReducer();
  const [error, setError] = useState<ErrorParams | null>(null);
  const isNavigatorOnline = useNavigatorOnline();
  const [socketConnectionLost, setSocketConnectionLost] = useState(false);
  const hasLostConnection = !isNavigatorOnline || socketConnectionLost;
  const setTitle = useDocumentTitle(match.params.lobbyId || '');

  const locationState = location.state || { lobbyId: undefined, playerId: undefined };

  const { lobbyState, lobbyStateRef, dispatch } = useMultiplerState({
    isSpectator: !!spectator,
    hasJoined: !!locationState.playerId,
    lobbyId: locationState.lobbyId || match.params.lobbyId,
    playerId: locationState.playerId || sessionStorage.getItem(match.params.lobbyId),
  });

  useEffect(() => {
    if (location.state) history.replace(history.location.pathname, undefined);
  }, [history, location.state]);

  useEffect(() => {
    if (socket.disconnected) socket.connect();

    socket.on(Events.StartGame, (data) => {
      dispatch({ event: Events.StartGame, data });
      setState(data.state);
    });

    socket.on(Events.Sync, (data) => {
      dispatch({ event: Events.Sync, data });
      setState(data.state);
    });

    socket.on(Events.RestartRequested, () => {
      dispatch({ event: Events.RestartRequested });
    });

    socket.on(Events.Error, (error) => setError(error));

    socket.on('disconnect', () => setSocketConnectionLost(true));

    socket.io.on('reconnect', () => {
      setSocketConnectionLost(false);
      socket.emit(Events.Resync, {
        playerId: lobbyStateRef.current.playerId!,
        lobbyId: lobbyStateRef.current.lobbyId!,
      });
    });

    return () => {
      console.log('Removing listeners');
      socket.off();
      socket.io.off();
      socket.disconnect();
    };
  }, [lobbyStateRef, socket, restart, setError, setState, history, dispatch]);

  useEffect(() => {
    if (lobbyState.hasJoined && lobbyState.lobbyId && lobbyState.playerId) {
      // Created the game and was joined at the home screen
      sessionStorage.setItem(lobbyState.lobbyId, lobbyState.playerId);
      return;
    }

    // Joined the game from a fresh page load
    socket.emit(
      Events.JoinLobby,
      {
        lobbyId: lobbyState.lobbyId,
        playerId: lobbyState.playerId,
        spectator: lobbyState.isSpectator,
      },
      (data) => {
        switch (data.role) {
          case 'new-player':
            sessionStorage.setItem(data.lobbyId, data.playerId);
            dispatch({ event: Events.JoinedLobby, data });
            break;
          case 'reconnected-player':
            dispatch({ event: Events.RejoinedGame, data });
            if (data.state) setState(data.state);
            break;
          case 'spectator':
            dispatch({ event: Events.JoinedAsSpectator, data });
            setState(data.state);
        }
      }
    );
  }, [
    dispatch,
    lobbyState.hasJoined,
    lobbyState.isSpectator,
    lobbyState.lobbyId,
    lobbyState.playerId,
    setState,
    socket,
  ]);

  useEffect(() => {
    if (state.winner) setTitle(`${state.winner === 1 ? 'X' : 'O'} wins!`);
    else if (state.tied) setTitle('Stalemate');
    else if (lobbyState.started) {
      if (lobbyState.playerSeat) {
        setTitle(
          `${
            state.currentPlayer === lobbyState.playerSeat
              ? 'Your turn'
              : "Opponent's turn"
          }`
        );
      } else {
        setTitle(`${state.currentPlayer === 1 ? 'X' : 'O'}'s turn`);
      }
    } else if (lobbyState.isSpectator) setTitle('Spectating');
    else if (lobbyState.lobbyId) setTitle(`${lobbyState.lobbyId}`);
  }, [
    lobbyState.isSpectator,
    lobbyState.lobbyId,
    lobbyState.playerSeat,
    lobbyState.started,
    setTitle,
    state.currentPlayer,
    state.tied,
    state.winner,
  ]);

  const onValidTurn = ({ board, cell }: { board: BoardType; cell: CellType }) => {
    const { playerSeat, playerId, lobbyId } = lobbyState;
    const player = playerSeat as Player;

    playTurn({ player, board, cell });
    socket.emit(
      Events.PlayTurn,
      {
        lobbyId: lobbyId!,
        playerId: playerId!,
        board,
        cell,
      },
      (res) => {
        if (!res.valid) {
          setState(res.state);
        }
      }
    );
  };

  const restartGame = () => {
    socket.emit(Events.Restart, {
      playerId: lobbyState.playerId!,
      lobbyId: lobbyState.lobbyId!,
    });
  };

  const forfeitGame = () => {
    if (!window.confirm('Are you sure you want to forfeit?')) return;
    socket.emit(Events.Forfeit, {
      playerId: lobbyState.playerId!,
      lobbyId: lobbyState.lobbyId!,
    });
  };

  return (
    <>
      <Prompt
        when={lobbyState.started && !state.finished}
        message={`Are you sure you want to leave the game?\n\nYou can rejoin within 24 hours using this code: ${lobbyState.lobbyId}`}
      />
      <LobbyHeader
        state={state}
        lobbyState={lobbyState}
        seat={lobbyState.playerSeat!}
        onPlayAgainConfirm={restartGame}
        restartRequested={lobbyState.restartRequested}
      />
      <RelativeBox>
        <Board
          Alert={hasLostConnection && <Reconnecting />}
          Modal={error && <ErrorModal />}
          seat={lobbyState.playerSeat}
          state={state}
          onValidTurn={onValidTurn}
          disabled={hasLostConnection}
        />
        {state && (
          <TurnList
            lobbyState={lobbyState}
            state={state}
            RestartButton={
              <RestartButton
                disabled={!lobbyState.started}
                onClick={forfeitGame}
                text="Forfeit"
                icon={
                  <FontAwesomeIcon
                    color="white"
                    stroke="#594b5c"
                    strokeWidth="50"
                    icon={faFlag}
                  />
                }
              />
            }
          />
        )}
      </RelativeBox>
    </>
  );
};

export default OnlineGame;
