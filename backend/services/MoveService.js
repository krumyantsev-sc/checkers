"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPositionsForBeatHighlighting = exports.getBotMovePosition = exports.moveChecker = exports.checkMoveVariants = void 0;
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
const getPositionsForBeatHighlighting = (gameBoard, color) => {
    let highlightedPos = [];
    for (let i = 0; i < gameBoard.board.length; i++) {
        for (let j = 0; j < gameBoard.board[i].length; j++) {
            if (gameBoard.board[i][j] && gameBoard.board[i][j].color === color) {
                let possibleWays = (0, BeatService_1.getBeatPositions)(gameBoard, { i: i, j: j });
                if (possibleWays.length > 0) {
                    for (let item of possibleWays) {
                        highlightedPos.push({ fromI: i, fromJ: j, toI: item.i, toJ: item.j });
                    }
                }
            }
        }
    }
    return highlightedPos;
};
exports.getPositionsForBeatHighlighting = getPositionsForBeatHighlighting;
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
    var _a;
    let beatPosition = (0, BeatService_1.getBeatPositionForBot)(gameBoard);
    if (beatPosition === null) {
        for (let i = 0; i < gameBoard.board.length; i++) {
            for (let j = 0; j < gameBoard.board[i].length; j++) {
                if (((_a = gameBoard.board[i][j]) === null || _a === void 0 ? void 0 : _a.color) === "Black") {
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