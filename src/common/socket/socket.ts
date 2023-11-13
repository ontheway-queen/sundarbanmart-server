import { Application } from 'express';
import { Server } from 'socket.io';
import http from 'http';
export let io: Server;

export const socketServer = (app: Application) => {
  const server = http.createServer(app);
  io = new Server(server, {
    path: '/api/socket',
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://server.sunderbanmart.com',
        'https://www.server.sunderbanmart.com',
        'https://sunderbanmart.com',
        'https://www.sunderbanmart.com',
        'https://admin.sunderbanmart.com',
        'https://www.admin.sunderbanmart.com',
      ],
      credentials: true,
    },
  });
  return server;
};
