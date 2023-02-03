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
let currentChecker;
let counter = 1;

let currTeamDiv = document.querySelector(".current-team");
let whiteCheckers = document.querySelectorAll(".white-checker");
let blackCheckers = document.querySelectorAll(".black-checker");
let allCheckers = document.querySelectorAll("td");

function changeTeam() {
    counter++;
    currTeamDiv.innerHTML = (counter % 2 === 0) ? "Ходят черные" : "Ходят белые";
}

function startMove() {
    giveListeners();
}

function giveListeners() {
    if (counter % 2 !== 0) {
        for (let item of whiteCheckers) {
            item.addEventListener("click", checkPossibilities);
        }
    } else {
        for (let item of blackCheckers) {
            item.addEventListener("click", checkPossibilities);
        }
    }
}

function removeListeners() {
        for (let item of whiteCheckers) {
            item.removeEventListener("click", checkPossibilities);
        }
        for (let item of blackCheckers) {
            item.removeEventListener("click", checkPossibilities);
        }
}

function getBoardIndex(id) {
    return board.indexOf(parseInt(id));
}

function checkPossibilities(event) {
    console.log(board);
    clearHighlightedCells();
    let possibleWays = [];
    let checker = event.target.id;
    console.log(checker);
    let checkerId = getBoardIndex(checker);
    currentChecker = checkerId;
    console.log(checkerId);
    if (board[checkerId + 7] == null && !allCheckers[checkerId + 7].classList.contains("cleanCell")) {
        possibleWays.push(checkerId + 7);
    }
    if (board[checkerId + 9] == null && !allCheckers[checkerId + 9].classList.contains("cleanCell")) {
        possibleWays.push(checkerId + 9);
    }
    if (board[checkerId - 7] == null && !allCheckers[checkerId - 7].classList.contains("cleanCell")) {
        possibleWays.push(checkerId - 7);
    }
    if (board[checkerId - 9] == null && !allCheckers[checkerId - 9].classList.contains("cleanCell")) {
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
        allCheckers[item].addEventListener("click", moveChecker);
    }
}

function findIndexOfNode(event) {
    for (let i = 0; i < allCheckers.length; i++) {
        if (allCheckers[i] === event.target) {
            return i;
        }
    }
}

const moveChecker = (event) => {
    event.target.appendChild(allCheckers[currentChecker].firstChild);
    let newCheckerDiv = event.target.firstChild;
    board[findIndexOfNode(event)] = +newCheckerDiv.id;
    board[currentChecker] = null;
    clearHighlightedCells();
    event.target.removeEventListener("click", moveChecker);
    removeListeners();
    changeTeam();
    startMove();
}
startMove();

