"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketIo = require('socket.io');
const jwtVerification_1 = require("./jwtVerification");
const cookie = require('cookie');
class SocketService {
    constructor(server) {
        this.io = socketIo(server, {
            cors: {
                credentials: true,
                origin: 'http://localhost:3000'
            },
        });
        this.io.on('connection', (socket) => {
            console.log('user connected');
            const cookies = socket.handshake.headers.cookie;
            const parsedCookies = cookie.parse(cookies);
            const token = parsedCookies.jwt;
            const playerId = (0, jwtVerification_1.default)(token);
            socket.join(playerId);
            if (playerId === null) {
                socket.disconnect();
            }
            socket.join(playerId);
            socket.on('disconnect', () => {
                console.log('user disconnected');
                socket.leave(playerId);
            });
        });
    }
    emiter(event, target, body) {
        this.io.to(target).emit(event, body);
    }
}
exports.default = SocketService;
//# sourceMappingURL=io.js.map