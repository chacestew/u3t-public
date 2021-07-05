import { Events, ResyncArgs, ServerSocket } from '@u3t/common';

import { lobbies } from '../entities';

async function Resync(data: ResyncArgs, socket: ServerSocket) {
  const lobby = lobbies.get(data.lobbyId);
  const game = lobby.getGame();

  socket.emit(Events.Sync, { state: game.getState(), seat: game.getSeat(data.playerId) });
}

export default Resync;
