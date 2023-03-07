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

    makeLady() {
        if(this.position.i > 6 && this.color === "White") {
            this.isLady = true;
        }
        if(this.position.i < 1 && this.color === "Black") {
            this.isLady = true;
        }
    }

}
module.exports = checker;