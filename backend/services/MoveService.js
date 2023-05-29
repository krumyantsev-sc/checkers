"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBotMovePosition = exports.moveChecker = exports.checkMoveVariants = void 0;
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
const getBotMovePosition = (gameBoard) => {
    let beatPosition = (0, BeatService_1.getBeatPositionForBot)(gameBoard);
    if (beatPosition === null) {
        for (let i = 0; i < gameBoard.board.length; i++) {
            for (let j = 0; j < gameBoard.board[i].length; i++) {
                if (gameBoard.board[i][j].color === "White") {
                    let movePositions = getSimpleMoveVariants(gameBoard, { i: i, j: j });
                    if (movePositions.length > 0) {
                        return { fromI: i, fromJ: j, toI: movePositions[0].i, toJ: movePositions[0].j };
                    }
                }
            }
        }
    }
    return beatPosition;
};
exports.getBotMovePosition = getBotMovePosition;
//# sourceMappingURL=MoveService.js.map