// подключение express
const checkersController = require("./controllers/checkersController.js");
const board = require("./services/BoardService.js")
const express = require("express");
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:63342']
}));

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


// начинаем прослушивать подключения на 3000 порту
app.listen(3001);