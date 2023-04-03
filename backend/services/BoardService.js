"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checker_1 = require("../entity/checker");
class BoardService {
    constructor() {
        this.board = [
            [null, 0, null, 1, null, 2, null, 3],
            [4, null, 5, null, 6, null, 7, null],
            [null, 8, null, 9, null, 10, null, 11],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [12, null, 13, null, 14, null, 15, null],
            [null, 16, null, 17, null, 18, null, 19],
            [20, null, 21, null, 22, null, 23, null]
        ];
        this.init();
    }
    getBoard() {
        return this.board;
    }
    init() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] !== null) {
                    this.board[i][j] = this.board[i][j] <= 11 ? (new checker_1.default("White", {
                        i, j
                    }, this.board[i][j])) : (new checker_1.default("Black", { i, j }, this.board[i][j]));
                }
            }
        }
    }
    checkBorders(i, j) {
        return (i > -1 && i < 8 && j > -1 && j < 8);
    }
    isFreeCell(i, j) {
        return (this.checkBorders(i, j) && this.board[i][j] == null);
    }
    isCellTaken(i, j) {
        return (this.checkBorders(i, j) && this.board[i][j] != null);
    }
}
exports.default = BoardService;
//# sourceMappingURL=BoardService.js.map