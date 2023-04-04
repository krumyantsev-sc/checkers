
import checker from "../entity/checker";
import IBoardService from "./interfaces/IBoardService";
import {checkerCoords} from "../types/checkersTypes";
class BoardService implements IBoardService {
    board: (checker | null)[][] = [
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null]
    ];
    constructor() {
      this.init();
    }
    getBoard(): (checker | null)[][] {
        return this.board;
    }

    init(): void{
        let boardSchema: (number | null)[][] = [
            [null, 0, null, 1, null, 2, null, 3],
            [4, null, 5, null, 6, null, 7, null],
            [null, 8, null, 9, null, 10, null, 11],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [12, null, 13, null, 14, null, 15, null],
            [null, 16, null, 17, null, 18, null, 19],
            [20, null, 21, null, 22, null, 23, null]
        ];
        for (let i = 0; i < boardSchema.length; i++) {
            for (let j = 0; j < boardSchema[i].length; j++) {
                if (boardSchema[i][j] !== null) {
                    this.board[i][j] = boardSchema[i][j] <= 11 ? (new checker("White", {
                        i, j
                    },boardSchema[i][j]!)) : (new checker("Black", {i, j},boardSchema[i][j]!));
                }
            }
        }
    }

    checkBorders(position: checkerCoords): boolean {
        const {i,j} = position;
        return (i > -1 && i < 8 && j > -1 && j < 8);
    }

    isFreeCell(position: checkerCoords): boolean {
        const {i,j} = position;
        return (this.checkBorders(position) && this.board[i][j] == null);
    }
    isCellTaken(position: checkerCoords): boolean {
        const {i,j} = position;
        return (this.checkBorders(position) && this.board[i][j] != null);
    }
}

export default BoardService;