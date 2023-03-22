import {get,post} from "./util"

let socket = io.connect('http://localhost:3001',{query: {auth:localStorage.getItem('token')}});
const startButton = document.querySelector(".start-game__button");
socket.on('connect', function () {
    // Выводим сообщение подключение
    console.log("Подключение прошло успешно");
    // Отслеживание сообщения от сервера со заголовком 'hello'
});

socket.on('playersReady', function (roomInfo) {
    // Выводим сообщение подключение
    console.log("Gotovo");
    // Отслеживание сообщения от сервера со заголовком 'hello'
});