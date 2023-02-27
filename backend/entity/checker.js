class checker {
    isLady = false;
    constructor(color,position) {
        this.color = color;
        this.position = position;
    }

    move(gameBoard, to) {
        let from = this.position;
        if(gameBoard.board[to.i][to.j] == null) {
            gameBoard.board[to.i][to.j] = gameBoard.board[from.i][from.j];
            gameBoard.board[to.i][to.j].position = to;
            gameBoard.board[from.i][from.j] = null;
        }
    }
}
module.exports = checker;