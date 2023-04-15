const socketIo = require('socket.io');
import authenticateToken from './jwtVerification';
import {Server, Socket} from "socket.io";
const cookie = require('cookie');

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

            socket.on('disconnect', () => {
                console.log('user disconnected');
                socket.leave(playerId);
            });
        });
    }

    emiter(event: string, target: string, body: any): void {
        this.io.to(target).emit(event, body);
    }
}
