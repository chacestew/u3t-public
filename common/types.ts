import { Socket as SocketIOClientSocket } from 'socket.io-client';
import { Server, Socket } from 'socket.io';

export type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Board = Cell;
export type Player = 1 | 2;

export interface IBoardState {
  winner: null | Player;
  cells: Array<Player | null>;
  cellsOpen: number;
}

export interface IGameState {
  turn: number;
  turnList: ITurnInput[];
  currentPlayer: Player;
  boards: Array<IBoardState>;
  activeBoard: Board[];
  winner: null | Player;
  winningSet: number[];
  totalCellsOpen: number;
  tied: boolean;
  finished: boolean;
}

export interface ITurnInput {
  player: Player;
  board: Board;
  cell: Cell;
}

export enum Errors {
  GameIsFinished = 'GameIsFinished',
  WrongTurn = 'WrongTurn',
  BoardNotPlayable = 'Board not playable',
  CellOccupied = 'Cell is occupied',
}

export const Events = {
  CreateLobby: 'create-lobby',
  StartGame: 'start-game',
  RejoinedGame: 'rejoined-game', // local only
  JoinLobby: 'join-lobby',
  PlayTurn: 'play-turn',
  Sync: 'sync',
  Restart: 'restart-game',
  RestartRequested: 'restart-requested',
  JoinedAsSpectator: 'joined-as-spectator', // local only
  Error: 'error',
  Forfeit: 'forfeit',
  JoinedLobby: 'joined-lobby', // local only
  Resync: 'resync',
} as const;

export interface ClientToServerEvents {
  [Events.CreateLobby]: (cb: Ack<CreateLobbyResponse>) => void;
  [Events.JoinLobby]: (data: JoinLobbyRequestArgs, cb: Ack<JoinLobbyResponses>) => void;
  [Events.Resync]: (data: ResyncArgs) => void;
  [Events.PlayTurn]: (data: PlayTurnRequestArgs, cb: Ack<PlayTurnResponse>) => void;
  [Events.Forfeit]: (data: ForfeitRequestArgs) => void;
  [Events.Restart]: (data: RestartRequestArgs) => void;
}

export interface ServerToClientEvents {
  [Events.StartGame]: (data: GameStartedResponse) => void;
  [Events.Sync]: (data: SyncResponse) => void;
  [Events.RestartRequested]: () => void;
  [Events.JoinedLobby]: (data: JoinLobbyResponses) => void;
  [Events.Error]: (data: ErrorParams) => void;
}

export type ClientSocket = SocketIOClientSocket<
  ServerToClientEvents,
  ClientToServerEvents
>;

export type ServerSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export type ServerManager = Server<ClientToServerEvents, ServerToClientEvents>;

export type ErrorParams = {
  code: 'not-found';
  errorData?: { [key: string]: string };
};

export type Ack<ResponsePayload> = (payload: ResponsePayload) => void;

// CreateLobby

export type CreateLobbyResponse = {
  lobbyId: string;
  playerId: string;
};

// JoinLobby

export interface JoinLobbyRequestArgs {
  lobbyId: string | null;
  playerId?: string | null;
  spectator?: boolean;
}

export type JoinLobbyResponses =
  | JoinLobbyResponse_NewPlayer
  | JoinLobbyResponse_Reconnection
  | JoinLobbyResponse_Spectator;

export interface JoinLobbyResponse_NewPlayer {
  role: 'new-player';
  lobbyId: string;
  playerId: string;
}

export interface JoinLobbyResponse_Spectator {
  role: 'spectator';
  lobbyId: string;
  state: IGameState;
}

export interface JoinLobbyResponse_Reconnection {
  role: 'reconnected-player';
  lobbyId: string;
  playerId: string;
  started: boolean;
  state?: IGameState;
  seat?: Player;
}

// Auth

export interface IdFields {
  lobbyId: string;
  playerId: string;
}

// PlayTurn

export interface PlayTurnRequestArgs extends IdFields {
  board: Board;
  cell: Cell;
}

export type PlayTurnResponse =
  | {
      valid: true;
    }
  | { valid: false; state: IGameState };

// GameStarted

export interface GameStartedResponse extends IdFields {
  seat: Player;
  state: IGameState;
}

export type ResyncArgs = IdFields;

// Restart

export type RestartRequestArgs = IdFields;

// Forfeit

export type ForfeitRequestArgs = IdFields;

// Sync

export interface SyncResponse {
  state: IGameState;
  seat?: Player;
}
