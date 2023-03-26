//let gameBoard = require("./BoardService.js");

function getBeatPositions(gameBoard,i,j) {
    let takenPositions = [];
    if (gameBoard.board[i][j].color === "White" || gameBoard.board[i][j].isLady) {
        if (gameBoard.isCellTaken(i+1,j-1) && gameBoard.board[i][j].color !== gameBoard.board[i+1][j-1].color) {
            if (gameBoard.isFreeCell(i+2,j-2)) {
                takenPositions.push({i: i + 2, j: j - 2});
            }

        }
        if (gameBoard.isCellTaken(i+1,j+1) && gameBoard.board[i][j].color !== gameBoard.board[i+1][j+1].color) {
            if (gameBoard.isFreeCell(i+2,j+2)) {
                takenPositions.push({i: i + 2, j: j + 2});
            }
        }
    }
    if (gameBoard.board[i][j].color === "Black" || gameBoard.board[i][j].isLady) {
        if (gameBoard.isCellTaken(i-1,j-1) && gameBoard.board[i][j].color !== gameBoard.board[i-1][j-1].color) {
            if (gameBoard.isFreeCell(i-2,j-2)) {
                takenPositions.push({i:i-2,j:j-2});
            }
        }
        if (gameBoard.isCellTaken(i-1,j+1) && gameBoard.board[i][j].color !== gameBoard.board[i-1][j+1].color) {
            if (gameBoard.isFreeCell(i-2,j+2)) {
                takenPositions.push({i:i-2,j:j+2});
            }
        }
    }
    return takenPositions;
}

function beat(gameBoard, from, to) {
    let difference = to.i - from.i;
    let pos = [];
    if (Math.abs(difference) > 1) {
        removeChecker(gameBoard,from,to);
        pos = getBeatPositions(gameBoard,to.i, to.j);
    }
    return pos;
}

function removeChecker(gameBoard, from, to) {
    let currentChecker = {i:from.i,j:from.j};
    if (to.i - from.i > 0) {
        if (to.j < from.j) {
           // incrementScore(gameBoard.board[currentChecker.i+1][currentChecker.j-1].color);
            gameBoard.board[currentChecker.i+1][currentChecker.j-1] = null;
        } else {
           // incrementScore(gameBoard.board[currentChecker.i+1][currentChecker.j+1].color);
            gameBoard.board[currentChecker.i+1][currentChecker.j+1] = null;
        }
    } else {
        if (to.j < from.j) {
            //incrementScore(gameBoard.board[currentChecker.i-1][currentChecker.j-1].color);
            gameBoard.board[currentChecker.i-1][currentChecker.j-1] = null;
        } else {
            //incrementScore(gameBoard.board[currentChecker.i-1][currentChecker.j+1].color);
            gameBoard.board[currentChecker.i-1][currentChecker.j+1] = null;
        }
    }
}

module.exports = {getBeatPositions, beat};