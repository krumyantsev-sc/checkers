import Player from "../entity/player";
import {Request, Response} from "express";
import Room, {IRoom} from "../models/Room";
import emitToPlayers from "../util/util";
import User from "../models/User";
import {FinishMessage} from "../enums/finishMessage";
import {removeController} from "../routers/checkersRouter";
const jwt = require("jsonwebtoken");
const secret = require("../config/config");


class tttController {
    private player1: Player = new Player("X");
    private player2: Player = new Player("0");
    private roomId!: string;
    private currentPlayer: Player;
    private board: string[][];

    checkWinner(): string {
        const winningCombinations = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (
                this.board[a[0]][a[1]] &&
                this.board[a[0]][a[1]] === this.board[b[0]][b[1]] &&
                this.board[a[0]][a[1]] === this.board[c[0]][c[1]]
            ) {
                return this.board[a[0]][a[1]];
            }
        }

        return '';
    }


    constructor() {
        this.board = [
            ['', 'X', '0'],
            ['', '', ''],
            ['', '', '']
        ];
        this.currentPlayer = this.player1;
    }

    public getBoard = () => {
        return this.board;
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

    public makeMove = (req: Request, res: Response) => {
        const token: string = req.cookies.jwt;
        const {id: userId} = jwt.verify(token, secret);
        if (userId == this.player1.id) {
            this.board[req.body.i][req.body.j] = this.player1.color;
        }
        if (userId == this.player2.id) {
            this.board[req.body.i][req.body.j] = this.player2.color;
        }
        emitToPlayers(req,[this.player1.id, this.player2.id],'tttBoardUpdated',{board: this.board});
        let winner = this.checkWinner()
        if (winner !== "") {
            if (winner === this.player1.color) {
                emitToPlayers(req,[this.player1.id],'tttGameFinished',
                    {message: FinishMessage.Win});
                emitToPlayers(req,[this.player2.id],'tttGameFinished',
                    {message: FinishMessage.Lose});
            } else {
                emitToPlayers(req,[this.player2.id],'tttGameFinished',
                    {message: FinishMessage.Win});
                emitToPlayers(req,[this.player1.id],'tttGameFinished',
                    {message: FinishMessage.Lose});
            }
            removeController(this.roomId);
        }
    }

    public initializeGame = async (roomId: string, req: Request, res: Response,): Promise<any> => {
        this.roomId = roomId;
        try {
            const room: IRoom = await Room.findById(this.roomId)
                .populate('firstPlayer' )
                .populate('secondPlayer')
                .exec()
            room.startedAt = new Date();
            this.player1.id = room?.firstPlayer!._id.toString();
            this.player1.name = room.firstPlayer.username;
            this.player2.id = room?.secondPlayer._id.toString();
            this.player2.name = room.secondPlayer.username;
            await room.save();
        } catch {
            return res.status(404).json({message: "Game not found"});
        }
    }
}
export default tttController;