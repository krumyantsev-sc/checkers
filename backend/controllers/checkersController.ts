import boardService from "../services/BoardService"
import {moveChecker,checkMoveVariants} from "../services/MoveService";
import {beat, getBeatPositions} from "../services/BeatService";
import Room from "../models/Room"
import {IRoom} from "../models/Room"
import Player from "../entity/player"
import emitToPlayers from "../util/util";
import checker from "../entity/checker";
import {Request} from 'express';

class checkersController {
    private counter: number = 1;
    private roomId!: string;
    private readonly boardService: boardService;
    private player1: Player = new Player("White");
    private player2: Player = new Player("Black");

    constructor() {
        this.boardService = new boardService();
    }

    public initializeGame = async (roomId: string) => {
        this.roomId = roomId;
        const room = await Room.findById(this.roomId);
        this.player1.id = room?.firstPlayerId!;
        this.player2.id = room?.secondPlayerId!;
    }

    private switchTeam = (req: Request): void => {
        let currColor: string = (this.counter % 2 !== 0) ? "White" : "Black";
        emitToPlayers(req,[this.player1.id, this.player2.id],'switchTeam',{color: currColor});
    }

    public getMoveStatusInfo = (req: Request): {firstPlayerScore: number, secondPlayerScore: number, color: string} => {
        let currColor = (this.counter % 2 !== 0) ? "White" : "Black";
        (this.counter % 2 !== 0) ?
            emitToPlayers(req,[this.player1.id],'giveListeners',{color: this.player1.color}) :
            emitToPlayers(req,[this.player2.id],'giveListeners',{color: this.player2.color});
        return {firstPlayerScore: this.player1.score, secondPlayerScore: this.player2.score, color: currColor};
    }

    public getPositionsForHighlighting = (i: number, j: number) => {
        return checkMoveVariants(this.boardService, i, j);
    }

    private checkWin = (req: Request) => {
        if (this.player1.score === 12) {
            emitToPlayers(req,[this.player1.id,this.player2.id],'gameFinished',
                {message: "Победа белых"});
        }
        if (this.player2.score === 12) {
            emitToPlayers(req,[this.player1.id,this.player2.id],'gameFinished',
                {message: "Победа черных"});
        }
    }

    private updateScore = (removedChecker: {i: number, j: number, color: string}, req: Request) => {
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


    public moveCheckerOnBoard = (req: Request, fromI: number, fromJ: number, toI: number, toJ: number) => {
        moveChecker(this.boardService, this.boardService.board[fromI][fromJ], {i: toI, j: toJ});
        emitToPlayers(req,[this.player1.id,this.player2.id],'checkerMoved',req.body);
        if (this.boardService.board[toI][toJ].canMakeLady()) {
            emitToPlayers(req, [this.player1.id, this.player2.id], 'makeLady', {i: toI, j: toJ});
        }
        let moveResult: [{i:number,j:number}[], ({i:number,j:number,color:string} | undefined)] = beat(this.boardService,{i: fromI, j: fromJ}, {i: toI, j: toJ});
        let nextBeatPositions: {i:number,j:number}[] = moveResult[0];
        let removedChecker: {i:number,j:number,color:string} | undefined = moveResult[1];
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
export default checkersController;