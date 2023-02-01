class Square {
    constructor(color) {
        this.color = color;
        this.isMoveable = (this.color === "Brown");
    }
}

class checker {
    constructor(color) {
        this.color = color;
    }
    move() {

    }
    beat() {

    }
}

class lady extends checker {
    moveForward() {

    }

    beatForward() {

    }
}

const board = [
    null, 0, null, 1, null, 2, null, 3,
    4, null, 5, null, 6, null, 7, null,
    null, 8, null, 9, null, 10, null, 11,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    12, null, 13, null, 14, null, 15, null,
    null, 16, null, 17, null, 18, null, 19,
    20, null, 21, null, 22, null, 23, null
];

let whiteCheckers = document.querySelectorAll(".white-checker");
let blackCheckers = document.querySelectorAll(".black-checker");
let allCheckers = document.querySelectorAll("td");
console.log(whiteCheckers);
console.log(1);
function giveListeners() {
    for (let item of whiteCheckers) {
        console.log(item);
        item.addEventListener("click", function (e) {
            console.log(e.target.id);
        });
    }
    for (let item of blackCheckers) {
        item.addEventListener("click", checkPossibilities);
    }
}

function getBoardIndex(id) {
    return board.indexOf(parseInt(id));
}

function checkPossibilities(event) {
    let checker = event.target.id;
    let checkerId = getBoardIndex(checker);
    console.log(checkerId);
}
giveListeners();