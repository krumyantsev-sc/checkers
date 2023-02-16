import Board from './board.js';
import checker from './checker.js';
import Player from './player.js'
import Bot from './bot.js'

let currentChecker;
export let counter = 1;
export let gameBoard = new Board;
let player1 = new Player();
let player2 = new Player();
let bot = new Bot();
gameBoard.init();
let currTeamDiv = document.querySelector(".current-team");
let whiteScore = document.querySelector("#whiteSpan");
let blackScore = document.querySelector("#blackSpan");


export function incCounter() {
    counter++;
}

export function setCurrentChecker(num) {
    currentChecker = num;
}

export function changeTeam() {
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
        bot.moveClosestChecker();
        refreshScore();
        changeTeam();
        startMove();
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

export function calculateSimpleMoveVariants(checkerId) {
    let possibleWays = [];
    if (gameBoard.board[checkerId].color === "White" || gameBoard.board[checkerId].isLady) {
        if (gameBoard.allCheckers[checkerId + 7] !== undefined && gameBoard.board[checkerId + 7] == null && !gameBoard.allCheckers[checkerId + 7].classList.contains("cleanCell")) {
            possibleWays.push(checkerId + 7);
        }
        if (gameBoard.allCheckers[checkerId + 9] !== undefined && gameBoard.board[checkerId + 9] == null && !gameBoard.allCheckers[checkerId + 9].classList.contains("cleanCell")) {
            possibleWays.push(checkerId + 9);
        }
    }
    if (gameBoard.board[checkerId].color === "Black" || gameBoard.board[checkerId].isLady) {
        if (gameBoard.allCheckers[checkerId - 7] !== undefined && gameBoard.board[checkerId - 7] == null && !gameBoard.allCheckers[checkerId - 7].classList.contains("cleanCell")) {
            possibleWays.push(checkerId - 7);
        }
        if (gameBoard.allCheckers[checkerId - 9] !== undefined && gameBoard.board[checkerId - 9] == null && !gameBoard.allCheckers[checkerId - 9].classList.contains("cleanCell")) {
            possibleWays.push(checkerId - 9);
        }
    }
    return possibleWays;
}

export function checkMoveVariants(checkerId) {
    let possibleWays = getBeatPositions(checkerId);
    if (possibleWays.length === 0) {
        possibleWays = calculateSimpleMoveVariants(checkerId);
    }
    if (possibleWays.length > 0) {
        highlightPossibleWays(possibleWays);
        addMoveListener(checkerId, possibleWays);
    }
}

function checkPossibilities(event) {
    clearHighlightedCells();
    let checker = event.target.id;
    let checkerId = gameBoard.getBoardIndex(checker);
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

function incrementScore(color) {
    console.log(color);
    if (color === "Black") {
        player1.score++;
    }
    if (color === "White") {
        player2.score++;
    }
}

export function refreshScore() {
    whiteScore.textContent = player1.score + "";
    blackScore.textContent = player2.score + "";
}

export function removeChecker(difference) {
    if (difference % 7 === 0) {
        if (difference > 0) {
            console.log(gameBoard.board[currentChecker+7]);
            incrementScore(gameBoard.board[currentChecker + 7].color);
            gameBoard.board[currentChecker + 7] = null;
            gameBoard.allCheckers[currentChecker + 7].removeChild(gameBoard.allCheckers[currentChecker + 7].firstChild);
        } else {
            console.log(gameBoard.board[currentChecker-7]);
            incrementScore(gameBoard.board[currentChecker - 7].color);
            gameBoard.board[currentChecker - 7] = null;
            gameBoard.allCheckers[currentChecker - 7].removeChild(gameBoard.allCheckers[currentChecker - 7].firstChild);
        }
    } else {
        if (difference > 0) {
            console.log(gameBoard.board[currentChecker+9]);
            incrementScore(gameBoard.board[currentChecker + 9].color);
            gameBoard.board[currentChecker + 9] = null;
            gameBoard.allCheckers[currentChecker + 9].removeChild(gameBoard.allCheckers[currentChecker + 9].firstChild);
        } else {
            console.log(gameBoard.board[currentChecker-9]);
            incrementScore(gameBoard.board[currentChecker - 9].color);
            gameBoard.board[currentChecker - 9] = null;
            gameBoard.allCheckers[currentChecker - 9].removeChild(gameBoard.allCheckers[currentChecker - 9].firstChild);
        }
    }
    console.log(player1.score, player2.score);
}

export function moveCheckerDiv(initialCell, targetCellDiv) {
    targetCellDiv.appendChild(gameBoard.allCheckers[initialCell].firstChild);
}

export function goToNextMove() {
    refreshScore();
    changeTeam();
    checkWin();
}

export function checkWin() {
    if (player1.score === 12) {
        alert("Победа белых");
    } else if (player2.score === 12) {
        alert("Победа чёрных");
    }
}

const moveChecker = (event) => {
    let newIndex = gameBoard.findIndexOfNode(event);
    moveCheckerDiv(currentChecker, event.target);
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
    removeListeners(event);
    goToNextMove();
    startMove();
}
startMove();

