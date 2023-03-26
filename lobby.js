import {get} from "./util.js"

if (!localStorage.getItem('token')) {
    window.location.href = './login.html';
}

let socket = io.connect('http://localhost:3001',{query: {auth:localStorage.getItem('token')}});
let statuses = document.querySelectorAll(".status");
let userNameSpan = document.querySelectorAll(".name");
const roomIdSpan = document.querySelector(".room__id");
const startBtn = document.querySelector(".start-game__button");

socket.on('updateLobbyData', function (roomInfo) {
    console.log(roomInfo);
    userNameSpan[0].textContent = roomInfo.firstPlayer;
    userNameSpan[1].textContent = roomInfo.secondPlayer;
    roomIdSpan.textContent = roomInfo.roomId;
});

socket.on('makeBtnActive', function () {
    startBtn.style.cursor = "pointer";
    startBtn.addEventListener("click", () => {
        socket.removeAllListeners();
        window.location.href = './index.html';
    })
});
async function getLobbyInfo() {
    return await get("http://localhost:3001/room/getLobbyInfo");
}


const changeNameSpan = () => {
    getLobbyInfo().then((result) => {
        console.log(result);
        userNameSpan[0].textContent = result.firstPlayer;
        userNameSpan[1].textContent = result.secondPlayer;
        roomIdSpan.textContent = result.roomId;
    });
}
changeNameSpan();
socket.on('connect', function () {
    // Выводим сообщение подключение
    console.log("Подключение прошло успешно");
    // Отслеживание сообщения от сервера со заголовком 'hello'

});
socket.on('disconnect', function () {
    console.log("Отключено");

});
