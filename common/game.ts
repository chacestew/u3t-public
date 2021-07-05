import cloneDeep from 'clone-deep';
import * as T from './types';

const getWinnableSets = (cell: T.Cell) => {
  switch (cell) {
    case 0:
      return [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
      ];
    case 1:
      return [
        [0, 1, 2],
        [1, 4, 7],
      ];
    case 2:
      return [
        [0, 1, 2],
        [2, 5, 8],
        [2, 4, 6],
      ];
    case 3:
      return [
        [0, 3, 6],
        [3, 4, 5],
      ];
    case 4:
      return [
        [0, 4, 8],
        [1, 4, 7],
        [2, 4, 6],
        [3, 4, 5],
      ];
    case 5:
      return [
        [2, 5, 8],
        [3, 4, 5],
      ];
    case 6:
      return [
        [0, 3, 6],
        [6, 7, 8],
        [6, 4, 2],
      ];
    case 7:
      return [
        [1, 4, 7],
        [6, 7, 8],
      ];
    case 8:
      return [
        [2, 5, 8],
        [6, 7, 8],
        [8, 4, 0],
      ];
    default:
      return [];
  }
};

// Private
const didWinBoard = (state: T.IGameState, payload: T.ITurnInput) => {
  const board = state.boards[payload.board];

  return getWinnableSets(payload.cell).some(([p1, p2, p3]) =>
    [board.cells[p1], board.cells[p2], board.cells[p3]].every((e) => e === payload.player)
  );
};

const didWinGame = (state: T.IGameState, payload: T.ITurnInput) => {
  const { boards } = state;

  return getWinnableSets(payload.board).find(([p1, p2, p3]) =>
    [boards[p1], boards[p2], boards[p3]].every(({ winner }) => winner === payload.player)
  );
};

// Public
export const generateRandomMove = (state: T.IGameState) => {
  const { boards, currentPlayer: player, activeBoard } = state;
  console.log('state?', state);

  const randomElement = (arr: any) => arr[Math.floor(Math.random() * arr.length)];

  // optimise if reasonable
  const filteredBoards = boards.reduce((all: any, current, i) => {
    if (
      !activeBoard.includes(i as T.Cell) ||
      current.cellsOpen === 0 ||
      current.winner !== null
    )
      return all;

    return [...all, i];
  }, []);
  const board = randomElement(filteredBoards);

  if (!boards[board]) console.error('PROBLEM BOARD:', board);
  const filteredCells = boards[board].cells.reduce((all: any, current, i) => {
    if (current !== null) return all;

    return [...all, i];
  }, []);
  const cell = randomElement(filteredCells);

  return { player, board, cell };
};

export function getInitialState(): T.IGameState {
  return {
    turn: 1,
    currentPlayer: 1,
    boards: Array(9).fill({
      winner: null,
      cells: Array(9).fill(null),
      cellsOpen: 9,
      open: true,
    }),
    activeBoard: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    winner: null,
    totalCellsOpen: 81,
    tied: false,
    finished: false,
    winningSet: [],
    turnList: [],
  };
}

const isOpenBoard = (board: T.IBoardState) => !board.winner && board.cellsOpen > 0;

export function isInvalidTurn(state: T.IGameState, turn: T.ITurnInput) {
  const { player, board, cell } = turn;

  if (state.finished) {
    return T.Errors.GameIsFinished;
  }

  if (state.currentPlayer !== player) {
    // Play out of turn
    return T.Errors.WrongTurn;
  }

  if (!state.activeBoard.includes(board)) {
    // Board not playable
    return T.Errors.BoardNotPlayable;
  }

  if (state.boards[board].cells[cell] !== null) {
    // Cell is occupied
    return T.Errors.CellOccupied;
  }
}

export function forfeit(state: T.IGameState, player: T.Player) {
  const nextState = cloneDeep(state);

  switch (player) {
    case 1:
      nextState.winner = 2;
      break;
    case 2:
      nextState.winner = 1;
  }

  nextState.finished = true;

  return nextState;
}

export default function (
  state: T.IGameState,
  payload: T.ITurnInput,
  validate?: boolean
): { error?: T.Errors; state: T.IGameState } {
  const { player, board, cell } = payload;

  if (validate) {
    const error = isInvalidTurn(state, payload);
    if (error) {
      return { error, state };
    }
  }

  // Turn is valid, proceed to clone state
  const nextState = cloneDeep(state);

  // Record turn input
  nextState.turnList.push(payload);

  // Capture cell
  const currentBoard = nextState.boards[board];
  currentBoard.cells[cell] = player;
  currentBoard.cellsOpen -= 1;
  nextState.totalCellsOpen -= 1;

  if (didWinBoard(nextState, payload)) {
    currentBoard.winner = player;
    nextState.totalCellsOpen -= currentBoard.cellsOpen;

    const winningSet = didWinGame(nextState, payload);

    if (winningSet) {
      nextState.winningSet = winningSet;
      nextState.winner = player;
      nextState.finished = true;

      return { state: nextState };
    }
  }

  if (nextState.totalCellsOpen === 0) {
    nextState.tied = true;
    nextState.finished = true;

    return { state: nextState };
  }

  nextState.turn += 1;
  nextState.currentPlayer = nextState.currentPlayer === 1 ? 2 : 1;
  nextState.activeBoard = isOpenBoard(nextState.boards[cell])
    ? [cell]
    : nextState.boards.reduce((all, b, i) => {
        if (isOpenBoard(b)) all.push(i as T.Cell);
        return all;
      }, [] as T.Cell[]);

  return { state: nextState };
}
