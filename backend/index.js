const checkersController = require("./controllers/checkersController.js");
const board = require("./services/BoardService.js")
const express = require("express");
const app = express();
const server = require('http').Server(app);
const SocketService = require("./io")
// const http = require("http");
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server, {
//     cors: ['http://localhost:63342'],
//     serveClient: false
// });
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./authRouter.js')
const roomRouter = require('./roomRouter.js')
const roleMiddleware = require('./middleware/roleMiddleware.js')


app.use(express.json());
app.set("socketService", new SocketService(server));
app.use("/auth", authRouter);
app.use("/room", roomRouter);
app.use(cors({
    origin: ['http://localhost:63342']
}));
app.use(express.static(__dirname + '/public'));
app.get("/test", roleMiddleware(), function(req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.post("/checkers/getPossiblePositions", function(request, response){
    // отправляем ответ
    response.send(checkersController.getPositionsForHighlighting(+request.body.i,+request.body.j));
});

app.post("/checkers/updateBoard", function(req,res) {
    checkersController.moveCheckerOnBoard(req.body.fromI,req.body.fromJ,req.body.toI,req.body.toJ);
   // io.to(secondPlayer).emit('checkerMoved', req.body);
    res.sendStatus(200);
});

app.get("/checkers/getBoard", function(req,res) {
    res.send(board.getBoard());
});

app.post("/checkers/getBeatPositions", function(req,res) {
    res.send(checkersController.getBeatPos(req.body));
});
let players = 0;

// io.on("connection", function(socket) {
//     console.log("user connected");
//     const token = socket.handshake.query.auth;
//     const playerId = authenticateToken(token);
//     if (playerId === null) {
//         socket.disconnect();
//     }
//     socket.join(playerId);
//     socket.on("disconnect", function() {
//         console.log("user disconnected");
//     });
// });

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://rumik:13372281@cluster0.orq3t9o.mongodb.net/?retryWrites=true&w=majority`);
        server.listen(3001, function() {
            console.log("listening on *:3001");
        });
    } catch (e) {
        console.log(e);
    }
}

start();

module.exports = app