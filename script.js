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

function giveListeners() {
    for (let item of whiteCheckers) {
        item.addEventListener("click", checkPossibilities);
    }
    for (let item of blackCheckers) {
        item.addEventListener("click", checkPossibilities);
    }
}

function getBoardIndex(id) {
    return board.indexOf(parseInt(id));
}

function checkPossibilities(event) {
    clearHighlightedCells();
    let possibleWays = [];
    let checker = event.target.id;
    let checkerId = getBoardIndex(checker);
    console.log(checkerId);
    if (board[checkerId + 7] == null) {
        possibleWays.push(checkerId + 7);
    }
    if (board[checkerId + 9] == null) {
        possibleWays.push(checkerId + 9);
    }
    if (board[checkerId - 7] == null) {
        possibleWays.push(checkerId - 7);
    }
    if (board[checkerId - 9] == null) {
        possibleWays.push(checkerId - 9);
    }
    if (possibleWays.length > 0) {
        highlightPossibleWays(possibleWays);
        addMoveListener(checkerId, possibleWays);
    }
}

function clearHighlightedCells() {
    for(let item of allCheckers) {
        item.classList.remove("highlightedCell");
    }
}

function highlightPossibleWays(ways) {
    console.log(ways);
    for(let item of ways) {
        allCheckers[item].classList.add("highlightedCell");
    }
}

function addMoveListener(id, ways) {
    let item;
    for (item of ways) {
        allCheckers[item].addEventListener("click", moveListener);
    }
    function moveListener(event) {
        console.log(event);
        moveChecker(id,item);
    }
    const moveChecker = (id, way) => {
        console.log(id, way);
        allCheckers[way].appendChild(allCheckers[id].firstChild);
        removeMoveListeners();
        clearHighlightedCells();
        function removeMoveListeners() {
            for (item of ways) {
                allCheckers[item].removeEventListener("click", moveListener);
            }
        }

    }

}

const moveChecker = (id, way) => {
    console.log(id, way);
    allCheckers[way].appendChild(allCheckers[id].firstChild);
    function removeMoveListeners() {
        for(let item of allCheckers) {
            if (item.classList.contains("highlightedCell")) {
                item.removeEventListener("click", moveChecker.bind(null,id,item));
            }
        }
    }
    removeMoveListeners();
}


giveListeners();