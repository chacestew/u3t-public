import { ITurnInput } from '@u3t/common';
import { customAlphabet } from 'nanoid';

import { BadRequestError, NotFoundError } from '../errors';
import logger from '../logger';
import { lobbies } from '.';
import Game from './Game';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);

const minutes = (n: number) => 1000 * 60 * n;

const LOBBY_EXPIRATION_TIME = minutes(3 * 60);

function createID(collection: Map<string, Lobby>): string {
  const id = nanoid();
  if (collection.has(id)) return createID(collection);
  return id;
}

export class Lobby {
  readonly id: string;
  readonly players: Set<string> = new Set();
  readonly restartRequests: Map<string, string> = new Map();
  private game?: Game;
  readonly timer: NodeJS.Timeout;
  logger: (message: string, data?: { [key: string]: unknown }) => void;
  updated: number = new Date().getTime();

  constructor(id: string, destroy: typeof lobbies.remove) {
    this.id = id;
    this.timer = global.setTimeout(() => {
      destroy(this.id, 'expired');
      global.clearInterval(this.timer);
    }, LOBBY_EXPIRATION_TIME);
    this.logger = (message, data) => logger.info(message, data);
  }

  private refresh = () => {
    this.timer.refresh();
  };

  addPlayer() {
    if (this.players.size > 1) throw new BadRequestError('Lobby already has two players');
    const id = `${this.id}_${nanoid()}`;
    this.players.add(id);
    return id;
  }

  requestRestart(id: string, socket: string) {
    this.restartRequests.set(id, socket);

    if (this.restartRequests.size !== 2) return false;

    this.initGame();

    this.restartRequests.clear();

    return true;
  }

  initGame() {
    this.logger('Initialised new game', { data: { lobby: this.id } });
    return (this.game = new Game({
      players: [...this.players.values()],
      onUpdate: this.refresh,
    }));
  }

  hasGame() {
    return !!this.game;
  }

  getGame() {
    if (!this.game) throw new BadRequestError('Game not started');

    return this.game;
  }

  playTurn(turnInput: ITurnInput) {
    this.logger('Playing turn', { ...turnInput });
    return this.getGame().playTurn(turnInput);
  }

  forfeit(player: string) {
    this.logger('Forfeiting', { playerId: player });
    return this.getGame().forfeit(player);
  }

  endGameInstantly() {
    return this.getGame().instantEnd();
  }
}

class LobbyManager {
  lobbies: Map<string, Lobby> = new Map();
  lobbiesMetrics = { created: 0, started: 0, finished: 0 };

  create() {
    const id = createID(this.lobbies);
    const lobby = new Lobby(id, this.remove);
    this.lobbiesMetrics.created += 1;
    this.lobbies.set(lobby.id, lobby);
    logger.info('Created lobby', { lobbyId: lobby.id });
    return lobby;
  }

  remove = (id: string, reason: string) => {
    logger.info('Removed lobby', { lobbyId: id, reason });
    this.lobbiesMetrics.started += lobbies.get(id).hasGame() ? 1 : 0;
    this.lobbiesMetrics.finished +=
      lobbies.get(id).hasGame() && lobbies.get(id).getGame().getState().finished ? 1 : 0;
    return this.lobbies.delete(id);
  };

  get(id: string): Lobby {
    const lobby = this.lobbies.get(id);
    if (!lobby) throw new NotFoundError(`No lobby found for ID: ${id}`, { lobbyId: id });
    return lobby;
  }
}

export default LobbyManager;
