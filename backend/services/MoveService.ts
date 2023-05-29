import {getBeatPositionForBot, getBeatPositions} from "./BeatService";
import {checkerCoords} from "../types/checkersTypes";
import {IMoveChecker, IMoveVariants} from "./interfaces/IMoveService";

const getSimpleMoveVariants: IMoveVariants = (boardService, position) => {
    let possibleWays: checkerCoords[] = [];
    const {i, j} = position;
    if (boardService.board[i][j].color === "White" || boardService.board[i][j].isLady) {
        if (boardService.isFreeCell({i: i + 1, j: j - 1})) {
            possibleWays.push({i: i + 1, j: j - 1});
        }
        if (boardService.isFreeCell({i: i + 1, j: j + 1})) {
            possibleWays.push({i: i + 1, j: j + 1});
        }
    }
    if (boardService.board[i][j].color === "Black" || boardService.board[i][j].isLady) {
        if (boardService.isFreeCell({i: i - 1, j: j - 1})) {
            possibleWays.push({i: i - 1, j: j - 1});
        }
        if (boardService.isFreeCell({i: i - 1, j: j + 1})) {
            possibleWays.push({i: i - 1, j: j + 1});
        }
    }
    return possibleWays;
}

const checkMoveVariants: IMoveVariants = (gameBoard, position) => {
    let possibleWays: { i: number, j: number }[] = getBeatPositions(gameBoard, position);
    if (possibleWays.length === 0) {
        possibleWays = getSimpleMoveVariants(gameBoard, position);
    }
    return possibleWays;
}

const moveChecker: IMoveChecker = (boardService, checker, to) => {
    checker.move(boardService, to);
}

const getBotMovePosition = (gameBoard) => {
    let beatPosition = getBeatPositionForBot(gameBoard);
    if (beatPosition === null) {
        for (let i = 0; i < gameBoard.board.length; i++) {
            for (let j = 0; j < gameBoard.board[i].length; i++) {
                if (gameBoard.board[i][j].color === "White") {
                    let movePositions = getSimpleMoveVariants(gameBoard, {i: i, j: j});
                    if (movePositions.length > 0) {
                        return {fromI: i, fromJ: j, toI: movePositions[0].i, toJ: movePositions[0].j};
                    }
                }
            }
        }
    }
    return beatPosition;
}

export {checkMoveVariants, moveChecker, getBotMovePosition};
