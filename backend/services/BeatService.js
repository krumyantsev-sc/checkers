let gameBoard = require("./BoardService.js");

function getBeatPositions(i,j) {
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

module.exports = getBeatPositions;