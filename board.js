import checker from './checker.js'
import {get} from './util.js'

export default class Board {
    whiteCheckers = [];
    blackCheckers = [];
    allCheckers = [];


    async getBoardFromServer() {
       let res = get("http://localhost:3001/checkers/getBoard");
        let serverCheckers = await res;
        this.generateCheckers(serverCheckers)
    }

    generateCheckers(serverCheckers) {
        console.log(serverCheckers);
        this.parseCellDivs();
        for (let i = 0; i < serverCheckers.length; i++) {
            for(let j = 0; j < serverCheckers[i].length; j++) {
                if (serverCheckers[i][j] !== null) {
                    console.log(serverCheckers[i][j]);
                    let newCheckerDiv = document.createElement('div');
                    newCheckerDiv.id = serverCheckers[i][j].id;
                    console.log(serverCheckers[i][j].position)
                    if (serverCheckers[i][j].color === "Black") {
                        newCheckerDiv.className = "black-checker";
                    } else {
                        newCheckerDiv.className = "white-checker";
                    }
                    this.allCheckers[serverCheckers[i][j].position.i][serverCheckers[i][j].position.j].appendChild(newCheckerDiv);
                }
            }
        }
    }

removeCheckers() {
    let cells = document.querySelectorAll("td");
        for (let item of cells) {
            if (item.firstChild !== null) {
                item.removeChild(item.firstChild);
                console.log(item.firstChild);
            }
        }
}
    async init() {
        if (this.allCheckers.length === 0) {
            await this.getBoardFromServer();
            this.whiteCheckers = document.querySelectorAll(".white-checker");
            this.blackCheckers = document.querySelectorAll(".black-checker");
        }

        // for (let i = 0; i < 12; i++) {
        //     this.whiteCheckers.push(new checker("White", i, 1, whiteCheckerSelectors[i]));
        // }

        // for (let i = 12; i < 24; i++) {
        //     this.blackCheckers.push(new checker("Black", i, 2));
        // }
        // for (let i = 0; i < blackCheckerSelectors.length; i++) {
        //     this.blackCheckers[i].div = blackCheckerSelectors[i];
        // }
        // this.createObjectsBoard();
        // this.parseCellDivs();
    }

    // createObjectsBoard() {
    //     let k = 0;
    //     let j = 0;
    //     for (let i = 0; i < this.board.length; i++) {
    //         for(let f = 0; f < this.board[i].length; f++) {
    //             if (this.board[i][f] < 12 && this.board[i][f] != null) {
    //                 this.board[i][f] = this.whiteCheckers[k];
    //                 this.board[i][f].position = {i:i,j:f};
    //                 k++;
    //             } else {
    //                 if (this.board[i][f] >= 12 && this.board[i][f] != null) {
    //                     this.board[i][f] = this.blackCheckers[j];
    //                     this.board[i][f].position = {i:i,j:f};
    //                     j++;
    //                 }
    //             }
    //         }
    //     }
    // }

    getBoardIndex(id) {
        //console.log(this.allCheckers);
        for(let i = 0; i < this.allCheckers.length; i++) {
            for(let j = 0; j < this.allCheckers[i].length; j++) {
                if(this.allCheckers[i][j].firstChild != null && this.allCheckers[i][j].firstChild.id === id) {
                     console.log(this.allCheckers[i][j].firstChild.id);
                      return {i:i,j:j};
                // }
                //if(this.allCheckers[i][j].firstChild != null) {
                //    console.log(this.allCheckers[i][j].firstChild);
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
        let cells = document.querySelectorAll("td");
        let z = 0;
        for (let i = 0; i < 8; i++) {
            this.allCheckers[i] = [];
            for(let j = 0; j < 8; j++) {
                this.allCheckers[i][j] = cells[z];
                z++;
            }
        }
    }


}