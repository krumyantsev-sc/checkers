const moveService = require("../services/MoveService")
let boardService = require("../services/BoardService")
const {moveChecker} = require("../services/MoveService");
const {beat, getBeatPositions} = require("../services/BeatService.js")

class checkersController {
    boardService;
    constructor() {
        this.boardService = new boardService();
    }
    getPositionsForHighlighting = (i, j) => {
        return moveService.checkMoveVariants(this.boardService, i, j);
    }

    moveCheckerOnBoard = (fromI, fromJ, toI, toJ) => {
        moveChecker(this.boardService, this.boardService.board[fromI][fromJ], {i: toI, j: toJ});
        this.boardService.board[toI][toJ].makeLady();
        return beat(this.boardService,{i: fromI, j: fromJ}, {i: toI, j: toJ});
    }

    getBeatPos = (position) => {
        return getBeatPositions(this.boardService, position.i, position.j);
    }

    getBoard = () => {
        return this.boardService.getBoard();
    }
}
module.exports = checkersController;