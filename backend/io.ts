const socketIo = require('socket.io');
import authenticateToken from './jwtVerification';
import {Server, Socket} from "socket.io";

export default class SocketService {
    private io: Server;

    constructor(server: any) {
        this.io = socketIo(server, {
            cors: ['http://localhost:63342'],
            serveClient: false
        });

        this.io.on('connection', (socket: Socket) => {
            console.log('user connected');
            const token = socket.handshake.query.auth as string;
            const playerId = authenticateToken(token);
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

    emiter(event: string, target: string, body: any): void {
        this.io.to(target).emit(event, body);
    }
}