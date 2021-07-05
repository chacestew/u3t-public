import { Ack, CreateLobbyResponse } from '@u3t/common';

import { lobbies } from '../entities';

async function createLobby(cb: Ack<CreateLobbyResponse>) {
  const lobby = lobbies.create();
  const playerId = lobby.addPlayer();
  const data = { lobbyId: lobby.id, playerId };
  cb(data);
  return data;
}

export default createLobby;
