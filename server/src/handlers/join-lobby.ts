import {
  Ack,
  Events,
  JoinLobbyRequestArgs,
  JoinLobbyResponses,
  ServerManager,
  ServerSocket,
} from '@u3t/common';

import { lobbies } from '../entities';
import logger from '../logger';

export default async function joinLobby(
  socket: ServerSocket,
  io: ServerManager,
  data: JoinLobbyRequestArgs,
  cb: Ack<JoinLobbyResponses>
) {
  const lobby = lobbies.get(data.lobbyId);

  // Handle spectator joining
  if ((!data.playerId && lobby.hasGame()) || data.spectator) {
    cb({
      lobbyId: lobby.id,
      state: lobby.getGame().getState(),
      role: 'spectator',
    });
    // Handle player rejoining a game
  } else if (data.playerId) {
    logger.info('Rejoining player to lobby', {
      lobbyId: lobby.id,
      playerId: data.playerId,
    });

    if (lobby.hasGame()) {
      const game = lobby.getGame();

      cb({
        playerId: data.playerId,
        lobbyId: lobby.id,
        seat: game.getSeat(data.playerId),
        state: game.getState(),
        role: 'reconnected-player',
        started: true,
      });
    } else {
      cb({
        playerId: data.playerId,
        lobbyId: lobby.id,
        role: 'reconnected-player',
        started: false,
      });
    }
  } else {
    // Handle first time joining a game
    logger.info('Joining new player to lobby', { lobbyId: lobby.id });
    const playerId = lobby.addPlayer();

    socket.join(playerId);

    cb({ lobbyId: lobby.id, playerId, role: 'new-player' });

    // Start when second player joined
    if (!lobby.hasGame() && lobby.players.size === 2) {
      logger.info('Starting new game for lobby', { lobbyId: lobby.id });
      const game = lobby.initGame();

      lobby.players.forEach((playerId) => {
        logger.info('Emitting game started message:', {
          lobbyId: lobby.id,
          playerId,
          seat: game.getSeat(playerId),
        });
        io.to(playerId).emit(Events.StartGame, {
          lobbyId: lobby.id,
          playerId,
          seat: game.getSeat(playerId),
          state: game.getState(),
        });
      });
    }
  }
}
