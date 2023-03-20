import {get, post} from "./util.js"

if (!localStorage.getItem('token')) {
    window.location.href = './login.html';
}

let socket = io.connect('http://localhost:3001',{query: {auth:localStorage.getItem('token')}});
const createRoomButton = document.querySelector(".create-room__button");
const roomList = document.querySelector(".room-list");
let connectButtons = [];
let roomIdArr = [];

createRoomButton.addEventListener("click", () => {
    get("http://localhost:3001/room/createRoom").then(r => console.log(r));
})
async function getLobbyList() {
    let res = await get("http://localhost:3001/room/getRoomList");
    let lobbyArr = await res;
    lobbyArr.forEach((el) => {createRoomDiv(el)
    });
    addButtonsListeners();
}

function createRoomDiv(roomInfo) {
    roomIdArr.push(roomInfo._id);
    let newRoomDiv = document.createElement('div');
    newRoomDiv.classList.add("roomDiv");
    newRoomDiv.textContent = `room ID: ${roomInfo._id}, player 1: ${roomInfo.firstPlayerId}, player2: ${roomInfo.secondPlayerId}`;
    let newRoomBtn = document.createElement('div');
    newRoomBtn.classList.add("roomDivBtn");
    newRoomBtn.textContent = "CONNECT";
    connectButtons.push(newRoomBtn);
    newRoomDiv.appendChild(newRoomBtn);
    roomList.appendChild(newRoomDiv);

}

function addButtonsListeners() {
    connectButtons.forEach((btn) => {
        btn.addEventListener("click", async (event) => {
            console.log("!")
            const roomId = getRoomId(event);
            // console.log("roomId",roomId);
            // post({roomId: roomId}, "http://localhost:3001/room/connect").then(() => {
            //     window.location.href = './lobby.html';
            // })
            get("http://localhost:3001/room/6411b026fce185b6ab32b11e").then((res) => console.log(res));
        })
    })
}
function getRoomId(event) {
    console.log(connectButtons);
    let buttonNumber = connectButtons.indexOf(event.target);
    return roomIdArr[buttonNumber];
}
console.log(getLobbyList());
