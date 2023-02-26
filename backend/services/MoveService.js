let gameBoard = require("../services/BoardService.js")

let board = new gameBoard();
board.init();
function checkBorders(i,j) {
    return (i > -1 && i < 8 && j > -1 && j < 8);
}

function isFreeCell(i,j) {
    return (checkBorders(i,j) && board.board[i][j] == null);
}


function getSimpleMoveVariants(i,j) {
    console.log("????",i,j);
    let possibleWays = [];
    console.log(board);
    if (board.board[i][j].color === "White" || board.board[i][j].isLady) {
        if (isFreeCell(i+1,j-1)) {
            possibleWays.push({i:i+1,j:j-1});
        }
        if (isFreeCell(i+1,j+1)) {
            possibleWays.push({i:i+1,j:j+1});
        }
    }
    if (board.board[i][j].color === "Black" || board.board[i][j].isLady) {
        if (isFreeCell(i-1,j-1)) {
            possibleWays.push({i:i-1,j:j-1});
        }
        if (isFreeCell(i-1,j+1)) {
            possibleWays.push({i:i-1,j:j+1});
        }
    }
    return possibleWays;
}

module.exports = {getSimpleMoveVariants};