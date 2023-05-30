import {IBeat, IGetBeatPositions} from "./interfaces/IBeatService";
import {checkerCoords, checkerCoordsWithColor} from "../types/checkersTypes";
import {IRemoveChecker} from "./interfaces/IBeatService";

const getBeatPositions: IGetBeatPositions = (gameBoard, position) => {
    let takenPositions: checkerCoords[] = [];
    const {i, j} = position;
    if (gameBoard.board[i][j].color === "White" || gameBoard.board[i][j].isLady) {
        if (gameBoard.isCellTaken({
            i: i + 1,
            j: j - 1
        }) && gameBoard.board[i][j].color !== gameBoard.board[i + 1][j - 1].color) {
            if (gameBoard.isFreeCell({i: i + 2, j: j - 2})) {
                takenPositions.push({i: i + 2, j: j - 2});
            }
        }
        if (gameBoard.isCellTaken({
            i: i + 1,
            j: j + 1
        }) && gameBoard.board[i][j].color !== gameBoard.board[i + 1][j + 1].color) {
            if (gameBoard.isFreeCell({i: i + 2, j: j + 2})) {
                takenPositions.push({i: i + 2, j: j + 2});
            }
        }
    }

    if (gameBoard.board[i][j].color === "Black" || gameBoard.board[i][j].isLady) {
        if (gameBoard.isCellTaken({
            i: i - 1,
            j: j - 1
        }) && gameBoard.board[i][j].color !== gameBoard.board[i - 1][j - 1].color) {
            if (gameBoard.isFreeCell({i: i - 2, j: j - 2})) {
                takenPositions.push({i: i - 2, j: j - 2});
            }
        }
        if (gameBoard.isCellTaken({
            i: i - 1,
            j: j + 1
        }) && gameBoard.board[i][j].color !== gameBoard.board[i - 1][j + 1].color) {
            if (gameBoard.isFreeCell({i: i - 2, j: j + 2})) {
                takenPositions.push({i: i - 2, j: j + 2});
            }
        }
    }
    return takenPositions;
}

const getBeatPositionForBot = (gameBoard) => {
    for (let i = 7; i > 0; i--) {
        for (let j = 0; j < gameBoard.board[i].length; j++) {
            if (gameBoard.board[i][j]?.color === "Black") {
                let beatPositions = getBeatPositions(gameBoard, {i: i, j: j});
                if (beatPositions.length > 0) {
                    return {fromI: i, fromJ: j, toI: beatPositions[0].i, toJ: beatPositions[0].j};
                }
            }
        }
    }
    return null;
}

const beat: IBeat = (gameBoard, from, to) => {
    let difference = to.i - from.i;
    let pos = [];
    let removedChecker;
    if (Math.abs(difference) > 1) {
        removedChecker = removeChecker(gameBoard, from, to);
        pos = getBeatPositions(gameBoard, to);
    }
    return [pos, removedChecker];
}

const removeChecker: IRemoveChecker = (gameBoard, from, to) => {
    let currentChecker: checkerCoords = {i: from.i, j: from.j};
    let removedChecker: checkerCoordsWithColor;
    let removedColor: string;
    if (to.i - from.i > 0) {
        if (to.j < from.j) {
            removedColor = gameBoard.board[currentChecker.i + 1][currentChecker.j - 1].color;
            gameBoard.board[currentChecker.i + 1][currentChecker.j - 1] = null;
            removedChecker = {i: currentChecker.i + 1, j: currentChecker.j - 1, color: removedColor};
        } else {
            removedColor = gameBoard.board[currentChecker.i + 1][currentChecker.j + 1].color;
            gameBoard.board[currentChecker.i + 1][currentChecker.j + 1] = null;
            removedChecker = {i: currentChecker.i + 1, j: currentChecker.j + 1, color: removedColor};
        }
    } else {
        if (to.j < from.j) {
            removedColor = gameBoard.board[currentChecker.i - 1][currentChecker.j - 1].color;
            gameBoard.board[currentChecker.i - 1][currentChecker.j - 1] = null;
            removedChecker = {i: currentChecker.i - 1, j: currentChecker.j - 1, color: removedColor};
        } else {
            removedColor = gameBoard.board[currentChecker.i - 1][currentChecker.j + 1].color;
            gameBoard.board[currentChecker.i - 1][currentChecker.j + 1] = null;
            removedChecker = {i: currentChecker.i - 1, j: currentChecker.j + 1, color: removedColor};
        }
    }
    return removedChecker;
}

export {getBeatPositions, beat, getBeatPositionForBot}