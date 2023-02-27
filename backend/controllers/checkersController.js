const moveService = require("../services/MoveService")
let boardService = require("../services/BoardService")
const {moveChecker} = require("../services/MoveService");

const getPositionsForHighlighting = (i,j) => {
    return moveService.checkMoveVariants(i,j);
}

const moveCheckerOnBoard = (fromI,fromJ,toI,toJ) => {
    console.log("&&&&",fromI,fromJ,toI,toJ);
    moveChecker(boardService.board[fromI][fromJ], {i:toI,j:toJ});
}

module.exports = {getPositionsForHighlighting, moveCheckerOnBoard};