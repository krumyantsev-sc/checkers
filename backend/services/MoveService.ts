import {getBeatPositions} from "./BeatService";
import checker from "../entity/checker";
import boardService from "./BoardService";
import BoardService from "./BoardService";
import {checkerCoords} from "../types/checkersTypes";
import {IMoveChecker, IMoveVariants} from "./interfaces/IMoveService";

const getSimpleMoveVariants: IMoveVariants = (boardService, position) => {
    let possibleWays: checkerCoords[] = [];
    const {i,j} = position;
    if (boardService.board[i][j].color === "White" || boardService.board[i][j].isLady) {
        if (boardService.isFreeCell({i: i+1, j: j-1})) {
            possibleWays.push({i:i+1,j:j-1});
        }
        if (boardService.isFreeCell({i: i+1, j: j+1})) {
            possibleWays.push({i: i+1, j: j+1});
        }
    }
    if (boardService.board[i][j].color === "Black" || boardService.board[i][j].isLady) {
        if (boardService.isFreeCell({i: i-1, j: j-1})) {
            possibleWays.push({i: i-1, j: j-1});
        }
        if (boardService.isFreeCell({i: i-1, j: j+1})) {
            possibleWays.push({i: i-1, j: j+1});
        }
    }
    return possibleWays;
}

const checkMoveVariants: IMoveVariants = (gameBoard, position) => {
    let possibleWays: {i: number, j: number}[] = getBeatPositions(gameBoard,position);
    if (possibleWays.length === 0) {
        possibleWays = getSimpleMoveVariants(gameBoard,position);
    }
    return possibleWays;
}

const moveChecker: IMoveChecker = (boardService, checker, to) => {
    checker.move(boardService,to);
}

export {checkMoveVariants, moveChecker};
