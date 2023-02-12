import checker from './checker.js'

export default class Board {
    whiteCheckers = [];
    blackCheckers = [];
    board = [
        null, 0, null, 1, null, 2, null, 3,
        4, null, 5, null, 6, null, 7, null,
        null, 8, null, 9, null, 10, null, 11,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        12, null, 13, null, 14, null, 15, null,
        null, 16, null, 17, null, 18, null, 19,
        20, null, 21, null, 22, null, 23, null
    ];

    init() {
        let whiteCheckerSelectors = document.querySelectorAll(".white-checker");
        for (let i = 0; i < 12; i++) {
            this.whiteCheckers.push(new checker("White", i, this.board.indexOf(i), whiteCheckerSelectors[i]));
        }
        let blackCheckerSelectors = document.querySelectorAll(".black-checker");
        for (let i = 12; i < 24; i++) {
            this.blackCheckers.push(new checker("Black", i, this.board.indexOf(i)));
        }
        for (let i = 0; i < blackCheckerSelectors.length; i++) {
            this.blackCheckers[i].div = blackCheckerSelectors[i];
        }
        this.createObjectsBoard();
    }

    createObjectsBoard() {
        let k = 0;
        let j = 0;
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] < 12 && this.board[i] != null) {
                this.board[i] = this.whiteCheckers[k];
                k++;
            } else {
                if (this.board[i] >= 12 && this.board[i] != null) {
                    this.board[i] = this.blackCheckers[j];
                    j++;
                }
            }
        }
    }

    getBoardIndex(id) {
        id = +id;
        for(let i = 0; i < this.board.length; i++) {
            if(this.board[i] != null && this.board[i].divId === id) {
                return this.board[i].position;
            }
        }
        return 0;
    }
    allCheckers = document.querySelectorAll("td");
}