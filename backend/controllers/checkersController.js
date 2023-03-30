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

    switchTeam(req) {
        let currColor = (this.counter % 2 !== 0) ? "White" : "Black";
        req.app.get("socketService").emiter("switchTeam",this.player1.id,{color: currColor});
        req.app.get("socketService").emiter("switchTeam",this.player2.id,{color: currColor});
    }
    getMoveStatusInfo(req) {
        let currColor = (this.counter % 2 !== 0) ? "White" : "Black";
        (this.counter % 2 !== 0) ?
            req.app.get("socketService").emiter("giveListeners",this.player1.id,{color: this.player1.color}) :
            req.app.get("socketService").emiter("giveListeners",this.player2.id,{color: this.player2.color});
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
        req.app.get("socketService").emiter('refreshScore',this.player1.id,
            {firstPlayerScore: this.player1.score, secondPlayerScore: this.player2.score});
        req.app.get("socketService").emiter('refreshScore',this.player2.id,
            {firstPlayerScore: this.player1.score, secondPlayerScore: this.player2.score});
    }

    moveCheckerOnBoard = (req, fromI, fromJ, toI, toJ) => {
        moveChecker(this.boardService, this.boardService.board[fromI][fromJ], {i: toI, j: toJ});
        req.app.get("socketService").emiter('checkerMoved',this.player1.id, req.body);
        req.app.get("socketService").emiter('checkerMoved',this.player2.id, req.body);
        if (this.boardService.board[toI][toJ].canMakeLady()) {
            req.app.get("socketService").emiter("makeLady",this.player1.id,{i: toI, j: toJ});
            req.app.get("socketService").emiter("makeLady",this.player2.id,{i: toI, j: toJ});
        }
        let moveResult = beat(this.boardService,{i: fromI, j: fromJ}, {i: toI, j: toJ});
        let nextBeatPositions = moveResult[0];
        let removedChecker = moveResult[1];
        if (removedChecker !== undefined) {
            req.app.get("socketService").emiter("removeChecker",this.player1.id,removedChecker);
            req.app.get("socketService").emiter("removeChecker",this.player2.id,removedChecker);
            this.updateScore(removedChecker, req);
        }
        if (nextBeatPositions.length === 0) {
            this.counter++;
            this.switchTeam(req);
            (this.counter % 2 !== 0) ?
                req.app.get("socketService").emiter("giveListeners",this.player1.id,{color: this.player1.color}) :
                req.app.get("socketService").emiter("giveListeners",this.player2.id,{color: this.player2.color});
        }
        return nextBeatPositions;
    }

    getCounter = (req) => {
        if (this.counter === 1) {
            req.app.get("socketService").emiter("giveListeners",this.player1.id,{color: "White"});
            console.log(this.player1.id);
        }
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