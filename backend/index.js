// подключение express
const checkersController = require("./controllers/checkersController.js");
const board = require("./services/BoardService.js")
const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors')

app.use(express.json());
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
    res.sendStatus(200);
});

app.post("/checkers/getBeatPositions", function(req,res) {
    res.send(checkersController.getBeatPos(req.body));
});
let players = 0;
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    players++;
    io.emit('getNumOfConnections', players)
    // Что делать при случае дисконнекта
    io.on('disconnect', () => {
        // Выводи 'disconnected'
        console.log('disconnected');
    });
});

// начинаем прослушивать подключения на 3000 порту
server.listen(3001);