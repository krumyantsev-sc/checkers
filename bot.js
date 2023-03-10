import Player from './player.js'
import checker from "./checker.js";
import {
    gameBoard,
    moveCheckerDiv,

    setCurrentChecker,
    goToNextMove,
    checkWin,
    refreshScore,
    changeTeam,
    incCounter, removeChecker, startMove
} from "./game.js"


export default class Bot extends Player {
    makeMove(from, to) {
        let pos = [];
        setCurrentChecker(from);
        this.moveChecker(gameBoard.board[from.i][from.j],gameBoard,from,to);
        gameBoard.board[to.i][to.j].checkLady();
        moveCheckerDiv(from,gameBoard.allCheckers[to.i][to.j]);
        pos = checker.beat(from, to);
        if(checker.canBeatOneMore(pos)) {
            this.makeMove(to, pos[0]);
            return;
        }
        refreshScore();
        changeTeam();
        checkWin();
        startMove();

    }

    getListOfCanBeat() {
        let beatList = [];
        for (let i = 0; i < gameBoard.board.length; i++) {
            for (let j = 0; j < gameBoard.board[i].length; j++) {
                if (gameBoard.board[i][j] !== null && gameBoard.board[i][j].color === "Black" && getBeatPositions(i,j).length > 0) {
                    beatList.push(gameBoard.board[i][j]);
                }
            }
        }
        return beatList;
    }

    getClosestBeatChecker() {
        let beatList = this.getListOfCanBeat();
        let closest = null;
        if (beatList.length > 0) {
            closest = 8;
            for (let i = 0; i < beatList.length; i++) {
                if (beatList[i].position.i < closest) {
                    closest = beatList[i].position;
                }
            }
        }

        return closest;
    }

    getClosestChecker() {
        let closestPosition = {i:8,j:0};
        for (let i = 0; i < gameBoard.board.length; i++) {
            for(let j = 0; j < gameBoard.board[i].length; j++) {
                if ((gameBoard.board[i][j] !== null) && (gameBoard.board[i][j].color === "Black") && (gameBoard.board[i][j].position.i < closestPosition.i) && (calculateSimpleMoveVariants(i,j).length > 0)) {
                        closestPosition = gameBoard.board[i][j].position;
                }
            }
        }
        return closestPosition
    }

    moveClosestChecker() {
        let closest = this.getClosestBeatChecker();
        if (closest != null) {
            console.log("vvvvv", gameBoard.board[closest.i][closest.j], closest);
            this.makeMove(closest,getBeatPositions(closest.i,closest.j)[0]);
        } else {
            closest = this.getClosestChecker();
            this.makeMove(closest,calculateSimpleMoveVariants(closest.i,closest.j)[0]);
        }
    }
}