"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveChecker = exports.checkMoveVariants = void 0;
const BeatService_1 = require("./BeatService");
const getSimpleMoveVariants = (boardService, position) => {
    let possibleWays = [];
    const { i, j } = position;
    if (boardService.board[i][j].color === "White" || boardService.board[i][j].isLady) {
        if (boardService.isFreeCell({ i: i + 1, j: j - 1 })) {
            possibleWays.push({ i: i + 1, j: j - 1 });
        }
        if (boardService.isFreeCell({ i: i + 1, j: j + 1 })) {
            possibleWays.push({ i: i + 1, j: j + 1 });
        }
    }
    if (boardService.board[i][j].color === "Black" || boardService.board[i][j].isLady) {
        if (boardService.isFreeCell({ i: i - 1, j: j - 1 })) {
            possibleWays.push({ i: i - 1, j: j - 1 });
        }
        if (boardService.isFreeCell({ i: i - 1, j: j + 1 })) {
            possibleWays.push({ i: i - 1, j: j + 1 });
        }
    }
    return possibleWays;
};
const checkMoveVariants = (gameBoard, position) => {
    let possibleWays = (0, BeatService_1.getBeatPositions)(gameBoard, position);
    if (possibleWays.length === 0) {
        possibleWays = getSimpleMoveVariants(gameBoard, position);
    }
    return possibleWays;
};
exports.checkMoveVariants = checkMoveVariants;
const moveChecker = (boardService, checker, to) => {
    checker.move(boardService, to);
};
exports.moveChecker = moveChecker;
//# sourceMappingURL=MoveService.js.map