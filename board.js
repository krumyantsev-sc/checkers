import checker from './checker.js'

export default class Board {
    whiteCheckers = [];
    blackCheckers = [];
    allCheckers = [];
    board = [
        [null, 0, null, 1, null, 2, null, 3],
        [4, null, 5, null, 6, null, 7, null],
        [null, 8, null, 9, null, 10, null, 11],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [12, null, 13, null, 14, null, 15, null],
        [null, 16, null, 17, null, 18, null, 19],
        [20, null, 21, null, 22, null, 23, null]
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
        this.parseCellDivs();
    }

    createObjectsBoard() {
        let k = 0;
        let j = 0;
        for (let i = 0; i < this.board.length; i++) {
            for(let f = 0; f < this.board[i].length; f++) {
                if (this.board[i][f] < 12 && this.board[i][f] != null) {
                    this.board[i][f] = this.whiteCheckers[k];
                    this.board[i][f].position = {i:i,j:f};
                    k++;
                } else {
                    if (this.board[i][f] >= 12 && this.board[i][f] != null) {
                        this.board[i][f] = this.blackCheckers[j];
                        this.board[i][f].position = {i:i,j:f};
                        j++;
                    }
                }
            }
        }
    }

    getBoardIndex(id) {
        id = +id;
        for(let i = 0; i < this.board.length; i++) {
            for(let j = 0; j < this.board[i].length; j++) {
                if(this.board[i][j] != null && this.board[i][j].divId === id) {
                    return {i:i,j:j};
                }
            }
        }
        return 0;
    }

    findIndexOfNode(event) {
        for (let i = 0; i < this.allCheckers.length; i++) {
            for (let j = 0; j < this.allCheckers[i].length; j++) {
                if (this.allCheckers[i][j] === event.target) {
                    return {i:i,j:j};
                }
            }
        }
    }

    parseCellDivs() {
        let temp = document.querySelectorAll("td");
        let z = 0;
        for (let i = 0; i < 8; i++) {
            this.allCheckers[i] = [];
            for(let j = 0; j < 8; j++) {
                this.allCheckers[i][j] = temp[z];
                z++;
            }
        }
    }


}