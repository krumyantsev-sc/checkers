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
    console.log(request.body);
    console.log(request.body.i);
    console.log(request.body.j);
    console.log(checkersController.getPositionsForHighlighting(+request.body.i,+request.body.j));
    response.status(200).send(checkersController.getPositionsForHighlighting(+request.body.i,+request.body.j));
});



// начинаем прослушивать подключения на 3000 порту
app.listen(3001);