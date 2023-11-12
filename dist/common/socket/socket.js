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
        cors: {
            origin: [
                'http://localhost:3000',
                'http://localhost:3001',
                'http://localhost:3002',
                'http://onthe-way.com',
                'https://onthe-way.com',
                'https://www.onthe-way.com',
                'http://192.168.0.234:3000',
                'http://192.168.0.240:3000',
                'https://ontheway-queen-web-app-j5mmr.ondigitalocean.app',
                'https://queen.onthe-way.com',
                'https://ontheway-dashboard-udjuq.ondigitalocean.app',
                'https://admin.onthe-way.com',
                'https://ontheway-client-v2-6s3hk.ondigitalocean.app',
                'https://ontheway-freelancing-r97jm.ondigitalocean.app',
                'https://freelancing.onthe-way.com',
                'https://freelancing-seller-app-7vlol.ondigitalocean.app',
                'https://seller.onthe-way.com',
                'https://queen-connect-vqk2a.ondigitalocean.app',
                'https://queenconnect.world',
                'https://www.queenconnect.world',
            ],
            credentials: true,
        },
    });
    return server;
};
exports.socketServer = socketServer;
//# sourceMappingURL=socket.js.map