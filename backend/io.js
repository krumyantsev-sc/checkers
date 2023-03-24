const socketIo = require('socket.io');
const {authenticateToken} = require('./jwtVerification.js');

class SocketService {
    constructor(server) {
        this.io = socketIo(server,{
            cors: ['http://localhost:63342'],
            serveClient: false
        });
        this.io.on('connection', socket => {
            console.log('user connected')
            const token = socket.handshake.query.auth;
            const playerId = authenticateToken(token);
            socket.join(playerId);
            if (playerId === null) {
                socket.disconnect();
            }
            socket.join(playerId);
            socket.on("disconnect", function() {
                console.log("user disconnected");
            });
        });
    }

    emiter(event, target, body) {
            this.io.to(target).emit(event, body);
    }
}

module.exports = SocketService;
