import {getBeatPositionForBot, getBeatPositions} from "./BeatService";
import {checkerCoords} from "../types/checkersTypes";
import {IMoveChecker, IMoveVariants} from "./interfaces/IMoveService";
import BoardService from "./BoardService";

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

const getPositionsForBeatHighlighting = (gameBoard: BoardService, color: string) => {
    let highlightedPos = [];
    for (let i = 0; i < gameBoard.board.length; i++) {
        for (let j = 0; j < gameBoard.board[i].length; j++) {
            if (gameBoard.board[i][j] && gameBoard.board[i][j].color === color) {
                let possibleWays = getBeatPositions(gameBoard, {i:i,j:j});
                if (possibleWays.length > 0) {
                    for (let item of possibleWays) {
                        highlightedPos.push({fromI: i, fromJ: j, toI:item.i, toJ: item.j});
                    }
                }
            }
        }
    }
    return highlightedPos;
}

const checkMoveVariants: IMoveVariants = (gameBoard, position) => {
    let possibleWays: checkerCoords[] = getBeatPositions(gameBoard, position);
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
            for (let j = 0; j < gameBoard.board[i].length; j++) {
                if (gameBoard.board[i][j]?.color === "Black") {
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

export {checkMoveVariants, moveChecker, getBotMovePosition, getPositionsForBeatHighlighting};
