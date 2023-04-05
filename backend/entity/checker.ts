import BoardService from "../services/BoardService";
import {checkerCoords} from "../types/checkersTypes";
import IChecker from "./interfaces/IChecker";
class checker implements IChecker{
    color: string;
    position: checkerCoords;
    id: number;
    isLady: boolean = false;

    constructor(color: string, position: checkerCoords, id: number) {
        this.color = color;
        this.position = position;
        this.id = id;
    }

    move = (gameBoard: BoardService, to: checkerCoords): void => {
        let from = this.position;
        if(gameBoard.board[to.i][to.j] == null) {
            gameBoard.board[to.i][to.j] = gameBoard.board[from.i][from.j];
            gameBoard.board[to.i][to.j].position = to;
            gameBoard.board[from.i][from.j] = null;
        }
    }

    canMakeLady = (): boolean => {
        let needToEmit: boolean = false;
        if(this.isLady === false && this.position.i > 6 && this.color === "White") {
            this.isLady = true;
            needToEmit = true;
        }

        if(this.isLady === false && this.position.i < 1 && this.color === "Black") {
            this.isLady = true;
            needToEmit = true;
        }
        return needToEmit;
    }
}

export default checker;