//import {get,post} from "./util"

let socket;
window.addEventListener("DOMContentLoaded", (event) => {
    setTimeout(() => initializeSocketConnection(),3000)
    console.log(localStorage.getItem('token'));
    //initializeSocketConnection();
});

function initializeSocketConnection() {
    socket = io.connect('http://localhost:3001',{query: {auth:localStorage.getItem('token')}});
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
    socket.on('disconnect', function() {
        console.log("disconnected");
    })
}

const startButton = document.querySelector(".start-game__button");

