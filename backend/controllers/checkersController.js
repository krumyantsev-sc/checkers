const moveService = require("../services/MoveService")
let boardService = require("../services/BoardService")
const {moveChecker} = require("../services/MoveService");
const {beat, getBeatPositions} = require("../services/BeatService.js")
const User = require("../models/User")
const Room = require("../models/Room")

class checkersController {
    roomId;
    boardService;
    player1;
    player2;
    constructor() {
        this.boardService = new boardService();
    }

    async initializeGame(roomId) {
        this.roomId = roomId;
        const room = await Room.findById(this.roomId);
        this.player1 = room.firstPlayerId;
        this.player2 = room.secondPlayerId;
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