import {
  Events,
  GameStartedResponse,
  JoinLobbyResponse_NewPlayer,
  JoinLobbyResponse_Reconnection,
  JoinLobbyResponse_Spectator,
  SyncResponse,
} from '@u3t/common';
import { useEffect, useReducer, useRef } from 'react';

export interface IMultiplayerState {
  playerId: null | string;
  playerSeat: null | 1 | 2;
  lobbyId: null | string;
  isSpectator: boolean;
  restartRequested: boolean;
  started: boolean;
  hasJoined: boolean;
}

const initialState: IMultiplayerState = {
  playerId: null,
  playerSeat: null,
  lobbyId: null,
  isSpectator: false,
  restartRequested: false,
  hasJoined: false,
  started: false,
};

type Action =
  | { event: typeof Events.StartGame; data: GameStartedResponse }
  | { event: typeof Events.JoinedLobby; data: JoinLobbyResponse_NewPlayer }
  | { event: typeof Events.Sync; data: SyncResponse }
  | { event: typeof Events.RejoinedGame; data: JoinLobbyResponse_Reconnection }
  | { event: typeof Events.JoinedAsSpectator; data: JoinLobbyResponse_Spectator }
  | { event: typeof Events.RestartRequested }
  | { event: 'set'; data: Partial<IMultiplayerState> }
  | { event: 'reset' };

export function reducer(state: IMultiplayerState, action: Action): IMultiplayerState {
  switch (action.event) {
    case Events.StartGame: {
      return {
        ...state,
        started: true,
        playerId: action.data.playerId,
        playerSeat: action.data.seat,
      };
    }
    case Events.JoinedLobby: {
      return {
        ...state,
        hasJoined: true,
        lobbyId: action.data.lobbyId,
        playerId: action.data.playerId,
      };
    }
    case Events.Sync: {
      return {
        ...state,
        playerSeat: action.data.seat || state.playerSeat,
        restartRequested: action.data.state.turn === 1 ? false : state.restartRequested,
      };
    }
    case Events.RejoinedGame: {
      return {
        ...state,
        hasJoined: true,
        started: action.data.started,
        lobbyId: action.data.lobbyId,
        playerSeat: action.data.seat || null,
      };
    }
    case Events.JoinedAsSpectator: {
      return {
        ...state,
        hasJoined: true,
        isSpectator: true,
        started: true,
      };
    }
    case Events.RestartRequested: {
      return {
        ...state,
        restartRequested: true,
      };
    }
    case 'set': {
      return {
        ...state,
        ...action.data,
      };
    }
    case 'reset': {
      return { ...initialState };
    }
    default:
      return state;
  }
}

export default function (passedState: Partial<IMultiplayerState>) {
  const [lobbyState, dispatch] = useReducer(reducer, { ...initialState, ...passedState });
  const lobbyStateRef = useRef<IMultiplayerState>(lobbyState);

  useEffect(() => {
    lobbyStateRef.current = lobbyState;
  }, [lobbyState]);

  return { lobbyState, lobbyStateRef, dispatch };
}
