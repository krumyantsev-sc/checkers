const moveService = require("../services/MoveService")
let boardService = require("../services/BoardService")
const {moveChecker} = require("../services/MoveService");
const {beat, getBeatPositions} = require("../services/BeatService.js")
import User from "../models/User"
const Room = require("../models/Room")
const Player = require("../entity/player")
const emitToPlayers = require("../util/util");

class checkersController {
    private counter: number = 1;
    private roomId!: string;
    private readonly boardService;
    private player1 = new Player("White");
    private player2 = new Player("Black");

    constructor() {
        this.boardService = new boardService();
    }

    public initializeGame = async (roomId: string) => {
        this.roomId = roomId;
        const room = await Room.findById(this.roomId);
        this.player1.id = room?.firstPlayerId!;
        this.player2.id = room?.secondPlayerId!;
    }

    private switchTeam = (req: any): void => {
        let currColor: string = (this.counter % 2 !== 0) ? "White" : "Black";
        emitToPlayers(req,[this.player1.id, this.player2.id],'switchTeam',{color: currColor});
    }

    public getMoveStatusInfo = (req: any): {firstPlayerScore: number, secondPlayerScore: number, color: string} => {
        let currColor = (this.counter % 2 !== 0) ? "White" : "Black";
        (this.counter % 2 !== 0) ?
            emitToPlayers(req,[this.player1.id],'giveListeners',{color: this.player1.color}) :
            emitToPlayers(req,[this.player2.id],'giveListeners',{color: this.player2.color});
        return {firstPlayerScore: this.player1.score, secondPlayerScore: this.player2.score, color: currColor};
    }

    public getPositionsForHighlighting = (i: number, j: number) => {
        return moveService.checkMoveVariants(this.boardService, i, j);
    }

    private checkWin = (req: any) => {
        if (this.player1.score === 12) {
            emitToPlayers(req,[this.player1.id,this.player2.id],'gameFinished',
                {message: "Победа белых"});
        }
        if (this.player2.score === 12) {
            emitToPlayers(req,[this.player1.id,this.player2.id],'gameFinished',
                {message: "Победа черных"});
        }
    }

    private updateScore = (removedChecker: any, req: any) => {
        if (removedChecker.color === this.player1.color) {
            this.player2.score++;
            this.checkWin(req);
        } else {
            this.player1.score++;
            this.checkWin(req);
        }
        emitToPlayers(req,[this.player1.id,this.player2.id],'refreshScore',
            {firstPlayerScore: this.player1.score, secondPlayerScore: this.player2.score});
    }

    public moveCheckerOnBoard = (req: any, fromI: number, fromJ: number, toI: number, toJ: number) => {
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

    public getBeatPos = (position: {i: number, j: number}): Array<{i: number, j: number}> => {
        return getBeatPositions(this.boardService, position.i, position.j);
    }


    public getBoard = () => {
        return this.boardService.getBoard();
    }
}
module.exports = checkersController;