import Board from './board.js';
import checker from './checker.js';
import Player from './player.js';
import Bot from './bot.js';
import {post} from './util.js';

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

// async function test() {
//     let response = await fetch("http://localhost:3001/test");
//
//     if (response.ok) { // если HTTP-статус в диапазоне 200-299
//         // получаем тело ответа (см. про этот метод ниже)
//         let text = await response.text();
//         console.log(text);
//     } else {
//         alert("Ошибка HTTP: " + response.status);
//     }
// }
// test();
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

export function startMove() {
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
      // setTimeout(() => {bot.moveClosestChecker()}, 1000);
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

// function checkBorders(i,j) {
//     return (i > -1 && i < 8 && j > -1 && j < 8);
// }

// function isFreeCell(i,j) {
//     return (checkBorders(i,j) && gameBoard.board[i][j] == null);
// }
//
// function isCellTaken(i,j) {
//     return (checkBorders(i,j) && gameBoard.board[i][j] != null); //&& !gameBoard.allCheckers[i][j].classList.contains("cleanCell") && gameBoard.allCheckers[i][j] !== undefined);
// }
//
// export function getBeatPositions(i,j) {
//     let takenPositions = [];
//         if (gameBoard.board[i][j].color === "White" || gameBoard.board[i][j].isLady) {
//             if (isCellTaken(i+1,j-1) && gameBoard.board[i][j].color !== gameBoard.board[i+1][j-1].color) {
//                 if (isFreeCell(i+2,j-2)) {
//                     takenPositions.push({i: i + 2, j: j - 2});
//                 }
//
//             }
//             if (isCellTaken(i+1,j+1) && gameBoard.board[i][j].color !== gameBoard.board[i+1][j+1].color) {
//                 if (isFreeCell(i+2,j+2)) {
//                     takenPositions.push({i: i + 2, j: j + 2});
//                 }
//             }
//         }
//     if (gameBoard.board[i][j].color === "Black" || gameBoard.board[i][j].isLady) {
//         if (isCellTaken(i-1,j-1) && gameBoard.board[i][j].color !== gameBoard.board[i-1][j-1].color) {
//             if (isFreeCell(i-2,j-2)) {
//                 takenPositions.push({i:i-2,j:j-2});
//             }
//         }
//         if (isCellTaken(i-1,j+1) && gameBoard.board[i][j].color !== gameBoard.board[i-1][j+1].color) {
//             if (isFreeCell(i-2,j+2)) {
//                 takenPositions.push({i:i-2,j:j+2});
//             }
//         }
// }
//     return takenPositions;
// }
//
// export function calculateSimpleMoveVariants(i,j) {
//     let possibleWays = [];
//     if (gameBoard.board[i][j].color === "White" || gameBoard.board[i][j].isLady) {
//         if (isFreeCell(i+1,j-1)) {
//             possibleWays.push({i:i+1,j:j-1});
//         }
//         if (isFreeCell(i+1,j+1)) {
//             possibleWays.push({i:i+1,j:j+1});
//         }
//     }
//     if (gameBoard.board[i][j].color === "Black" || gameBoard.board[i][j].isLady) {
//         if (isFreeCell(i-1,j-1)) {
//             possibleWays.push({i:i-1,j:j-1});
//         }
//         if (isFreeCell(i-1,j+1)) {
//             possibleWays.push({i:i-1,j:j+1});
//         }
//     }
//     return possibleWays;
// }

export function checkMoveVariants(i,j) {
    let position = {
        i: i,
        j: j
    };
    post(position,'http://localhost:3001/checkers/getPossiblePositions')
        .then(response => response.json())
        .then(json => {
            if (json.length > 0) {
               highlightPossibleWays(json);
               addMoveListener(json);
            }
        });
        // let possibleWays = getBeatPositions(i,j);
        // if (possibleWays.length === 0) {
        //     possibleWays = calculateSimpleMoveVariants(i,j);
        // }
        // if (possibleWays.length > 0) {
        //     highlightPossibleWays(possibleWays);
        //     addMoveListener(possibleWays);
        // }
}

function checkPossibilities(event) {
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

const moveChecker = (event) => {
    let newIndex = gameBoard.findIndexOfNode(event);
    moveCheckerDiv(currentChecker, event.target);
    post({fromI:currentChecker.i,fromJ:currentChecker.j,toI:newIndex.i,toJ:newIndex.j},'http://localhost:3001/checkers/updateBoard')
        .then();
    //player1.moveChecker(gameBoard.board[currentChecker.i][currentChecker.j], gameBoard, currentChecker, newIndex);
    //gameBoard.board[newIndex.i][newIndex.j].checkLady();
    let pos = checker.beat(currentChecker, newIndex);
    console.log("$$$$$$$", pos);
    console.log(pos[0]);
    if(pos.length > 0) {
        console.log("tut")
         clearHighlightedCells();
         currentChecker = newIndex;
         checkMoveVariants(newIndex.i,newIndex.j);
         return;
    }
    clearHighlightedCells();
    removeListeners(event);
    goToNextMove();
    startMove();
}
startMove();

