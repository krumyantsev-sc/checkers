import {Room} from "../pgModels/Room";
import authenticateToken from './jwtVerification';
import {Server, Socket} from "socket.io";
import {Op} from "sequelize";

const socketIo = require('socket.io');
const cookie = require('cookie');

const getSecondPlayerName = async (playerId: string) => {
    const room = await Room.findOne({
        where: {
            [Op.and]: [
                {
                    [Op.or]: [{ firstPlayerId: playerId }, { secondPlayerId: playerId }],
                },
                { status: "active" },
            ],
        },
    });

    if (room) {
        if (room.firstPlayerId && room.secondPlayerId) {
            if (room.firstPlayerId === playerId) {
                return room.secondPlayerId;
            } else if (room.secondPlayerId === playerId) {
                return room.firstPlayerId;
            }
        }
    }
};

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
            (async () => {
                const cookies = socket.handshake.headers.cookie;
                const parsedCookies = cookie.parse(cookies);
                const token = parsedCookies.jwt;
                const playerId = authenticateToken(token);
                if (playerId === null) {
                    socket.disconnect();
                }
                console.log("connected to", playerId)
                socket.join(playerId);
                const secondPlayerId = await getSecondPlayerName(playerId);
                if (secondPlayerId) {
                    this.io.to(secondPlayerId).emit('enemyReconnected');
                }
                socket.on('disconnect', async () => {
                    const secondPlayerId = await getSecondPlayerName(playerId);
                    if (secondPlayerId) {
                        this.io.to(secondPlayerId).emit('enemyDisconnected');
                        const serverTime = new Date().getTime();
                        this.io.to(secondPlayerId).emit('syncTime', serverTime);
                    }
                    socket.leave(playerId);
                });
            })();
        });
    }

    emiter(event: string, target: string, body: any): void {
        this.io.to(target).emit(event, body);
    }
}
