"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBeatPositionForBot = exports.beat = exports.getBeatPositions = void 0;
const getBeatPositions = (gameBoard, position) => {
    let takenPositions = [];
    const { i, j } = position;
    if (gameBoard.board[i][j].color === "White" || gameBoard.board[i][j].isLady) {
        if (gameBoard.isCellTaken({
            i: i + 1,
            j: j - 1
        }) && gameBoard.board[i][j].color !== gameBoard.board[i + 1][j - 1].color) {
            if (gameBoard.isFreeCell({ i: i + 2, j: j - 2 })) {
                takenPositions.push({ i: i + 2, j: j - 2 });
            }
        }
        if (gameBoard.isCellTaken({
            i: i + 1,
            j: j + 1
        }) && gameBoard.board[i][j].color !== gameBoard.board[i + 1][j + 1].color) {
            if (gameBoard.isFreeCell({ i: i + 2, j: j + 2 })) {
                takenPositions.push({ i: i + 2, j: j + 2 });
            }
        }
    }
    if (gameBoard.board[i][j].color === "Black" || gameBoard.board[i][j].isLady) {
        if (gameBoard.isCellTaken({
            i: i - 1,
            j: j - 1
        }) && gameBoard.board[i][j].color !== gameBoard.board[i - 1][j - 1].color) {
            if (gameBoard.isFreeCell({ i: i - 2, j: j - 2 })) {
                takenPositions.push({ i: i - 2, j: j - 2 });
            }
        }
        if (gameBoard.isCellTaken({
            i: i - 1,
            j: j + 1
        }) && gameBoard.board[i][j].color !== gameBoard.board[i - 1][j + 1].color) {
            if (gameBoard.isFreeCell({ i: i - 2, j: j + 2 })) {
                takenPositions.push({ i: i - 2, j: j + 2 });
            }
        }
    }
    return takenPositions;
};
exports.getBeatPositions = getBeatPositions;
const getBeatPositionForBot = (gameBoard) => {
    var _a;
    for (let i = 7; i > 0; i--) {
        for (let j = 0; j < gameBoard.board[i].length; j++) {
            if (((_a = gameBoard.board[i][j]) === null || _a === void 0 ? void 0 : _a.color) === "Black") {
                let beatPositions = getBeatPositions(gameBoard, { i: i, j: j });
                if (beatPositions.length > 0) {
                    return { fromI: i, fromJ: j, toI: beatPositions[0].i, toJ: beatPositions[0].j };
                }
            }
        }
    }
    return null;
};
exports.getBeatPositionForBot = getBeatPositionForBot;
const beat = (gameBoard, from, to) => {
    let difference = to.i - from.i;
    let pos = [];
    let removedChecker;
    if (Math.abs(difference) > 1) {
        removedChecker = removeChecker(gameBoard, from, to);
        pos = getBeatPositions(gameBoard, to);
    }
    return [pos, removedChecker];
};
exports.beat = beat;
const removeChecker = (gameBoard, from, to) => {
    let currentChecker = { i: from.i, j: from.j };
    let removedChecker;
    let removedColor;
    if (to.i - from.i > 0) {
        if (to.j < from.j) {
            removedColor = gameBoard.board[currentChecker.i + 1][currentChecker.j - 1].color;
            gameBoard.board[currentChecker.i + 1][currentChecker.j - 1] = null;
            removedChecker = { i: currentChecker.i + 1, j: currentChecker.j - 1, color: removedColor };
        }
        else {
            removedColor = gameBoard.board[currentChecker.i + 1][currentChecker.j + 1].color;
            gameBoard.board[currentChecker.i + 1][currentChecker.j + 1] = null;
            removedChecker = { i: currentChecker.i + 1, j: currentChecker.j + 1, color: removedColor };
        }
    }
    else {
        if (to.j < from.j) {
            removedColor = gameBoard.board[currentChecker.i - 1][currentChecker.j - 1].color;
            gameBoard.board[currentChecker.i - 1][currentChecker.j - 1] = null;
            removedChecker = { i: currentChecker.i - 1, j: currentChecker.j - 1, color: removedColor };
        }
        else {
            removedColor = gameBoard.board[currentChecker.i - 1][currentChecker.j + 1].color;
            gameBoard.board[currentChecker.i - 1][currentChecker.j + 1] = null;
            removedChecker = { i: currentChecker.i - 1, j: currentChecker.j + 1, color: removedColor };
        }
    }
    return removedChecker;
};
//# sourceMappingURL=BeatService.js.map