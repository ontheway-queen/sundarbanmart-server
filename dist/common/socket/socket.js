"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketServer = exports.io = void 0;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const socketServer = (app) => {
    const server = http_1.default.createServer(app);
    exports.io = new socket_io_1.Server(server, {
        path: '/api/socket',
        cors: {
            origin: [
                'http://localhost:3000',
                'http://192.168.0.237:3000',
                'http://192.168.0.237:3001',
                'http://192.168.0.238:3000',
                'http://192.168.0.238:3001',
                'http://localhost:3001',
                'https://server.sunderbanmart.com',
                'https://www.server.sunderbanmart.com',
                'https://sunderbanmart.com',
                'https://www.sunderbanmart.com',
                'https://admin.sunderbanmart.com',
                'https://www.admin.sunderbanmart.com',
                'https://main.d1qfwt8w8le6q6.amplifyapp.com',
            ],
            credentials: true,
        },
    });
    return server;
};
exports.socketServer = socketServer;
//# sourceMappingURL=socket.js.map