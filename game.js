import Board from './board.js';
import checker from './checker.js';
import Player from './player.js';
import Bot from './bot.js';
import {get, post} from './util.js';
let socket = io('http://localhost:3001');
let currentChecker;
export let counter = 1;
export let gameBoard = new Board;
let player1 = new Player();
let player2 = new Player();
let bot = new Bot();



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

export async function startMove() {
    //await gameBoard.build();
    //gameBoard.removeCheckers();
    await gameBoard.init();
    giveListeners();
}

async function giveListeners() {
    let cnt;
    await get(`http://localhost:3001/checkers/${localStorage.getItem("roomId")}/getCounter`).then((res) => {cnt = res.counterValue
    });
    console.log("counter" + cnt);
    if (cnt % 2 !== 0) {
        for (let item of gameBoard.whiteCheckers) {
            item.addEventListener("click", checkPossibilities);
        }
    } else {
        for (let item of gameBoard.blackCheckers) {
            item.addEventListener("click", checkPossibilities);
        }
      // setTimeout(() => {bot.moveClosestChecker()}, 1000);
    }
}

function removeListeners(event) {
        for (let item of gameBoard.whiteCheckers) {
            item.removeEventListener("click", checkPossibilities);
        }
        for (let item of gameBoard.blackCheckers) {
            item.removeEventListener("click", checkPossibilities);
        }
        event.target.removeEventListener("click", moveChecker);
}

export function checkMoveVariants(i,j) {
    let position = {
        i: i,
        j: j
    };
    post(position,`http://localhost:3001/checkers/${localStorage.getItem("roomId")}/getPossiblePositions`)
        .then(response => response.json())
        .then(json => {
            if (json.length > 0) {
               highlightPossibleWays(json);
               addMoveListener(json);
            }
        });
}

function checkPossibilities(event) {
    console.log("kkkk")
    clearHighlightedCells();
    let checker = event.target.id;
    let checkerId = gameBoard.getBoardIndex(checker);
    console.log(checkerId);
    currentChecker = checkerId;
    checkMoveVariants(checkerId.i,checkerId.j);
}

function clearHighlightedCells() {
    for(let item of gameBoard.allCheckers) {
        for(let i = 0; i < item.length; i++) {
            item[i].classList.remove("highlightedCell");
        }
    }
}

function highlightPossibleWays(ways) {
    for(let item of ways) {
       gameBoard.allCheckers[item.i][item.j].classList.add("highlightedCell");
    }
}

function addMoveListener(ways) {
    let item;
    for (item of ways) {
        gameBoard.allCheckers[item.i][item.j].addEventListener("click", moveChecker);
    }
}

function incrementScore(color) {
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

export function removeChecker(from, to) {
    if (to.i - from.i > 0) {
        if (to.j < from.j) {
            //incrementScore(gameBoard.board[currentChecker.i+1][currentChecker.j-1].color);
            //gameBoard.board[currentChecker.i+1][currentChecker.j-1] = null;
            gameBoard.allCheckers[currentChecker.i+1][currentChecker.j-1].removeChild(gameBoard.allCheckers[currentChecker.i+1][currentChecker.j-1].firstChild);
        } else {
            //incrementScore(gameBoard.board[currentChecker.i+1][currentChecker.j+1].color);
            //gameBoard.board[currentChecker.i+1][currentChecker.j+1] = null;
            gameBoard.allCheckers[currentChecker.i+1][currentChecker.j+1].removeChild(gameBoard.allCheckers[currentChecker.i+1][currentChecker.j+1].firstChild);
        }
    } else {
        if (to.j < from.j) {
            //incrementScore(gameBoard.board[currentChecker.i-1][currentChecker.j-1].color);
            //gameBoard.board[currentChecker.i-1][currentChecker.j-1] = null;
            gameBoard.allCheckers[currentChecker.i-1][currentChecker.j-1].removeChild(gameBoard.allCheckers[currentChecker.i-1][currentChecker.j-1].firstChild);
        } else {
            //incrementScore(gameBoard.board[currentChecker.i-1][currentChecker.j+1].color);
            //gameBoard.board[currentChecker.i-1][currentChecker.j+1] = null;
            gameBoard.allCheckers[currentChecker.i-1][currentChecker.j+1].removeChild(gameBoard.allCheckers[currentChecker.i-1][currentChecker.j+1].firstChild);
        }
    }
}

export function moveCheckerDiv(initialCell, targetCellDiv) {
    console.log("zzk");
    console.log(gameBoard.allCheckers[initialCell.i][initialCell.j]);
    console.log(targetCellDiv);

    targetCellDiv.appendChild(gameBoard.allCheckers[initialCell.i][initialCell.j].firstChild);
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

function checkLady(i,j) {
    if (i > 6 && gameBoard.allCheckers[i][j].firstChild.classList.contains("white-checker")) {
        gameBoard.allCheckers[i][j].firstChild.classList.add("lady");
    }
    if (i < 1 && gameBoard.allCheckers[i][j].firstChild.classList.contains("black-checker")) {
        gameBoard.allCheckers[i][j].firstChild.classList.add("lady");
    }
}

const moveChecker = async (event) => {
    let newIndex = gameBoard.findIndexOfNode(event);
    moveCheckerDiv(currentChecker, event.target);
    checkLady(newIndex.i,newIndex.j);
    post({
        fromI: currentChecker.i,
        fromJ: currentChecker.j,
        toI: newIndex.i,
        toJ: newIndex.j
    }, `http://localhost:3001/checkers/${localStorage.getItem("roomId")}/updateBoard`)
        .then();
    let pos = await checker.beat(currentChecker, newIndex);
    if (pos.length > 0) {
        clearHighlightedCells();
        currentChecker = newIndex;
        checkMoveVariants(newIndex.i, newIndex.j);
        return;
    }
    clearHighlightedCells();
    removeListeners(event);
    goToNextMove();
    await startMove();
}

socket.on('checkerMoved', function(data) {
    moveCheckerDiv({i:data.fromI,j:data.fromJ}, gameBoard.allCheckers[data.toI][data.toJ]);
})
startMove().then();

