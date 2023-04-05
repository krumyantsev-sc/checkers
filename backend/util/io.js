"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketIo = require('socket.io');
const jwtVerification_1 = require("./jwtVerification");
class SocketService {
    constructor(server) {
        this.io = socketIo(server, {
            cors: ['http://localhost:63342'],
            serveClient: false
        });
        this.io.on('connection', (socket) => {
            console.log('user connected');
            const token = socket.handshake.query.auth;
            const playerId = (0, jwtVerification_1.default)(token);
            socket.join(playerId);
            if (playerId === null) {
                socket.disconnect();
            }
            socket.join(playerId);
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }
    emiter(event, target, body) {
        this.io.to(target).emit(event, body);
    }
}
exports.default = SocketService;
//# sourceMappingURL=io.js.map