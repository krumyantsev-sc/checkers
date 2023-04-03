function getBeatPositions(gameBoard: any, i: number, j: number) {
    let takenPositions: {i: number, j: number}[] = [];

    if (gameBoard.board[i][j].color === "White" || gameBoard.board[i][j].isLady) {
        if (gameBoard.isCellTaken(i+1,j-1) && gameBoard.board[i][j].color !== gameBoard.board[i+1][j-1].color) {
            if (gameBoard.isFreeCell(i+2,j-2)) {
                takenPositions.push({i: i + 2, j: j - 2});
            }

        }
        if (gameBoard.isCellTaken(i+1,j+1) && gameBoard.board[i][j].color !== gameBoard.board[i+1][j+1].color) {
            if (gameBoard.isFreeCell(i+2,j+2)) {
                takenPositions.push({i: i + 2, j: j + 2});
            }
        }
    }

    if (gameBoard.board[i][j].color === "Black" || gameBoard.board[i][j].isLady) {
        if (gameBoard.isCellTaken(i-1,j-1) && gameBoard.board[i][j].color !== gameBoard.board[i-1][j-1].color) {
            if (gameBoard.isFreeCell(i-2,j-2)) {
                takenPositions.push({i:i-2,j:j-2});
            }
        }
        if (gameBoard.isCellTaken(i-1,j+1) && gameBoard.board[i][j].color !== gameBoard.board[i-1][j+1].color) {
            if (gameBoard.isFreeCell(i-2,j+2)) {
                takenPositions.push({i:i-2,j:j+2});
            }
        }
    }

    return takenPositions;
}

function beat(gameBoard: any, from: {i: number, j: number}, to: {i: number, j: number}) {
    let difference = to.i - from.i;
    let pos = [];
    let removedChecker;

    if (Math.abs(difference) > 1) {
        removedChecker = removeChecker(gameBoard, from, to);
        pos = getBeatPositions(gameBoard, to.i, to.j);
    }

    return [pos,removedChecker];
}

function removeChecker(gameBoard: any, from: {i: number, j: number}, to: {i: number, j: number}) {
    let currentChecker = {i:from.i,j:from.j};
    let removedChecker: {i: number, j: number, color: string};
    let removedColor: string;
    if (to.i - from.i > 0) {
        if (to.j < from.j) {
            removedColor = gameBoard.board[currentChecker.i+1][currentChecker.j-1].color;
            gameBoard.board[currentChecker.i+1][currentChecker.j-1] = null;
            removedChecker = {i:currentChecker.i+1,j:currentChecker.j-1,color: removedColor};
        } else {
            removedColor = gameBoard.board[currentChecker.i+1][currentChecker.j+1].color;
            gameBoard.board[currentChecker.i+1][currentChecker.j+1] = null;
            removedChecker = {i:currentChecker.i+1,j:currentChecker.j+1,color: removedColor};
        }
    } else {
        if (to.j < from.j) {
            removedColor = gameBoard.board[currentChecker.i-1][currentChecker.j-1].color;
            gameBoard.board[currentChecker.i-1][currentChecker.j-1] = null;
            removedChecker = {i:currentChecker.i-1,j:currentChecker.j-1,color: removedColor};
        } else {
            removedColor = gameBoard.board[currentChecker.i-1][currentChecker.j+1].color;
            gameBoard.board[currentChecker.i-1][currentChecker.j+1] = null;
            removedChecker = {i:currentChecker.i-1,j:currentChecker.j+1,color: removedColor};
        }
    }
    return removedChecker;
}

export {getBeatPositions, beat}