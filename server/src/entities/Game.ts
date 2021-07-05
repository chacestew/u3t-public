import play, {
  Errors,
  forfeit,
  generateRandomMove,
  getInitialState,
  IGameState,
  ITurnInput,
  Player,
} from '@u3t/common';

import { BadRequestError } from '../errors';

function instantEnd(state: IGameState): IGameState {
  const turn = generateRandomMove(state);

  const nextState = play(state, turn).state;

  if (nextState.finished) return nextState;

  return instantEnd(nextState);
}

export default class Game {
  // The internal game state
  private state: IGameState = getInitialState();
  // Seats
  readonly seats: string[] = [];
  // Last updated timestamp
  readonly onUpdate: () => void;

  constructor({ players, onUpdate }: { players: string[]; onUpdate: () => void }) {
    this.seats = [...players];
    if (Math.floor(Math.random() * 2)) this.seats.reverse();
    this.onUpdate = onUpdate;
  }

  playTurn(payload: ITurnInput): { error?: Errors; state: IGameState } {
    const nextState = play(this.state, payload, true);

    if (!nextState.error) {
      this.state = nextState.state;
    }

    this.onUpdate();

    return nextState;
  }

  getSeat(id: string) {
    const seat = this.seats.indexOf(id);
    if (seat === -1)
      throw new BadRequestError(`No seat for player ${id}. Current seats: ${this.seats}`);
    return (seat + 1) as Player;
  }

  getState() {
    return this.state;
  }

  forfeit(player: string) {
    const seat = this.getSeat(player);
    return (this.state = forfeit(this.state, seat));
  }

  restart() {
    this.state = getInitialState();
    this.onUpdate();
  }

  instantEnd = () => {
    const nextState = instantEnd(this.state);
    this.state = nextState;
    this.onUpdate();
  };
}
