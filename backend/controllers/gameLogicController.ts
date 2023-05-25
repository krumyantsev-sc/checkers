import User from "../models/User";
import Room, {IRoom} from "../models/Room";
import {Request, Response} from "express";
import emitToPlayers from "../util/util";
import {FinishMessage} from "../enums/finishMessage";
import {removeController} from "../routers/checkersRouter";

const jwt = require("jsonwebtoken");
const secret = require("../config/config");

export default class gameLogicController {
    protected counter;
    protected roomId;
    protected player1;
    protected player2;

    updateStats = async (winnerId: string, loserId: string): Promise<void> => {
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

    initializeGame = async (roomId: string, req: Request, res: Response,): Promise<any> => {
        this.roomId = roomId;
        try {
            const room: IRoom = await Room.findById(this.roomId)
                .populate('firstPlayer')
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

    finishGameOnDisconnect = (req: Request) => {
        try {
            const token: string = req.cookies.jwt;
            const {id: userId} = jwt.verify(token, secret);
            if (this.player1.id === userId) {
                this.emitWin(this.player1.id, this.player2.id, req);
            }
            if (this.player2.id === userId) {
                this.emitWin(this.player2.id, this.player1.id, req);
            }
        } catch (error) {
            console.log(error);
        }
    }

    emitWin = (winnerId: string, loserId: string, req: Request) => {
        this.updateStats(winnerId, loserId).then(() => {
            emitToPlayers(req, [winnerId], 'gameFinished',
                {message: FinishMessage.Win});
            emitToPlayers(req, [loserId], 'gameFinished',
                {message: FinishMessage.Lose});
            removeController(this.roomId);
        });
    }

}