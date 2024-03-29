"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BoardService_1 = require("../services/BoardService");
const MoveService_1 = require("../services/MoveService");
const BeatService_1 = require("../services/BeatService");
const player_1 = require("../entity/player");
const util_1 = require("../util/util");
const gameLogicController_1 = require("./gameLogicController");
class checkersController extends gameLogicController_1.default {
    constructor() {
        super();
        this.counter = 2;
        this.player1 = new player_1.default("White");
        this.player2 = new player_1.default("Black");
        this.withBot = false;
        this.gameFinished = false;
        this.getGameInfo = (req, res) => {
            res.status(201).json({
                firstPlayer: { name: this.player1.name, score: this.player1.score },
                secondPlayer: { name: this.player2.name, score: this.player2.score }, gameId: this.roomId
            });
        };
        this.switchTeam = (req) => {
            let currColor = (this.counter % 2 !== 0) ? "White" : "Black";
            if (!this.checkIfCanMove(currColor)) {
                if (this.player1.score !== 12 && this.player2.score !== 12) {
                    if (this.player1.color === currColor) {
                        this.emitWin(this.player2.id, this.player1.id, req);
                    }
                    else {
                        this.emitWin(this.player1.id, this.player2.id, req);
                    }
                }
            }
            (0, util_1.default)(req, [this.player1.id, this.player2.id], 'switchTeam', { color: currColor });
        };
        this.getMoveStatusInfo = (req) => {
            let currColor = (this.counter % 2 !== 0) ? "White" : "Black";
            if (this.counter % 2 !== 0) {
                console.log((0, MoveService_1.getPositionsForBeatHighlighting)(this.boardService, this.player1.color));
                (0, util_1.default)(req, [this.player1.id], 'giveListeners', {
                    color: this.player1.color,
                    positions: (0, MoveService_1.getPositionsForBeatHighlighting)(this.boardService, this.player1.color)
                });
            }
            else {
                (0, util_1.default)(req, [this.player2.id], 'giveListeners', {
                    color: this.player2.color,
                    positions: (0, MoveService_1.getPositionsForBeatHighlighting)(this.boardService, this.player2.color)
                });
                console.log((0, MoveService_1.getPositionsForBeatHighlighting)(this.boardService, this.player2.color));
                if (this.withBot) {
                    this.getBotMove(req);
                }
            }
            (0, util_1.default)(req, [this.player1.id, this.player2.id], 'switchTeam', { color: currColor });
            return { message: "successfully sent" };
        };
        this.giveListeners = (req) => {
            (this.counter % 2 !== 0) ?
                (0, util_1.default)(req, [this.player1.id], 'giveListeners', {
                    color: this.player1.color,
                    positions: (0, MoveService_1.getPositionsForBeatHighlighting)(this.boardService, this.player1.color)
                }) :
                (0, util_1.default)(req, [this.player2.id], 'giveListeners', {
                    color: this.player2.color,
                    positions: (0, MoveService_1.getPositionsForBeatHighlighting)(this.boardService, this.player2.color)
                });
        };
        this.getPositionsForHighlighting = (req) => {
            this.giveListeners(req);
            return (0, MoveService_1.checkMoveVariants)(this.boardService, req.body);
        };
        this.checkWin = (req) => {
            if (this.player1.score === 12) {
                this.emitWin(this.player1.id, this.player2.id, req);
                this.gameFinished = true;
            }
            if (this.player2.score === 12) {
                this.emitWin(this.player2.id, this.player1.id, req);
                this.gameFinished = true;
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
        this.processOneMove = (req, moveObj) => {
            const { fromI, fromJ, toI, toJ } = moveObj;
            const fromObj = { i: fromI, j: fromJ };
            const toObj = { i: toI, j: toJ };
            (0, MoveService_1.moveChecker)(this.boardService, this.boardService.board[fromI][fromJ], toObj);
            (0, util_1.default)(req, [this.player1.id, this.player2.id], 'checkerMoved', {
                fromI: fromI,
                fromJ: fromJ,
                toI: toI,
                toJ: toJ
            });
            if (this.boardService.board[toI][toJ].canMakeLady()) {
                (0, util_1.default)(req, [this.player1.id, this.player2.id], 'makeLady', toObj);
            }
            let moveResult = (0, BeatService_1.beat)(this.boardService, fromObj, toObj);
            let nextBeatPositions = moveResult[0];
            let removedChecker = moveResult[1];
            if (removedChecker !== undefined) {
                (0, util_1.default)(req, [this.player1.id, this.player2.id], 'stopBeatHighlight', {});
                (0, util_1.default)(req, [this.player1.id, this.player2.id], 'removeChecker', removedChecker);
                this.updateScore(removedChecker, req);
            }
            return nextBeatPositions;
        };
        this.goToNextMove = (req) => {
            if (!this.gameFinished) {
                this.counter++;
                this.switchTeam(req);
                if (this.withBot && this.counter % 2 === 0)
                    this.getBotMove(req);
                this.giveListeners(req);
            }
        };
        this.handleMove = (req, moveObj) => {
            const nextBeatPositions = this.processOneMove(req, moveObj);
            if (nextBeatPositions.length === 0) {
                this.goToNextMove(req);
            }
            else {
                setTimeout(() => {
                    this.handleMove(req, { fromI: moveObj.toI, fromJ: moveObj.toJ, toI: nextBeatPositions[0].i, toJ: nextBeatPositions[0].j });
                }, 2000);
            }
        };
        this.getBotMove = (req) => {
            setTimeout(() => {
                this.handleMove(req, (0, MoveService_1.getBotMovePosition)(this.boardService));
            }, 2000);
        };
        this.moveCheckerOnBoard = (req) => {
            const nextBeatPositions = this.processOneMove(req, req.body);
            if (nextBeatPositions.length === 0) {
                this.goToNextMove(req);
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
    checkIfCanMove(color) {
        var _a;
        for (let i = 0; i < this.boardService.board.length; i++) {
            for (let j = 0; j < this.boardService.board[i].length; j++) {
                if (((_a = this.boardService.board[i][j]) === null || _a === void 0 ? void 0 : _a.color) === color) {
                    if ((0, MoveService_1.checkMoveVariants)(this.boardService, { i: i, j: j }).length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
exports.default = checkersController;
//# sourceMappingURL=checkersController.js.map