import {get} from "./util.js"

if (!localStorage.getItem('token')) {
    window.location.href = './login.html';
}

let socket = io('http://localhost:3001');
let statuses = document.querySelectorAll(".status");
let userNameSpan = document.querySelectorAll(".name");

async function getUserName() {
    return await get("http://localhost:3001/auth/getUserName");
}

const changeNameSpan = () => {
    getUserName().then((result) => userNameSpan[0].textContent = result.username);
}
changeNameSpan();
socket.on('connect', function () {
    // Выводим сообщение подключение
    console.log("Подключение прошло успешно");
    // Отслеживание сообщения от сервера со заголовком 'hello'

});
socket.on('getNumOfConnections', function (data) {
    // Выводим сообщение от сервера
    console.log(data);
    changeConnectionSpan(data);
});

function changeConnectionSpan(numOfConnections) {
    if (numOfConnections === 1) {
        statuses[0].textContent = "Connected";
        statuses[0].style.color = "green";
    }
    if (numOfConnections === 2) {
        statuses[1].textContent = "Connected";
        statuses[0].textContent = "Connected";
        statuses[0].style.color = "green";
        statuses[1].style.color = "green";
    }
}