import Player from "../entity/player";
import {Request, Response} from "express";
import Room, {IRoom} from "../models/Room";
import emitToPlayers from "../util/util";
import {FinishMessage} from "../enums/finishMessage";
import {removeController} from "../routers/checkersRouter";
import gameLogicController from "./gameLogicController";

const jwt = require("jsonwebtoken");
const secret = require("../config/config");


class tttController extends gameLogicController{
    player1: Player = new Player("X");
    player2: Player = new Player("0");
    roomId!: string;
    currentPlayer: Player;
    board: string[][];
    counter: number = 1;

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

    checkDraw(): boolean {
        return this.board.every((row) => row.every((cell) => cell !== '')) && !this.checkWinner();
    }

    constructor() {
        super();
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.currentPlayer = this.player1;
    }

    public getBoard = (req: Request) => {
        setTimeout(() => {
            if (this.counter % 2 !== 0) {
                emitToPlayers(req, [this.player1.id], 'tttGiveListeners', {message: "hod"});
                emitToPlayers(req, [this.player1.id, this.player2.id], 'changeSymbol', {symbol: "X"});
            } else {
                emitToPlayers(req, [this.player2.id], 'tttGiveListeners', {message: "hod"});
                emitToPlayers(req, [this.player1.id, this.player2.id], 'changeSymbol', {symbol: "0"});
            }
        }, 1000)

        return this.board;
    }

    public getGameInfo = async (req: Request, res: Response) => {
        const room: IRoom = await Room.findById(this.roomId)
            .populate('firstPlayer')
            .populate('secondPlayer')
            .exec();
        res.status(201).json({
            firstPlayer: {name: this.player1.name, avatar: room.firstPlayer.avatar},
            secondPlayer: {name: this.player2.name, avatar: room.secondPlayer.avatar}, gameId: this.roomId
        });
    }

    private finishGame = async (): Promise<void> => {
        const room = await Room.findById(this.roomId);
        room.status = "finished";
        room.finishedAt = new Date();
        await room.save();
    }

    public makeMove = async (req: Request) => {
        const token: string = req.cookies.jwt;
        const {id: userId} = jwt.verify(token, secret);
        if (userId == this.player1.id) {
            this.board[req.body.i][req.body.j] = this.player1.color;
        }
        if (userId == this.player2.id) {
            this.board[req.body.i][req.body.j] = this.player2.color;
        }
        emitToPlayers(req, [this.player1.id, this.player2.id], 'tttBoardUpdated', {board: this.board});
        let winner = this.checkWinner();
        let isDraw = this.checkDraw();
        if (winner !== "") {
            if (winner === this.player1.color) {
                this.emitWin(this.player1.id, this.player2.id, req);
            } else {
                this.emitWin(this.player2.id, this.player1.id, req);
            }
        } else if (isDraw) {
            emitToPlayers(req, [this.player1.id, this.player2.id], 'gameFinished',
                {message: FinishMessage.Draw});
            await this.finishGame();
        } else {
            this.counter++;
            if (this.counter % 2 !== 0) {
                emitToPlayers(req, [this.player1.id], 'tttGiveListeners', {});
                emitToPlayers(req, [this.player1.id, this.player2.id], 'changeSymbol', {symbol: "X"});
            } else {
                emitToPlayers(req, [this.player2.id], 'tttGiveListeners', {});
                emitToPlayers(req, [this.player1.id, this.player2.id], 'changeSymbol', {symbol: "0"});
            }
        }
    }
}

export default tttController;