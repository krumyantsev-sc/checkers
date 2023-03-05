let socket = io('http://localhost:3001');
let statuses = document.querySelectorAll(".status")
socket.on('connect', function () {
    // Выводим сообщение подключение
    console.log("Подключение прошло успешно<br>");
    // Отслеживание сообщения от сервера со заголовком 'hello'
    socket.on('getNumOfConnections', function (data) {
        // Выводим сообщение от сервера
        console.log(data);
        changeConnectionSpan(data);
    });
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