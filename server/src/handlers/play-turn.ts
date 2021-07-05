import {
  Ack,
  Events,
  PlayTurnRequestArgs,
  PlayTurnResponse,
  ServerManager,
} from '@u3t/common';

import { lobbies } from '../entities';

async function PlayTurn(
  data: PlayTurnRequestArgs,
  io: ServerManager,
  cb: Ack<PlayTurnResponse>
) {
  const lobby = lobbies.get(data.lobbyId);
  const seat = lobby.getGame().getSeat(data.playerId);

  const payload = {
    player: seat,
    board: data.board,
    cell: data.cell,
  };

  const error = lobby.playTurn(payload).error;

  const state = lobby.getGame().getState();

  if (error) {
    cb({ valid: false, state });
    throw new Error(error);
  }

  cb({ valid: true });
  io.to(lobby.id).emit(Events.Sync, { state });
}

export default PlayTurn;
