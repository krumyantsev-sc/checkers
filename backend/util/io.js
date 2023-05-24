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
const getSecondPlayerName = (playerId) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield Room_1.default.findOne({ $and: [{ $or: [{ firstPlayer: playerId }, { secondPlayer: playerId }] }, { status: "active" }] });
    if (room) {
        if (room.firstPlayer && room.secondPlayer) {
            if (room.firstPlayer)
                if (room.firstPlayer.toString() === playerId) {
                    if (room.secondPlayer) {
                        return room.secondPlayer.toString();
                    }
                }
                else if (room.secondPlayer.toString() === playerId) {
                    console.log('return!!!!', room.firstPlayer.toString());
                    return room.firstPlayer.toString();
                }
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
        this.io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            console.log('user connected');
            const cookies = socket.handshake.headers.cookie;
            const parsedCookies = cookie.parse(cookies);
            const token = parsedCookies.jwt;
            const playerId = (0, jwtVerification_1.default)(token);
            if (playerId === null) {
                socket.disconnect();
            }
            socket.join(playerId);
            const secondPlayerId = yield getSecondPlayerName(playerId);
            if (secondPlayerId) {
                this.io.to(secondPlayerId).emit('enemyReconnected');
            }
            let timer;
            if (timer) {
                clearTimeout(timer);
                console.log('Таймер очищен');
            }
            socket.on('disconnect', () => __awaiter(this, void 0, void 0, function* () {
                console.log('user disconnected');
                const secondPlayerId = yield getSecondPlayerName(playerId);
                if (secondPlayerId) {
                    console.log(secondPlayerId);
                    this.io.to(secondPlayerId).emit('enemyDisconnected');
                    const serverTime = new Date().getTime();
                    this.io.to(secondPlayerId).emit('syncTime', serverTime);
                }
                timer = setTimeout(() => {
                    console.log('Таймер завершен');
                }, 5000);
                socket.leave(playerId);
            }));
            this.io.on('reconnect', () => {
                console.log('Пользователь повторно подключился');
                if (timer) {
                    clearTimeout(timer);
                    console.log('Таймер очищен');
                }
            });
        }));
    }
    emiter(event, target, body) {
        this.io.to(target).emit(event, body);
    }
}
exports.default = SocketService;
//# sourceMappingURL=io.js.map