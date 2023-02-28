let gameBoard = require("./BoardService.js");

function getBeatPositions(i,j) {
    console.log(i,j);
    console.log(gameBoard.board);
    console.log(gameBoard.board[+i][+j]);
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

function beat(from, to) {
    let difference = to.i - from.i;
    let pos = [];
    if (Math.abs(difference) > 1) {
        removeChecker(from,to);
        pos = getBeatPositions(to.i, to.j);
    }
    return pos;
}

function removeChecker(from, to) {
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