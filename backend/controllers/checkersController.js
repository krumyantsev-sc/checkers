"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BoardService_1 = require("../services/BoardService");
const MoveService_1 = require("../services/MoveService");
const BeatService_1 = require("../services/BeatService");
const Room_1 = require("../models/Room");
const player_1 = require("../entity/player");
const util_1 = require("../util/util");
const finishMessage_1 = require("../enums/finishMessage");
const User_1 = require("../models/User");
const EventEmitter = require("events");
const checkersRouter_1 = require("../routers/checkersRouter");
const jwt = require("jsonwebtoken");
const secret = require("../config/config");
class checkersController {
    constructor() {
        this.emitter = new EventEmitter();
        this.counter = 2;
        this.player1 = new player_1.default("White");
        this.player2 = new player_1.default("Black");
        this.finishGameOnDisconnect = (req) => {
            try {
                const token = req.cookies.jwt;
                const { id: userId } = jwt.verify(token, secret);
                if (this.player1.id === userId) {
                    this.emitWin(this.player1.id, this.player2.id, req);
                }
                if (this.player2.id === userId) {
                    this.emitWin(this.player2.id, this.player1.id, req);
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        this.initializeGame = (roomId, req, res) => __awaiter(this, void 0, void 0, function* () {
            this.roomId = roomId;
            console.log(this.roomId);
            try {
                const room = yield Room_1.default.findById(this.roomId)
                    .populate('firstPlayer')
                    .populate('secondPlayer')
                    .exec();
                room.startedAt = new Date();
                console.log(room.firstPlayer);
                this.player1.id = room === null || room === void 0 ? void 0 : room.firstPlayer._id.toString();
                this.player1.name = room.firstPlayer.username;
                this.player2.id = room === null || room === void 0 ? void 0 : room.secondPlayer._id.toString();
                this.player2.name = room.secondPlayer.username;
                yield room.save();
            }
            catch (_a) {
                return res.status(404).json({ message: "Game not found" });
            }
        });
        this.updateStats = (winnerId, loserId) => __awaiter(this, void 0, void 0, function* () {
            const winner = yield User_1.default.findById(winnerId);
            const loser = yield User_1.default.findById(loserId);
            const room = yield Room_1.default.findById(this.roomId);
            winner.statistics.wins++;
            loser.statistics.loses++;
            room.status = "finished";
            room.winner = winner;
            room.finishedAt = new Date();
            yield winner.save();
            yield loser.save();
            yield room.save();
        });
        this.getGameInfo = (req, res) => {
            console.log(this.player1.name);
            res.status(201).json({ firstPlayer: { name: this.player1.name, score: this.player1.score },
                secondPlayer: { name: this.player2.name, score: this.player2.score }, gameId: this.roomId });
        };
        this.switchTeam = (req) => {
            let currColor = (this.counter % 2 !== 0) ? "White" : "Black";
            (0, util_1.default)(req, [this.player1.id, this.player2.id], 'switchTeam', { color: currColor });
        };
        this.getMoveStatusInfo = (req) => {
            let currColor = (this.counter % 2 !== 0) ? "White" : "Black";
            (this.counter % 2 !== 0) ?
                (0, util_1.default)(req, [this.player1.id], 'giveListeners', { color: this.player1.color }) :
                (0, util_1.default)(req, [this.player2.id], 'giveListeners', { color: this.player2.color });
            (0, util_1.default)(req, [this.player1.id, this.player2.id], 'switchTeam', { color: currColor });
            //return {firstPlayerScore: this.player1.score, secondPlayerScore: this.player2.score, color: currColor};
            return { message: "successfully sent" };
        };
        this.getPositionsForHighlighting = (req) => {
            return (0, MoveService_1.checkMoveVariants)(this.boardService, req.body);
        };
        this.emitWin = (winnerId, loserId, req) => {
            this.updateStats(winnerId, loserId).then(() => {
                (0, util_1.default)(req, [winnerId], 'gameFinished', { message: finishMessage_1.FinishMessage.Win });
                (0, util_1.default)(req, [loserId], 'gameFinished', { message: finishMessage_1.FinishMessage.Lose });
                (0, checkersRouter_1.removeController)(this.roomId);
            });
        };
        this.checkWin = (req) => {
            if (this.player1.score === 12) {
                this.emitWin(this.player1.id, this.player2.id, req);
            }
            if (this.player2.score === 12) {
                this.emitWin(this.player2.id, this.player1.id, req);
            }
        };
        this.updateScore = (removedChecker, req) => {
            if (removedChecker.color === this.player1.color) {
                this.player2.score++;
                this.checkWin(req);
            }
            else {
                this.player1.score++;
                this.checkWin(req);
            }
            (0, util_1.default)(req, [this.player1.id, this.player2.id], 'refreshScore', { firstPlayerScore: this.player1.score, secondPlayerScore: this.player2.score });
        };
        this.moveCheckerOnBoard = (req) => {
            const { fromI, fromJ, toI, toJ } = req.body;
            const fromObj = { i: fromI, j: fromJ };
            const toObj = { i: toI, j: toJ };
            (0, MoveService_1.moveChecker)(this.boardService, this.boardService.board[fromI][fromJ], toObj);
            (0, util_1.default)(req, [this.player1.id, this.player2.id], 'checkerMoved', req.body);
            if (this.boardService.board[toI][toJ].canMakeLady()) {
                (0, util_1.default)(req, [this.player1.id, this.player2.id], 'makeLady', toObj);
            }
            let moveResult = (0, BeatService_1.beat)(this.boardService, fromObj, toObj);
            let nextBeatPositions = moveResult[0];
            let removedChecker = moveResult[1];
            if (removedChecker !== undefined) {
                (0, util_1.default)(req, [this.player1.id, this.player2.id], 'removeChecker', removedChecker);
                this.updateScore(removedChecker, req);
            }
            if (nextBeatPositions.length === 0) {
                this.counter++;
                this.switchTeam(req);
                (this.counter % 2 !== 0) ?
                    (0, util_1.default)(req, [this.player1.id], 'giveListeners', { color: this.player1.color }) :
                    (0, util_1.default)(req, [this.player2.id], 'giveListeners', { color: this.player2.color });
            }
            return nextBeatPositions;
        };
        this.getBeatPos = (position) => {
            return (0, BeatService_1.getBeatPositions)(this.boardService, position);
        };
        this.getBoard = () => {
            return this.boardService.getBoard();
        };
        this.boardService = new BoardService_1.default();
    }
}
exports.default = checkersController;
//# sourceMappingURL=checkersController.js.map