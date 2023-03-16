import {get, post} from "./util.js"

if (!localStorage.getItem('token')) {
    window.location.href = './login.html';
}

let socket = io.connect('http://localhost:3001',{query: {auth:localStorage.getItem('token')}});
const createRoomButton = document.querySelector(".create-room__button");
const roomList = document.querySelector(".room-list");

createRoomButton.addEventListener("click", () => {
    get("http://localhost:3001/room/createRoom").then(r => console.log(r));
})
async function getLobbyList() {
    let res = await get("http://localhost:3001/room/getRoomList");
    let lobbyArr = await res;
    lobbyArr.forEach((el) => createRoomDiv(el));
}

function createRoomDiv(roomInfo) {
    let newRoomDiv = document.createElement('div');
    newRoomDiv.classList.add("roomDiv");
    newRoomDiv.textContent = `room ID: ${roomInfo._id}, player 1: ${roomInfo.firstPlayerId}, player2: ${roomInfo.secondPlayerId}`;
    let newRoomBtn = document.createElement('div');
    newRoomBtn.classList.add("roomDivBtn");
    newRoomBtn.textContent = "CONNECT";
    newRoomDiv.appendChild(newRoomBtn);
    roomList.appendChild(newRoomDiv);

}
console.log(getLobbyList());