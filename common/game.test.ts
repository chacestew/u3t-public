import play, { getInitialState } from './game';
import { ITurnInput, Errors, IGameState } from './types';

// Errors

test('playing on the wrong turn throws an error', () => {
  expect(play(getInitialState(), { player: 2, board: 1, cell: 8 }, true).error).toBe(
    Errors.WrongTurn
  );
});

test('playing on an occupied cell throws an error', () => {
  const { state } = play(getInitialState(), { player: 1, board: 1, cell: 1 }, true);
  expect(play(state, { player: 2, board: 1, cell: 1 }, true).error).toBe(
    Errors.CellOccupied
  );
});

test('should win board after making diagonal', () => {
  const state: IGameState = {
    turn: 6,
    currentPlayer: 2,
    boards: [
      {
        winner: 1,
        cells: [1, null, null, null, 1, null, null, null, 1],
        cellsOpen: 6,
      },
      {
        winner: null,
        cells: [null, null, null, null, null, null, null, null, null],
        cellsOpen: 9,
      },
      {
        winner: null,
        cells: [null, null, null, null, null, null, null, null, null],
        cellsOpen: 9,
      },
      {
        winner: null,
        cells: [null, null, null, null, null, null, null, null, null],
        cellsOpen: 9,
      },
      {
        winner: null,
        cells: [2, null, null, null, null, null, null, null, null],
        cellsOpen: 8,
      },
      {
        winner: null,
        cells: [null, null, null, null, null, null, null, null, null],
        cellsOpen: 9,
      },
      {
        winner: null,
        cells: [null, null, null, null, null, null, null, null, null],
        cellsOpen: 9,
      },
      {
        winner: null,
        cells: [null, null, null, null, null, null, null, null, null],
        cellsOpen: 9,
      },
      {
        winner: null,
        cells: [2, null, null, null, null, null, null, null, null],
        cellsOpen: 8,
      },
    ],
    activeBoard: [1, 2, 3, 4, 5, 6, 7, 8],
    winner: null,
    totalCellsOpen: 70,
    tied: false,
    finished: false,
    winningSet: [],
    turnList: [
      { player: 1, board: 0, cell: 8 },
      { player: 2, board: 8, cell: 0 },
      { player: 1, board: 0, cell: 4 },
      { player: 2, board: 4, cell: 0 },
      { player: 1, board: 0, cell: 0 },
    ],
  };
  expect(play(state, { player: 2, board: 0, cell: 2 }, true).error).toBe(
    Errors.BoardNotPlayable
  );
});

test('should win board after making diagonal', () => {
  const state: IGameState = {
    turn: 5,
    currentPlayer: 1,
    boards: [
      {
        winner: null,
        cells: [null, null, null, null, 1, null, null, null, 1],
        cellsOpen: 7,
      },
      {
        winner: null,
        cells: [null, null, null, null, null, null, null, null, null],
        cellsOpen: 9,
      },
      {
        winner: null,
        cells: [null, null, null, null, null, null, null, null, null],
        cellsOpen: 9,
      },
      {
        winner: null,
        cells: [null, null, null, null, null, null, null, null, null],
        cellsOpen: 9,
      },
      {
        winner: null,
        cells: [2, null, null, null, null, null, null, null, null],
        cellsOpen: 8,
      },
      {
        winner: null,
        cells: [null, null, null, null, null, null, null, null, null],
        cellsOpen: 9,
      },
      {
        winner: null,
        cells: [null, null, null, null, null, null, null, null, null],
        cellsOpen: 9,
      },
      {
        winner: null,
        cells: [null, null, null, null, null, null, null, null, null],
        cellsOpen: 9,
      },
      {
        winner: null,
        cells: [2, null, null, null, null, null, null, null, null],
        cellsOpen: 8,
      },
    ],
    activeBoard: [0],
    winner: null,
    totalCellsOpen: 77,
    tied: false,
    finished: false,
    winningSet: [],
    turnList: [
      { player: 1, board: 0, cell: 8 },
      { player: 2, board: 8, cell: 0 },
      { player: 1, board: 0, cell: 4 },
      { player: 2, board: 4, cell: 0 },
    ],
  };
  expect(play(state, { player: 1, board: 0, cell: 0 }, true).state.boards[0].winner).toBe(
    1
  );
});

