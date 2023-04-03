"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveChecker = exports.checkMoveVariants = void 0;
const BeatService_1 = require("./BeatService");
function getSimpleMoveVariants(boardService, i, j) {
    let possibleWays = [];
    if (boardService.board[i][j].color === "White" || boardService.board[i][j].isLady) {
        if (boardService.isFreeCell(i + 1, j - 1)) {
            possibleWays.push({ i: i + 1, j: j - 1 });
        }
        if (boardService.isFreeCell(i + 1, j + 1)) {
            possibleWays.push({ i: i + 1, j: j + 1 });
        }
    }
    if (boardService.board[i][j].color === "Black" || boardService.board[i][j].isLady) {
        if (boardService.isFreeCell(i - 1, j - 1)) {
            possibleWays.push({ i: i - 1, j: j - 1 });
        }
        if (boardService.isFreeCell(i - 1, j + 1)) {
            possibleWays.push({ i: i - 1, j: j + 1 });
        }
    }
    return possibleWays;
}
function checkMoveVariants(gameBoard, i, j) {
    let possibleWays = (0, BeatService_1.getBeatPositions)(gameBoard, i, j);
    if (possibleWays.length === 0) {
        possibleWays = getSimpleMoveVariants(gameBoard, i, j);
    }
    return possibleWays;
}
exports.checkMoveVariants = checkMoveVariants;
function moveChecker(boardService, checker, to) {
    checker.move(boardService, to);
}
exports.moveChecker = moveChecker;
//# sourceMappingURL=MoveService.js.map