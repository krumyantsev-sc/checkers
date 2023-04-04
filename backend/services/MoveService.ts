import {getBeatPositions} from "./BeatService";
import checker from "../entity/checker";
import boardService from "./BoardService";
import BoardService from "./BoardService";

function getSimpleMoveVariants(boardService: any, i: number, j: number): {i: number, j: number}[] {
    let possibleWays: {i: number, j: number}[] = [];
    if (boardService.board[i][j].color === "White" || boardService.board[i][j].isLady) {
        if (boardService.isFreeCell(i+1,j-1)) {
            possibleWays.push({i:i+1,j:j-1});
        }
        if (boardService.isFreeCell(i+1,j+1)) {
            possibleWays.push({i:i+1,j:j+1});
        }
    }
    if (boardService.board[i][j].color === "Black" || boardService.board[i][j].isLady) {
        if (boardService.isFreeCell(i-1,j-1)) {
            possibleWays.push({i:i-1,j:j-1});
        }
        if (boardService.isFreeCell(i-1,j+1)) {
            possibleWays.push({i:i-1,j:j+1});
        }
    }
    return possibleWays;
}

function checkMoveVariants(gameBoard: any, i: number, j: number): {i: number, j: number}[] {
    let possibleWays: {i: number, j: number}[] = getBeatPositions(gameBoard,i,j);
    if (possibleWays.length === 0) {
        possibleWays = getSimpleMoveVariants(gameBoard,i,j);
    }
    return possibleWays;
}

function moveChecker(boardService: BoardService, checker: checker | null, to: { i: number; j: number }): void {
    checker.move(boardService,to);
}

export {checkMoveVariants, moveChecker};
