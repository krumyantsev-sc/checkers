"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checker_1 = require("../entity/checker");
class BoardService {
    constructor() {
        this.board = [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null]
        ];
        this.init();
    }
    getBoard() {
        return this.board;
    }
    init() {
        let boardSchema = [
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
                    this.board[i][j] = boardSchema[i][j] <= 11 ? (new checker_1.default("White", {
                        i, j
                    }, boardSchema[i][j])) : (new checker_1.default("Black", { i, j }, boardSchema[i][j]));
                }
            }
        }
    }
    checkBorders(position) {
        const { i, j } = position;
        return (i > -1 && i < 8 && j > -1 && j < 8);
    }
    isFreeCell(position) {
        const { i, j } = position;
        return (this.checkBorders(position) && this.board[i][j] == null);
    }
    isCellTaken(position) {
        const { i, j } = position;
        return (this.checkBorders(position) && this.board[i][j] != null);
    }
}
exports.default = BoardService;
//# sourceMappingURL=BoardService.js.map