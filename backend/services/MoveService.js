let boardService = require("../services/BoardService.js")
const {getBeatPositions} = require("../services/BeatService");



function getSimpleMoveVariants(i,j) {
   // console.log("????",i,j);
    let possibleWays = [];
    if (boardService.board[i][j].color === "White" || boardService.board[i][j].isLady) {
        if (boardService.isFreeCell(i+1,j-1)) {
            possibleWays.push({i:i+1,j:j-1});
        }
        if (boardService.isFreeCell(i+1,j+1)) {
            possibleWays.push({i:i+1,j:j+1});
        }
    }
    if (boardService.board[i][j].color === "Black" || boardService.board[i][j].isLady) {
        if (boardService.isFreeCell(i-1,j-1)) {
            possibleWays.push({i:i-1,j:j-1});
        }
        if (boardService.isFreeCell(i-1,j+1)) {
            possibleWays.push({i:i-1,j:j+1});
        }
    }
    return possibleWays;
}

function checkMoveVariants(i,j) {
    //console.log("############",i,j)
    let possibleWays = getBeatPositions(i,j);
    if (possibleWays.length === 0) {
        possibleWays = getSimpleMoveVariants(i,j);
    }
    return possibleWays;
}

function moveChecker(checker,to) {
    checker.move(boardService,to);
}

module.exports = {checkMoveVariants, moveChecker};