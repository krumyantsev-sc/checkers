"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = require("../models/Room");
const socketIo = require('socket.io');
const jwtVerification_1 = require("./jwtVerification");
const cookie = require('cookie');
const exitFromGame = (playerId) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield Room_1.default.findOne({ $and: [{ $or: [{ firstPlayer: playerId }, { secondPlayer: playerId }] }, { status: "active" }] });
    console.log("room", room._id);
    if (room) {
        console.log("Комната найдена");
        if (room.firstPlayer.toString() === playerId) {
            console.log('return!!!!', room.secondPlayer.toString());
            return room.secondPlayer.toString();
        }
        else {
            console.log('return!!!!', room.firstPlayer.toString());
            return room.firstPlayer.toString();
        }
    }
});
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
            let timer;
            socket.on('disconnect', () => __awaiter(this, void 0, void 0, function* () {
                console.log('user disconnected');
                const secondPlayerId = yield exitFromGame(playerId);
                if (secondPlayerId) {
                    console.log(secondPlayerId);
                    this.io.to(secondPlayerId).emit('enemyDisconnected');
                }
                timer = setTimeout(() => {
                    console.log('Таймер завершен');
                }, 5000);
                socket.leave(playerId);
            }));
            socket.on('reconnect', () => {
                console.log('Пользователь повторно подключился');
                if (timer) {
                    clearTimeout(timer);
                    console.log('Таймер очищен');
                }
            });
        });
    }
    emiter(event, target, body) {
        this.io.to(target).emit(event, body);
    }
}
exports.default = SocketService;
//# sourceMappingURL=io.js.map