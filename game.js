import Board from './board.js';
import checker from './checker.js';
import Player from './player.js'

let currentChecker;
let counter = 1;
export let gameBoard = new Board;
let player1 = new Player();
let player2 = new Player();
gameBoard.init();
let currTeamDiv = document.querySelector(".current-team");
let whiteScore = document.querySelector("#whiteSpan");
let blackScore = document.querySelector("#blackSpan");

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

function removeListeners(event) {
        for (let item of gameBoard.whiteCheckers) {
            item.div.removeEventListener("click", checkPossibilities);
        }
        for (let item of gameBoard.blackCheckers) {
            item.div.removeEventListener("click", checkPossibilities);
        }
        event.target.removeEventListener("click", moveChecker);
}


export function getBeatPositions(checkerId) {
    let takenPositions = [];
    if (gameBoard.board[checkerId].color === "White" || gameBoard.board[checkerId].isLady) {
    if (gameBoard.allCheckers[checkerId + 7] !== undefined && gameBoard.board[checkerId + 7] != null && !gameBoard.allCheckers[checkerId + 7].classList.contains("cleanCell") && gameBoard.board[checkerId].color !== gameBoard.board[checkerId+7].color) {
        if (gameBoard.allCheckers[checkerId + 14] !== undefined && gameBoard.board[checkerId + 14] == null && !gameBoard.allCheckers[checkerId + 14].classList.contains("cleanCell")) {
            takenPositions.push(checkerId + 14);
        }
        
    }
    if (gameBoard.allCheckers[checkerId + 9] !== undefined && gameBoard.board[checkerId + 9] != null && !gameBoard.allCheckers[checkerId + 9].classList.contains("cleanCell") && gameBoard.board[checkerId].color !== gameBoard.board[checkerId+9].color) {
        if (gameBoard.allCheckers[checkerId + 18] !== undefined && gameBoard.board[checkerId + 18] == null && !gameBoard.allCheckers[checkerId + 18].classList.contains("cleanCell")) {
            takenPositions.push(checkerId + 18);
        }
        
    }
}
if (gameBoard.board[checkerId].color === "Black" || gameBoard.board[checkerId].isLady) {
    if (gameBoard.allCheckers[checkerId - 7] !== undefined && gameBoard.board[checkerId - 7] != null && !gameBoard.allCheckers[checkerId - 7].classList.contains("cleanCell") && gameBoard.board[checkerId].color !== gameBoard.board[checkerId-7].color) {
        if (gameBoard.allCheckers[checkerId - 14] !== undefined && gameBoard.board[checkerId - 14] == null && !gameBoard.allCheckers[checkerId - 14].classList.contains("cleanCell")) {
            takenPositions.push(checkerId - 14);
        }
        
    }
    if (gameBoard.allCheckers[checkerId - 9] !== undefined && gameBoard.board[checkerId - 9] != null && !gameBoard.allCheckers[checkerId - 9].classList.contains("cleanCell") && gameBoard.board[checkerId].color !== gameBoard.board[checkerId-9].color) {
        if (gameBoard.allCheckers[checkerId - 18] !== undefined && gameBoard.board[checkerId - 18] == null && !gameBoard.allCheckers[checkerId - 18].classList.contains("cleanCell")) {
            takenPositions.push(checkerId - 18);
        }
        
    }
}
    return takenPositions;
}

export function checkMoveVariants(checkerId) {
    let possibleWays = getBeatPositions(checkerId);
    if (possibleWays.length === 0) {
        if (gameBoard.board[checkerId].color === "White" || gameBoard.board[checkerId].isLady) {
    if (gameBoard.board[checkerId + 7] == null && !gameBoard.allCheckers[checkerId + 7].classList.contains("cleanCell")) {
        possibleWays.push(checkerId + 7);
    }
    if (gameBoard.board[checkerId + 9] == null && !gameBoard.allCheckers[checkerId + 9].classList.contains("cleanCell")) {
        possibleWays.push(checkerId + 9);
    }
}
if (gameBoard.board[checkerId].color === "Black" || gameBoard.board[checkerId].isLady) {
    if (gameBoard.board[checkerId - 7] == null && !gameBoard.allCheckers[checkerId - 7].classList.contains("cleanCell")) {
        possibleWays.push(checkerId - 7);
    }
    if (gameBoard.board[checkerId - 9] == null && !gameBoard.allCheckers[checkerId - 9].classList.contains("cleanCell")) {
        possibleWays.push(checkerId - 9);
    }
}
}
    if (possibleWays.length > 0) {
        highlightPossibleWays(possibleWays);
        addMoveListener(checkerId, possibleWays);
    }
}

function checkPossibilities(event) {
    clearHighlightedCells();
    let checker = event.target.id;
    console.log(gameBoard.board);
    let checkerId = gameBoard.getBoardIndex(checker);
    console.log(checkerId);
    currentChecker = checkerId;
    checkMoveVariants(checkerId);
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

function incrementScore(checker) {
    if (checker.color === "Black") {
        console.log(checker);
        player1.score++;
    } else {
        console.log(checker);
        player2.score++;
    }
}

function refreshScore() {
    whiteScore.textContent = player1.score + "";
    blackScore.textContent = player2.score + "";
}

export function removeChecker(difference) {
    if (difference % 7 === 0) {
        if (difference > 0) {
            incrementScore(gameBoard.board[currentChecker + 7]);
            gameBoard.board[currentChecker + 7] = null;
            gameBoard.allCheckers[currentChecker + 7].removeChild(gameBoard.allCheckers[currentChecker + 7].firstChild);
        } else {
            incrementScore(gameBoard.allCheckers[currentChecker - 7]);
            gameBoard.board[currentChecker - 7] = null;
            gameBoard.allCheckers[currentChecker - 7].removeChild(gameBoard.allCheckers[currentChecker - 7].firstChild);
        }
    } else {
        if (difference > 0) {
            incrementScore(gameBoard.allCheckers[currentChecker + 9]);
            gameBoard.board[currentChecker + 9] = null;
            gameBoard.allCheckers[currentChecker + 9].removeChild(gameBoard.allCheckers[currentChecker + 9].firstChild);
        } else {
            incrementScore(gameBoard.allCheckers[currentChecker - 9]);
            gameBoard.board[currentChecker - 9] = null;
            gameBoard.allCheckers[currentChecker - 9].removeChild(gameBoard.allCheckers[currentChecker - 9].firstChild);
        }
    }

}

const moveChecker = (event) => {
    let newIndex = gameBoard.findIndexOfNode(event);
    event.target.appendChild(gameBoard.allCheckers[currentChecker].firstChild);
    player1.moveChecker(gameBoard.board[currentChecker], gameBoard, currentChecker, newIndex);
    gameBoard.board[newIndex].checkLady();
    let pos = checker.beat(currentChecker, newIndex);
    if(checker.canBeatOneMore(pos)) {
        clearHighlightedCells();
        currentChecker = newIndex;
        checkMoveVariants(newIndex);
        return;
    }
    clearHighlightedCells();
    refreshScore();
    removeListeners(event);
    changeTeam();
    startMove();
}
startMove();

