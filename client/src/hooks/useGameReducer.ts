import playTurn, { getInitialState, IGameState, ITurnInput } from '@u3t/common';
import { useMemo, useReducer } from 'react';

const PLAY_TURN = 'play-turn';
const SET_STATE = 'set-state';
const RESTART = 'restart';
const UNDO = 'undo';

type Action =
  | { type: typeof PLAY_TURN; payload: ITurnInput }
  | { type: typeof SET_STATE; payload: IGameState }
  | { type: typeof RESTART }
  | { type: typeof UNDO };

function reducer(state: IGameState, action: Action): IGameState {
  switch (action.type) {
    case PLAY_TURN: {
      const turnInput = action.payload;
      return playTurn(state, turnInput).state;
    }
    case SET_STATE: {
      return action.payload;
    }
    case RESTART: {
      return getInitialState();
    }
    default:
      return state;
  }
}

interface Dispatchers {
  playTurn: (payload: ITurnInput) => void;
  setState: (payload: IGameState) => void;
  restart: () => void;
}

export default function (): [IGameState, Dispatchers] {
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const dispatchers = useMemo(
    () => ({
      playTurn: (payload: ITurnInput) => {
        dispatch({ type: PLAY_TURN, payload });
      },
      setState: (payload: IGameState) => {
        dispatch({ type: SET_STATE, payload });
      },
      restart: () => {
        dispatch({ type: RESTART });
      },
      undo: () => {
        dispatch({ type: UNDO });
      },
    }),
    []
  );
  return [state, dispatchers];
}
