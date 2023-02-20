import {removeChecker, getBeatPositions} from "./game.js";

export default class checker {
    isLady = false;
    constructor(color, divId, position,div) {
        this.color = color;
        this.divId = divId;
        this.position = position;
        this.div = div;
    }

    move(gameBoard, from, to) {

        if(gameBoard.board[to.i][to.j] == null) {
            gameBoard.board[to.i][to.j] = gameBoard.board[from.i][from.j];
            gameBoard.board[to.i][to.j].position = to;
            gameBoard.board[from.i][from.j] = null;
        }
    }

    static beat(from, to) {
        let difference = to - from;
        let pos = [];
        if (Math.abs(difference) > 9) {
            removeChecker(difference);
            pos = getBeatPositions(to);
        }
        return pos;
    }

    static canBeatOneMore(pos) {
        return pos.length > 0;
    }

    makeLady() {
        this.isLady = true;
        this.div.classList.add("lady");
    }

    checkLady() {
        if (this.color === "Black" && this.position.i < 1) {
            this.makeLady();
        }
        if (this.color === "White" && this.position.j > 6) {
            this.makeLady();
        }
    }

}