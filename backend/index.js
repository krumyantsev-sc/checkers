// подключение express
const express = require("express");
// создаем объект приложения
const app = express();

// определяем обработчик для маршрута "/"
app.get("/test", function(request, response){
    // отправляем ответ
    response.send("Привет Expr!");
});
// начинаем прослушивать подключения на 3000 порту
app.listen(3001);