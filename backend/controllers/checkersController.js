const moveService = require("../services/MoveService")
let boardService = require("../services/BoardService")
const {moveChecker} = require("../services/MoveService");
const {beat, getBeatPositions} = require("../services/BeatService.js")
const User = require("../models/User")
const Room = require("../models/Room")
const Player = require("../entity/player")

class checkersController {
    counter = 1;
    roomId;
    boardService;
    player1 = new Player("White");
    player2 = new Player("Black");
    constructor() {
        this.boardService = new boardService();
    }

    async initializeGame(roomId) {
        this.roomId = roomId;
        const room = await Room.findById(this.roomId);
        this.player1.id = room.firstPlayerId;
        this.player2.id = room.secondPlayerId;
    }
    getPositionsForHighlighting = (i, j) => {
        return moveService.checkMoveVariants(this.boardService, i, j);
    }

    moveCheckerOnBoard = (fromI, fromJ, toI, toJ) => {
        moveChecker(this.boardService, this.boardService.board[fromI][fromJ], {i: toI, j: toJ});
        this.boardService.board[toI][toJ].makeLady();
        let pos = beat(this.boardService,{i: fromI, j: fromJ}, {i: toI, j: toJ});
        if (pos.length === 0) {
            this.counter++;
        }
        return pos;
    }

    getCounter = () => {
        return this.counter;
    }

    getBeatPos = (position) => {
        return getBeatPositions(this.boardService, position.i, position.j);
    }

    getBoard = () => {
        return this.boardService.getBoard();
    }
}
module.exports = checkersController;