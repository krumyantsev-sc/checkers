import {User} from "../pgModels/User";
import {Room} from "../pgModels/Room";
import {Request, Response} from "express";
import emitToPlayers from "../util/util";
import {FinishMessage} from "../enums/finishMessage";
import {removeController} from "../routers/checkersRouter";
import {Statistic} from "../pgModels/Statistic";

const jwt = require("jsonwebtoken");
const secret = require("../config/config");

export default class gameLogicController {
    protected counter;
    protected roomId;
    protected player1;
    protected player2;

    public updateStats = async (winnerId: string, loserId: string): Promise<void> => {
        try {
            const winner = await User.findByPk(winnerId);
            const loser = await User.findByPk(loserId);
            const room = await Room.findByPk(this.roomId);

            if (!winner || !loser || !room) {
                console.error("Winner, loser, or room not found.");
                return;
            }

            const winnerStats = await Statistic.findOne({where: {userId: winnerId}})
            const loserStats = await Statistic.findOne({where: {userId: loserId}})
            winnerStats.wins++;
            loserStats.loses++;
            room.status = "finished";
            room.winnerId = winner.id;
            room.finishedAt = new Date();

            await winner.save();
            await loser.save();
            await room.save();
        } catch (error) {
            console.error(error);
        }
    };

    public initializeGame = async (roomId: string, req: Request, res: Response): Promise<any> => {
        this.roomId = roomId;

        try {
            const room = await Room.findByPk(roomId);
            const firstPlayer = await User.findByPk(room.firstPlayerId);
            const secondPlayer = await User.findByPk(room.secondPlayerId);
            if (!room || !room.firstPlayerId || !room.secondPlayerId) {
                return res.status(404).json({message: "Game not found"});
            }

            room.startedAt = new Date();
            this.player1.id = firstPlayer.id;
            this.player1.name = firstPlayer.username;
            this.player2.id = secondPlayer.id;
            this.player2.name = secondPlayer.username;

            await room.save();

        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "An error occurred while initializing the game"});
        }
    };

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