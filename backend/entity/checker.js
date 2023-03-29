class checker {
    isLady = false;
    constructor(color,position,id) {
        this.color = color;
        this.position = position;
        this.id = id;
    }

    move(gameBoard, to) {
        let from = this.position;
        if(gameBoard.board[to.i][to.j] == null) {
            gameBoard.board[to.i][to.j] = gameBoard.board[from.i][from.j];
            gameBoard.board[to.i][to.j].position = to;
            gameBoard.board[from.i][from.j] = null;
        }
    }

    canMakeLady() {
        let needToEmit = false;
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
module.exports = checker;