test('should return an error if playing a turn after game is finished', () => {
  const state: IGameState = {
    turn: 42,
    currentPlayer: 2,
    boards: [
      {
        winner: 1,
        cells: [2, null, 1, 2, 1, null, 1, null, null],
        cellsOpen: 4,
      },
      {
        winner: null,
        cells: [null, 2, null, 2, 1, null, null, 1, 1],
        cellsOpen: 4,
      },
      {
        winner: null,
        cells: [null, null, 1, 2, null, 2, null, 2, 1],
        cellsOpen: 4,
      },
      {
        winner: 1,
        cells: [1, null, 1, 1, null, null, 1, null, 1],
        cellsOpen: 4,
      },
      {
        winner: null,
        cells: [1, 1, 2, null, null, 2, 1, null, 1],
        cellsOpen: 3,
      },
      {
        winner: null,
        cells: [null, null, null, null, null, null, 1, null, 1],
        cellsOpen: 7,
      },
      {
        winner: 2,
        cells: [2, null, 2, null, 2, null, 2, 1, null],
        cellsOpen: 4,
      },
      {
        winner: 2,
        cells: [null, 1, null, 2, 2, 2, null, null, null],
        cellsOpen: 5,
      },
      {
        winner: 2,
        cells: [2, 2, null, 2, 2, null, 2, null, null],
        cellsOpen: 4,
      },
    ],
    activeBoard: [1, 2, 4, 5, 7],
    winner: 2,
    totalCellsOpen: 18,
    tied: false,
    finished: true,
    winningSet: [6, 7, 8],
    turnList: [
      { player: 1, board: 1, cell: 4 },
      { player: 2, board: 4, cell: 2 },
      { player: 1, board: 2, cell: 8 },
      { player: 2, board: 8, cell: 3 },
      { player: 1, board: 3, cell: 2 },
      { player: 2, board: 2, cell: 5 },
      { player: 1, board: 5, cell: 8 },
      { player: 2, board: 8, cell: 1 },
      { player: 1, board: 1, cell: 8 },
      { player: 2, board: 8, cell: 0 },
      { player: 1, board: 0, cell: 2 },
      { player: 2, board: 2, cell: 3 },
      { player: 1, board: 3, cell: 0 },
      { player: 2, board: 0, cell: 3 },
      { player: 1, board: 3, cell: 6 },
      { player: 2, board: 6, cell: 2 },
      { player: 1, board: 2, cell: 2 },
      { player: 2, board: 2, cell: 7 },
      { player: 1, board: 7, cell: 1 },
      { player: 2, board: 1, cell: 3 },
      { player: 1, board: 3, cell: 8 },
      { player: 2, board: 8, cell: 4 },
      { player: 1, board: 4, cell: 8 },
      { player: 2, board: 8, cell: 6 },
      { player: 1, board: 6, cell: 7 },
      { player: 2, board: 7, cell: 4 },
      { player: 1, board: 4, cell: 0 },
      { player: 2, board: 0, cell: 0 },
      { player: 1, board: 0, cell: 6 },
      { player: 2, board: 6, cell: 4 },
      { player: 1, board: 4, cell: 1 },
      { player: 2, board: 1, cell: 1 },
      { player: 1, board: 1, cell: 7 },
      { player: 2, board: 7, cell: 3 },
      { player: 1, board: 3, cell: 3 },
      { player: 2, board: 6, cell: 0 },
      { player: 1, board: 0, cell: 4 },
      { player: 2, board: 4, cell: 5 },
      { player: 1, board: 5, cell: 6 },
      { player: 2, board: 6, cell: 6 },
      { player: 1, board: 4, cell: 6 },
      { player: 2, board: 7, cell: 5 },
    ],
  };

  expect(play(state, { player: 2, board: 0, cell: 1 }, true).error).toBe(
    Errors.GameIsFinished
  );
});
