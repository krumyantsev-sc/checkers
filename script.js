import Board from './board.js';

class Player {
    score = 0;
}

let currentChecker;
let counter = 1;
let gameBoard = new Board;
gameBoard.init();
let currTeamDiv = document.querySelector(".current-team");


function changeTeam() {
    counter++;
    currTeamDiv.innerHTML = (counter % 2 === 0) ? "Ходят черные" : "Ходят белые";
}

function startMove() {
    giveListeners();
}

function giveListeners() {
    if (counter % 2 !== 0) {
        for (let item of gameBoard.whiteCheckers) {
            item.div.addEventListener("click", checkPossibilities);
        }
    } else {
        for (let item of gameBoard.blackCheckers) {
            item.div.addEventListener("click", checkPossibilities);
        }
    }
}

function removeListeners() {
        for (let item of gameBoard.whiteCheckers) {
            item.div.removeEventListener("click", checkPossibilities);
        }
        for (let item of gameBoard.blackCheckers) {
            item.div.removeEventListener("click", checkPossibilities);
        }
}



function checkPossibilities(event) {
    clearHighlightedCells();
    let possibleWays = [];
    let checker = event.target.id;
    console.log(event.target.id);
    let checkerId = gameBoard.getBoardIndex(checker);
    console.log(checkerId);
    currentChecker = checkerId;
    if (gameBoard.board[checkerId + 7] == null && !gameBoard.allCheckers[checkerId + 7].classList.contains("cleanCell")) {
        possibleWays.push(checkerId + 7);
    }
    if (gameBoard.board[checkerId + 9] == null && !gameBoard.allCheckers[checkerId + 9].classList.contains("cleanCell")) {
        possibleWays.push(checkerId + 9);
    }
    if (gameBoard.board[checkerId - 7] == null && !gameBoard.allCheckers[checkerId - 7].classList.contains("cleanCell")) {
        possibleWays.push(checkerId - 7);
    }
    if (gameBoard.board[checkerId - 9] == null && !gameBoard.allCheckers[checkerId - 9].classList.contains("cleanCell")) {
        possibleWays.push(checkerId - 9);
    }
    if (possibleWays.length > 0) {
        highlightPossibleWays(possibleWays);
        addMoveListener(checkerId, possibleWays);
    }
}

function clearHighlightedCells() {
    for(let item of gameBoard.allCheckers) {
        item.classList.remove("highlightedCell");
    }
}

function highlightPossibleWays(ways) {
    for(let item of ways) {
       gameBoard.allCheckers[item].classList.add("highlightedCell");
    }
}

function addMoveListener(id, ways) {
    let item;
    for (item of ways) {
        gameBoard.allCheckers[item].addEventListener("click", moveChecker);
    }
}

function findIndexOfNode(event) {
    for (let i = 0; i < gameBoard.allCheckers.length; i++) {
        if (gameBoard.allCheckers[i] === event.target) {
            return i;
        }
    }
}

const moveChecker = (event) => {
    event.target.appendChild(gameBoard.allCheckers[currentChecker].firstChild);
    let newCheckerDiv = event.target.firstChild;
    gameBoard.board[findIndexOfNode(event)] = +newCheckerDiv.id;
    gameBoard.board[currentChecker] = null;
    clearHighlightedCells();
    event.target.removeEventListener("click", moveChecker);
    removeListeners();
    changeTeam();
    startMove();
}
startMove();

