import { Events, RestartRequestArgs, ServerManager, ServerSocket } from '@u3t/common';

import { lobbies } from '../entities';

async function RequestRestart(
  data: RestartRequestArgs,
  socket: ServerSocket,
  io: ServerManager
) {
  const lobby = lobbies.get(data.lobbyId);

  const hasRestarted = lobby.requestRestart(data.playerId, socket.id);

  if (!hasRestarted) {
    io.to(lobby.id).emit(Events.RestartRequested);
  } else {
    const game = lobby.getGame();

    // Send the game state and seat to players individually
    lobby.players.forEach((id) => {
      io.to(id).emit(Events.Sync, { state: game.getState(), seat: game.getSeat(id) });
    });

    // Send the game state to the whole room (for spectators)
    io.to(lobby.id).emit(Events.Sync, { state: game.getState() });
  }
}

export default RequestRestart;
