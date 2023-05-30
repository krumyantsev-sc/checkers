import boardService from "../services/BoardService"
import {moveChecker, checkMoveVariants, getBotMovePosition} from "../services/MoveService";
import {beat, getBeatPositions} from "../services/BeatService";
import Player from "../entity/player"
import emitToPlayers from "../util/util";
import {Request, Response} from 'express';
import {checkerCoords, checkerCoordsWithColor, moveCoords} from "../types/checkersTypes";
import checker from "../entity/checker";
import gameLogicController from "./gameLogicController";

class checkersController extends gameLogicController {
    counter: number = 2;
    roomId!: string;
    private readonly boardService: boardService;
    player1: Player = new Player("White");
    player2: Player = new Player("Black");
    withBot: boolean = false;

    constructor() {
        super();
        this.boardService = new boardService();
    }

    public getGameInfo = (req: Request, res: Response) => {
        res.status(201).json({
            firstPlayer: {name: this.player1.name, score: this.player1.score},
            secondPlayer: {name: this.player2.name, score: this.player2.score}, gameId: this.roomId
        });
    }

    private switchTeam = (req: Request): void => {
        let currColor: string = (this.counter % 2 !== 0) ? "White" : "Black";
        emitToPlayers(req, [this.player1.id, this.player2.id], 'switchTeam', {color: currColor});
    }

    public getMoveStatusInfo = (req: Request) => {
        let currColor = (this.counter % 2 !== 0) ? "White" : "Black";
        if (this.counter % 2 !== 0) {
            emitToPlayers(req, [this.player1.id], 'giveListeners', {color: this.player1.color})
        } else {
            emitToPlayers(req, [this.player2.id], 'giveListeners', {color: this.player2.color});
            if (this.withBot) {
                this.getBotMove(req)

            }
        }
        emitToPlayers(req, [this.player1.id, this.player2.id], 'switchTeam', {color: currColor});
        return {message: "successfully sent"};
    }

    public getPositionsForHighlighting = (req: Request): checkerCoords[] => {
        return checkMoveVariants(this.boardService, req.body);
    }

    private checkWin = (req: Request): void => {
        if (this.player1.score === 12) {
            this.emitWin(this.player1.id, this.player2.id, req);
        }
        if (this.player2.score === 12) {
            this.emitWin(this.player2.id, this.player1.id, req);
        }
    }

    private updateScore = (removedChecker: checkerCoordsWithColor, req: Request): void => {
        if (removedChecker.color === this.player1.color) {
            this.player2.score++;
            this.checkWin(req);
        } else {
            this.player1.score++;
            this.checkWin(req);
        }
        emitToPlayers(req, [this.player1.id, this.player2.id], 'refreshScore',
            {firstPlayerScore: this.player1.score, secondPlayerScore: this.player2.score});
    }

    private processOneMove = (req: Request, moveObj: moveCoords) => {
        const {fromI, fromJ, toI, toJ} = moveObj;
        const fromObj: checkerCoords = {i: fromI, j: fromJ};
        const toObj: checkerCoords = {i: toI, j: toJ};
        moveChecker(this.boardService, this.boardService.board[fromI][fromJ], toObj);
        emitToPlayers(req, [this.player1.id, this.player2.id], 'checkerMoved', {
            fromI: fromI,
            fromJ: fromJ,
            toI: toI,
            toJ: toJ
        });
        if (this.boardService.board[toI][toJ].canMakeLady()) {
            emitToPlayers(req, [this.player1.id, this.player2.id], 'makeLady', toObj);
        }
        let moveResult = beat(this.boardService, fromObj, toObj);
        let nextBeatPositions: checkerCoords[] = moveResult[0];
        let removedChecker: checkerCoordsWithColor | undefined = moveResult[1];
        if (removedChecker !== undefined) {
            emitToPlayers(req, [this.player1.id, this.player2.id], 'removeChecker', removedChecker);
            this.updateScore(removedChecker, req);
        }
        return nextBeatPositions;
    }

    private goToNextMove = (req: Request) => {
        this.counter++;
        this.switchTeam(req);
        if (this.withBot && this.counter % 2 === 0)
            this.getBotMove(req);
        (this.counter % 2 !== 0) ?
            emitToPlayers(req, [this.player1.id], 'giveListeners', {color: this.player1.color}) :
            emitToPlayers(req, [this.player2.id], 'giveListeners', {color: this.player2.color});
    }

    private handleMove = (req: Request, moveObj: moveCoords) => {
        const nextBeatPositions = this.processOneMove(req, moveObj);
        if (nextBeatPositions.length === 0) {
            this.goToNextMove(req);
        } else {
            setTimeout(() => {
                this.handleMove(
                    req,
                    {fromI: moveObj.toI, fromJ: moveObj.toJ, toI: nextBeatPositions[0].i, toJ: nextBeatPositions[0].j}
                );
            }, 2000);
        }
    }

    public getBotMove = (req: Request) => {
        setTimeout(() => {
            this.handleMove(req, getBotMovePosition(this.boardService));
        }, 2000);
    }

    public moveCheckerOnBoard = (req: Request): checkerCoords[] => {
        const nextBeatPositions = this.processOneMove(req, req.body);
        if (nextBeatPositions.length === 0) {
            this.goToNextMove(req);
        }
        return nextBeatPositions;
    }

    public getBeatPos = (position: checkerCoords): Array<checkerCoords> => {
        return getBeatPositions(this.boardService, position);
    }

    public getBoard = (): (checker | null)[][] => {
        return this.boardService.getBoard();
    }
}

export default checkersController;