import {get} from './util.js'

export default class Board {
    whiteCheckers = [];
    blackCheckers = [];
    allCheckers = [];

    async getBoardFromServer() {
       let res = get(`http://localhost:3001/checkers/${localStorage.getItem("roomId")}/getBoard`);
       let serverCheckers = await res;
       this.generateCheckers(serverCheckers)
    }

    generateCheckers(serverCheckers) {
        console.log(serverCheckers);
        this.parseCellDivs();
        for (let i = 0; i < serverCheckers.length; i++) {
            for(let j = 0; j < serverCheckers[i].length; j++) {
                if (serverCheckers[i][j] !== null) {
                    let newCheckerDiv = document.createElement('div');
                    newCheckerDiv.id = serverCheckers[i][j].id;
                    if (serverCheckers[i][j].color === "Black") {
                        newCheckerDiv.className = "black-checker";
                    } else {
                        newCheckerDiv.className = "white-checker";
                    }
                    if (serverCheckers[i][j].isLady === true) {
                        newCheckerDiv.classList.add("lady");
                    }
                    this.allCheckers[serverCheckers[i][j].position.i][serverCheckers[i][j].position.j].appendChild(newCheckerDiv);
                }
            }
        }
    }

    async init() {
        if (this.allCheckers.length === 0) {
            await this.getBoardFromServer();
            this.whiteCheckers = document.querySelectorAll(".white-checker");
            this.blackCheckers = document.querySelectorAll(".black-checker");
        }
    }

    getBoardIndex(id) {
        for(let i = 0; i < this.allCheckers.length; i++) {
            for(let j = 0; j < this.allCheckers[i].length; j++) {
                if(this.allCheckers[i][j].firstChild != null && this.allCheckers[i][j].firstChild.id === id) {
                    console.log(this.allCheckers[i][j].firstChild.id);
                    return {i: i, j: j};
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