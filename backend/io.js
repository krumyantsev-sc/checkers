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
            console.log(token);
            const playerId = authenticateToken(token);
            if (playerId === null) {
                socket.disconnect();
            }
            socket.join(playerId);
            socket.on("disconnect", function() {
                console.log("user disconnected");
            });
        });
    }

    emiter(event, body) {
            this.io.emit(event, body);
    }
}

module.exports = SocketService;
