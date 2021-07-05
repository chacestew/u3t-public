import * as Sentry from '@sentry/node';
import { instrument } from '@socket.io/admin-ui';
import {
  ClientToServerEvents,
  Events,
  IdFields,
  ServerToClientEvents,
} from '@u3t/common';
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

import { BadRequestError, NotFoundError } from './errors';
import {
  createLobby,
  forfeit,
  joinLobby,
  playTurn,
  requestRestart,
  resync,
} from './handlers';
import logger from './logger';

const io = new Server<ClientToServerEvents, ServerToClientEvents>();

const errorHandlerFactory = (socket: Socket) => (
  err: Error | BadRequestError | NotFoundError
) => {
  Sentry.captureException(err);
  let errorData = { socket: socket.id };

  if (err instanceof NotFoundError) {
    socket.emit('error', { code: 'not-found' });
    errorData = { ...errorData, ...err.data };
  }

  logger.error(err.message, errorData);
};

const joinRooms = (data: Partial<IdFields>, socket: Socket) => {
  if (!data) return;
  if (data.lobbyId) socket.join(data.lobbyId);
  if (data.playerId) socket.join(data.playerId);
};

io.on('connection', (socket) => {
  logger.info('New connection', { socket: socket.id });

  const errorHandler = errorHandlerFactory(socket);

  if (process.env.NODE_ENV === 'development') {
    socket.use((socket, next) => {
      setTimeout(() => {
        next();
      }, 500);
    });
  }

  socket.use(([event, data], next) => {
    if (event !== 'disconnect' && event !== Events.CreateLobby) {
      joinRooms(data, socket);
    }
    next();
  });

  socket.on(Events.CreateLobby, (cb) => {
    logger.info(`CreateLobby`, { socket: socket.id });

    createLobby(cb)
      .then((data) => joinRooms(data, socket))
      .catch(errorHandler);
  });

  socket.on(Events.JoinLobby, (data, cb) => {
    logger.info(`JoinLobby`, { socket: socket.id, ...data });

    joinLobby(socket, io, data, cb).catch(errorHandler);
  });

  socket.on(Events.PlayTurn, (data, cb) => {
    logger.info(`PlayTurn`, { socket: socket.id, ...data });

    playTurn(data, io, cb).catch(errorHandler);
  });

  socket.on(Events.Restart, (data) => {
    logger.info(`RequestRestart`, { socket: socket.id, ...data });

    requestRestart(data, socket, io).catch(errorHandler);
  });

  socket.on(Events.Forfeit, (data) => {
    logger.info(`Forfeit`, { socket: socket.id, ...data });

    forfeit(data, io).catch(errorHandler);
  });

  socket.on(Events.Resync, (data) => {
    logger.info('Reconnect', { socket: socket.id, ...data });

    resync(data, socket).catch(errorHandler);
  });

  socket.on('disconnect', () => {
    logger.info('Closed connection', { socket: socket.id });
  });
});

export default function attachSockets(server: HttpServer) {
  const origin = ['https://admin.socket.io'];

  if (process.env.NODE_ENV === 'development') origin.push('http://localhost:8000');

  io.attach(server, {
    path: '/ws',
    cors: {
      origin,
      credentials: true,
    },
  });

  if (process.env.IO_ADMIN_PASS) {
    instrument(io, {
      auth: {
        type: 'basic',
        username: 'admin',
        password: process.env.IO_ADMIN_PASS,
      },
    });
  }
}
