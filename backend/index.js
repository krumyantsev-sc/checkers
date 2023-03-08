// подключение express
const checkersController = require("./controllers/checkersController.js");
const board = require("./services/BoardService.js")
const express = require("express");
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const authRouter = require('./authRouter.js')
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors')
let secondPlayer;

app.use(express.json());
app.use("/auth", authRouter);
app.use(cors({
    origin: ['http://localhost:63342']
}));
const io = new Server(server, {
    cors: ['http://localhost:63342'],
    serveClient: false
});
// определяем обработчик для маршрута "/"
app.get("/test", function(request, response){
    // отправляем ответ
    response.send("Привет Express");
});

app.post("/checkers/getPossiblePositions", function(request, response){
    // отправляем ответ
    response.send(checkersController.getPositionsForHighlighting(+request.body.i,+request.body.j));
});

app.post("/checkers/updateBoard", function(req,res) {
    console.log(req.body);
    checkersController.moveCheckerOnBoard(req.body.fromI,req.body.fromJ,req.body.toI,req.body.toJ);
    io.to(secondPlayer).emit('checkerMoved', req.body);
    res.sendStatus(200);
});

app.get("/checkers/getBoard", function(req,res) {
    res.send(board.getBoard());
});

app.post("/checkers/getBeatPositions", function(req,res) {
    res.send(checkersController.getBeatPos(req.body));
});
let players = 0;
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    secondPlayer = socket.id;
    players++;
    io.emit('getNumOfConnections', players)
    // Что делать при случае дисконнекта
    io.on('disconnect', () => {
        // Выводи 'disconnected'
        console.log('disconnected');
    });
});


// начинаем прослушивать подключения на 3000 порту
const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://rumik:13372281@cluster0.orq3t9o.mongodb.net/?retryWrites=true&w=majority`);
        server.listen(3001);
    } catch (e) {
        console.log(e);
    }
}
start();