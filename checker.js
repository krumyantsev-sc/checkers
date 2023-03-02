import {removeChecker, } from "./game.js";
import {post} from "./util.js"

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

    static async beat(from, to) {
        let difference = to.i - from.i;
        let pos = [];

        if (Math.abs(difference) > 1) {
           removeChecker(from,to);
           let response = await post({i:to.i,j:to.j},"http://localhost:3001/checkers/getBeatPositions");
           let beatPos = await response.json();
           if (beatPos.length > 0) {
               pos.push(beatPos[0]);
           }
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
        if (this.color === "White" && this.position.i > 6) {
            this.makeLady();
        }
    }

}