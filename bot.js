import Player from './player.js'
import checker from "./checker.js";
import {
    gameBoard,
    moveCheckerDiv,
    getBeatPositions,
    calculateSimpleMoveVariants,
    checkMoveVariants,
    removeChecker,
    setCurrentChecker
} from "./game.js"


export default class Bot extends Player {
    makeMove(from, to) {
        this.moveChecker(gameBoard.board[from],gameBoard,from,to);
        moveCheckerDiv(from,gameBoard.allCheckers[to]);
        setCurrentChecker(from);
        let difference = to - from;
        if(Math.abs(difference) > 9) {
            console.log("difference",difference);
            removeChecker(difference);
        }
    }

    getListOfCanBeat() {
        let beatList = [];
        for (let i = 0; i < gameBoard.board.length; i++) {
            if (gameBoard.board[i] !== null && gameBoard.board[i].color === "Black" && getBeatPositions(gameBoard.board[i].position).length > 0) {
                beatList.push(gameBoard.board[i]);
            }
        }
        return beatList;
    }

    getClosestBeatChecker() {
        let beatList = this.getListOfCanBeat();
        let closest = null;
        if (beatList.length > 0) {
            closest = 64;
            for (let i = 0; i < beatList.length; i++) {
                if (beatList[i].position < closest) {
                    closest = beatList[i].position;
                }
            }
        }

        return closest;
    }

    getClosestChecker() {
        let closestPosition = 64;
        for (let i = 0; i < gameBoard.board.length; i++) {
            if (gameBoard.board[i] !== null && gameBoard.board[i].color === "Black" && gameBoard.board[i].position < closestPosition && calculateSimpleMoveVariants(gameBoard.board[i].position).length > 0) {
                closestPosition = gameBoard.board[i].position;
            }
        }
        return closestPosition
    }

    moveClosestChecker() {
        let closest = this.getClosestBeatChecker();
        if (closest != null) {

            this.makeMove(closest,getBeatPositions(closest)[0]);
        } else {
            closest = this.getClosestChecker();
            this.makeMove(closest,calculateSimpleMoveVariants(closest)[0]);
        }
    }
}