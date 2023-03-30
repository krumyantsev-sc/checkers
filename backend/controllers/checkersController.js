const moveService = require("../services/MoveService")
let boardService = require("../services/BoardService")
const {moveChecker} = require("../services/MoveService");
const {beat, getBeatPositions} = require("../services/BeatService.js")
const User = require("../models/User")
const Room = require("../models/Room")
const Player = require("../entity/player")
const emitToPlayers = require("../util/util");

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

    switchTeam(req) {
        let currColor = (this.counter % 2 !== 0) ? "White" : "Black";
        emitToPlayers(req,[this.player1.id, this.player2.id],'switchTeam',{color: currColor});
    }
    getMoveStatusInfo(req) {
        let currColor = (this.counter % 2 !== 0) ? "White" : "Black";
        (this.counter % 2 !== 0) ?
            emitToPlayers(req,[this.player1.id],'giveListeners',{color: this.player1.color}) :
            emitToPlayers(req,[this.player2.id],'giveListeners',{color: this.player2.color});
        return {firstPlayerScore: this.player1.score, secondPlayerScore: this.player2.score, color: currColor};
    }

    getPositionsForHighlighting = (i, j) => {
        return moveService.checkMoveVariants(this.boardService, i, j);
    }

    updateScore = (removedChecker, req) => {
        if (removedChecker.color === this.player1.color) {
            this.player2.score++;
        } else {
            this.player1.score++;
        }
        emitToPlayers(req,[this.player1.id,this.player2.id],'refreshScore',
            {firstPlayerScore: this.player1.score, secondPlayerScore: this.player2.score});
    }

    moveCheckerOnBoard = (req, fromI, fromJ, toI, toJ) => {
        moveChecker(this.boardService, this.boardService.board[fromI][fromJ], {i: toI, j: toJ});
        emitToPlayers(req,[this.player1.id,this.player2.id],'checkerMoved',req.body);
        if (this.boardService.board[toI][toJ].canMakeLady()) {
            emitToPlayers(req,[this.player1.id,this.player2.id],'makeLady',{i: toI, j: toJ});
        }
        let moveResult = beat(this.boardService,{i: fromI, j: fromJ}, {i: toI, j: toJ});
        let nextBeatPositions = moveResult[0];
        let removedChecker = moveResult[1];
        if (removedChecker !== undefined) {
            emitToPlayers(req,[this.player1.id,this.player2.id],'removeChecker',removedChecker);
            this.updateScore(removedChecker, req);
        }
        if (nextBeatPositions.length === 0) {
            this.counter++;
            this.switchTeam(req);
            (this.counter % 2 !== 0) ?
                emitToPlayers(req,[this.player1.id],'giveListeners',{color: this.player1.color}) :
                emitToPlayers(req,[this.player2.id],'giveListeners',{color: this.player2.color});
        }
        return nextBeatPositions;
    }

    getBeatPos = (position) => {
        return getBeatPositions(this.boardService, position.i, position.j);
    }

    getBoard = () => {
        return this.boardService.getBoard();
    }
}
module.exports = checkersController;