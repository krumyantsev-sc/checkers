// подключение express

const express = require("express");
const bodyParser = require('body-parser')
// создаем объект приложения
const cors = require('cors')

const app = express();
app.use(cors({
    origin: ['http://localhost:63342']
}));
const urlencodedParser = bodyParser.urlencoded({
    extended: false,
})

// определяем обработчик для маршрута "/"
app.get("/test", function(request, response){
    // отправляем ответ
    response.send("Привет Express");
});

app.post("/test", urlencodedParser, function(request, response){
    // отправляем ответ
    console.log(request.body);
    response.send(
        `${request.body.title}`
    )
});



// начинаем прослушивать подключения на 3000 порту
app.listen(3001);