const moveService = require("../services/MoveService")
let boardService = require("../services/BoardService")
const {moveChecker} = require("../services/MoveService");
const {beat} = require("../services/BeatService.js")

const getPositionsForHighlighting = (i,j) => {
    return moveService.checkMoveVariants(i,j);
}

const moveCheckerOnBoard = (fromI,fromJ,toI,toJ) => {
   // console.log("&&&&",fromI,fromJ,toI,toJ);
    moveChecker(boardService.board[fromI][fromJ], {i:toI,j:toJ});
    return beat({i:fromI,j:fromJ},{i:toI,j:toJ});
}

module.exports = {getPositionsForHighlighting, moveCheckerOnBoard};