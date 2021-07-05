import { Events, ForfeitRequestArgs, ServerManager } from '@u3t/common';

import { lobbies } from '../entities';

async function Forfeit(data: ForfeitRequestArgs, io: ServerManager) {
  const lobby = lobbies.get(data.lobbyId);
  const state = lobby.forfeit(data.playerId);

  io.to(lobby.id).emit(Events.Sync, { state });
}

export default Forfeit;
