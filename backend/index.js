// подключение express
const express = require("express");
const cors = require('cors')
const app = express();
app.use(express.json);
app.use(cors({
    origin: ['http://localhost:63342']
}));

// определяем обработчик для маршрута "/"
app.get("/test", function(request, response){
    // отправляем ответ
    response.send("Привет Express");
});

app.post("/test", function(request, response){
    // отправляем ответ
    response.status(200).send(request.body);
});



// начинаем прослушивать подключения на 3000 порту
app.listen(3001);