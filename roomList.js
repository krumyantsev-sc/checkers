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
    let newCheckerDiv = document.createElement('div');
    lobbyArr.forEach()
}
console.log(getLobbyList());