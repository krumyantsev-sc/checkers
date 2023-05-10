import boardService from "../services/BoardService"
import {moveChecker,checkMoveVariants} from "../services/MoveService";
import {beat, getBeatPositions} from "../services/BeatService";
import Room, {IRoom} from "../models/Room"
import Player from "../entity/player"
import emitToPlayers from "../util/util";
import {Request, Response} from 'express';
import {checkerCoords, checkerCoordsWithColor, score} from "../types/checkersTypes";
import checker from "../entity/checker";
import {FinishMessage} from "../enums/finishMessage";
import User from "../models/User";
import EventEmitter = require("events");
import {removeController} from "../routers/checkersRouter";

class checkersController {
    emitter = new EventEmitter();
    private counter: number = 2;
    private roomId!: string;
    private readonly boardService: boardService;
    private player1: Player = new Player("White");
    private player2: Player = new Player("Black");

    constructor() {
        this.boardService = new boardService();
    }

    public initializeGame = async (roomId: string, req: Request, res: Response,): Promise<any> => {
        this.roomId = roomId;
        console.log(this.roomId)
        try {
            const room: IRoom = await Room.findById(this.roomId)
                .populate('firstPlayer' )
                .populate('secondPlayer')
                .exec()
            room.startedAt = new Date();
            console.log(room.firstPlayer);
            this.player1.id = room?.firstPlayer!._id.toString();
            this.player1.name = room.firstPlayer.username;
            this.player2.id = room?.secondPlayer._id.toString();
            this.player2.name = room.secondPlayer.username;
            await room.save();
        } catch {
            return res.status(404).json({message: "Game not found"});
        }
    }

    private updateStats = async (winnerId: string, loserId: string): Promise<void> => {
        const winner = await User.findById(winnerId);
        const loser = await User.findById(loserId);
        const room = await Room.findById(this.roomId);
        winner.statistics.wins++;
        loser.statistics.loses++;
        room.status = "finished";
        room.winner = winner;
        room.finishedAt = new Date();
        await winner.save();
        await loser.save();
        await room.save();
}

    public getGameInfo = (req: Request, res: Response) => {
        console.log(this.player1.name)
        res.status(201).json({firstPlayer: {name: this.player1.name, score: this.player1.score},
            secondPlayer: {name: this.player2.name, score: this.player2.score}, gameId: this.roomId});
    }

    private switchTeam = (req: Request): void => {
        let currColor: string = (this.counter % 2 !== 0) ? "White" : "Black";
        emitToPlayers(req,[this.player1.id, this.player2.id],'switchTeam',{color: currColor});
    }

    public getMoveStatusInfo = (req: Request) => {
        let currColor = (this.counter % 2 !== 0) ? "White" : "Black";
        (this.counter % 2 !== 0) ?
            emitToPlayers(req,[this.player1.id],'giveListeners',{color: this.player1.color}) :
            emitToPlayers(req,[this.player2.id],'giveListeners',{color: this.player2.color});
        emitToPlayers(req,[this.player1.id, this.player2.id],'switchTeam',{color: currColor});
        //return {firstPlayerScore: this.player1.score, secondPlayerScore: this.player2.score, color: currColor};
        return {message: "successfully sent"};
    }

    public getPositionsForHighlighting = (req: Request): checkerCoords[] => {
        return checkMoveVariants(this.boardService, req.body);
    }

    private checkWin = (req: Request): void => {
        if (this.player1.score === 12) {
            this.updateStats(this.player1.id, this.player2.id).then(() => {
                emitToPlayers(req,[this.player1.id],'gameFinished',
                    {message: FinishMessage.Win});
                emitToPlayers(req,[this.player2.id],'gameFinished',
                    {message: FinishMessage.Lose});
                removeController(this.roomId);
            })
        }
        if (this.player2.score === 12) {
            this.updateStats(this.player2.id, this.player1.id).then(() => {
                emitToPlayers(req,[this.player1.id],'gameFinished',
                    {message: FinishMessage.Lose});
                emitToPlayers(req,[this.player2.id],'gameFinished',
                    {message: FinishMessage.Win});
                removeController(this.roomId);
            })
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
        emitToPlayers(req,[this.player1.id,this.player2.id],'refreshScore',
            {firstPlayerScore: this.player1.score, secondPlayerScore: this.player2.score});
    }


    public moveCheckerOnBoard = (req: Request): checkerCoords[] => {
        const {fromI,fromJ,toI,toJ} = req.body;
        const fromObj: checkerCoords = {i: fromI, j: fromJ};
        const toObj: checkerCoords = {i: toI, j: toJ};
        moveChecker(this.boardService, this.boardService.board[fromI][fromJ], toObj);
        emitToPlayers(req,[this.player1.id,this.player2.id],'checkerMoved',req.body);
        if (this.boardService.board[toI][toJ].canMakeLady()) {
            emitToPlayers(req, [this.player1.id, this.player2.id], 'makeLady', toObj);
        }
        let moveResult: [checkerCoords[], (checkerCoordsWithColor | undefined)] = beat(this.boardService,fromObj, toObj);
        let nextBeatPositions: checkerCoords[] = moveResult[0];
        let removedChecker: checkerCoordsWithColor | undefined = moveResult[1];
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

    public getBeatPos = (position: checkerCoords): Array<checkerCoords> => {
        return getBeatPositions(this.boardService, position);
    }

    public getBoard = (): (checker | null)[][] => {
        return this.boardService.getBoard();
    }
}
export default checkersController;