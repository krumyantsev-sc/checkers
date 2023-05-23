import Room, {IRoom} from "../models/Room";

const socketIo = require('socket.io');
import authenticateToken from './jwtVerification';
import {Server, Socket} from "socket.io";
const cookie = require('cookie');

const exitFromGame = async (playerId: string) => {
    const room: IRoom = await Room.findOne({$and: [{$or:[{firstPlayer: playerId}, {secondPlayer: playerId}]}, {status: "active"}]});
    console.log("room", room._id)
    if (room) {
        console.log("Комната найдена")
        if (room.firstPlayer.toString() === playerId) {
            console.log('return!!!!', room.secondPlayer.toString())
            return room.secondPlayer.toString()
        } else {
            console.log('return!!!!', room.firstPlayer.toString())
            return room.firstPlayer.toString();
        }
    }
}

export default class SocketService {
    private io: Server;

    constructor(server: any) {
        this.io = socketIo(server, {
            cors: {
                credentials: true,
                origin: 'http://localhost:3000'
            },
        });

        this.io.on('connection', (socket: Socket) => {
            console.log('user connected');
            const cookies = socket.handshake.headers.cookie;
            const parsedCookies = cookie.parse(cookies);
            const token = parsedCookies.jwt;
            const playerId = authenticateToken(token);
            socket.join(playerId);
            if (playerId === null) {
                socket.disconnect();
            }
            socket.join(playerId);
            let timer: NodeJS.Timeout;

            socket.on('disconnect', async () => {
                console.log('user disconnected');
                const secondPlayerId = await exitFromGame(playerId);
                if (secondPlayerId) {
                    console.log(secondPlayerId)
                    this.io.to(secondPlayerId).emit('enemyDisconnected');
                    const serverTime = new Date().getTime();
                    this.io.to(secondPlayerId).emit('syncTime', serverTime);
                }
                timer = setTimeout(() => {
                    console.log('Таймер завершен');
                }, 5000);

                socket.leave(playerId);
            });

            socket.on('reconnect', () => {
                console.log('Пользователь повторно подключился');

                if (timer) {
                    clearTimeout(timer);
                    console.log('Таймер очищен');
                }
            });
        });
    }

    emiter(event: string, target: string, body: any): void {
        this.io.to(target).emit(event, body);
    }
}
