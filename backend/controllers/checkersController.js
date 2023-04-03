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
const emitToPlayers = require("../util/util");
class checkersController {
    constructor() {
        this.counter = 1;
        this.player1 = new player_1.default("White");
        this.player2 = new player_1.default("Black");
        this.initializeGame = (roomId) => __awaiter(this, void 0, void 0, function* () {
            this.roomId = roomId;
            const room = yield Room_1.default.findById(this.roomId);
            this.player1.id = room === null || room === void 0 ? void 0 : room.firstPlayerId;
            this.player2.id = room === null || room === void 0 ? void 0 : room.secondPlayerId;
        });
        this.switchTeam = (req) => {
            let currColor = (this.counter % 2 !== 0) ? "White" : "Black";
            emitToPlayers(req, [this.player1.id, this.player2.id], 'switchTeam', { color: currColor });
        };
        this.getMoveStatusInfo = (req) => {
            let currColor = (this.counter % 2 !== 0) ? "White" : "Black";
            (this.counter % 2 !== 0) ?
                emitToPlayers(req, [this.player1.id], 'giveListeners', { color: this.player1.color }) :
                emitToPlayers(req, [this.player2.id], 'giveListeners', { color: this.player2.color });
            return { firstPlayerScore: this.player1.score, secondPlayerScore: this.player2.score, color: currColor };
        };
        this.getPositionsForHighlighting = (i, j) => {
            return (0, MoveService_1.checkMoveVariants)(this.boardService, i, j);
        };
        this.checkWin = (req) => {
            if (this.player1.score === 12) {
                emitToPlayers(req, [this.player1.id, this.player2.id], 'gameFinished', { message: "Победа белых" });
            }
            if (this.player2.score === 12) {
                emitToPlayers(req, [this.player1.id, this.player2.id], 'gameFinished', { message: "Победа черных" });
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
            emitToPlayers(req, [this.player1.id, this.player2.id], 'refreshScore', { firstPlayerScore: this.player1.score, secondPlayerScore: this.player2.score });
        };
        this.moveCheckerOnBoard = (req, fromI, fromJ, toI, toJ) => {
            (0, MoveService_1.moveChecker)(this.boardService, this.boardService.board[fromI][fromJ], { i: toI, j: toJ });
            emitToPlayers(req, [this.player1.id, this.player2.id], 'checkerMoved', req.body);
            if (this.boardService.board[toI][toJ].canMakeLady()) {
                emitToPlayers(req, [this.player1.id, this.player2.id], 'makeLady', { i: toI, j: toJ });
            }
            let moveResult = (0, BeatService_1.beat)(this.boardService, { i: fromI, j: fromJ }, { i: toI, j: toJ });
            let nextBeatPositions = moveResult[0];
            let removedChecker = moveResult[1];
            if (removedChecker !== undefined) {
                emitToPlayers(req, [this.player1.id, this.player2.id], 'removeChecker', removedChecker);
                this.updateScore(removedChecker, req);
            }
            if (nextBeatPositions.length === 0) {
                this.counter++;
                this.switchTeam(req);
                (this.counter % 2 !== 0) ?
                    emitToPlayers(req, [this.player1.id], 'giveListeners', { color: this.player1.color }) :
                    emitToPlayers(req, [this.player2.id], 'giveListeners', { color: this.player2.color });
            }
            return nextBeatPositions;
        };
        this.getBeatPos = (position) => {
            return (0, BeatService_1.getBeatPositions)(this.boardService, position.i, position.j);
        };
        this.getBoard = () => {
            return this.boardService.getBoard();
        };
        this.boardService = new BoardService_1.default();
    }
}
exports.default = checkersController;
//# sourceMappingURL=checkersController.js.map