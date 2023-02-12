import Board from './board.js';
import checker from './checker.js';

class Player {
    score = 0;
}

let currentChecker;
let counter = 1;
let gameBoard = new Board;
gameBoard.init();
let currTeamDiv = document.querySelector(".current-team");


function changeTeam() {
    counter++;
    currTeamDiv.innerHTML = (counter % 2 === 0) ? "Ходят черные" : "Ходят белые";
}

function startMove() {
    giveListeners();
}

function giveListeners() {
    if (counter % 2 !== 0) {
        for (let item of gameBoard.whiteCheckers) {
            item.div.addEventListener("click", checkPossibilities);
        }
    } else {
        for (let item of gameBoard.blackCheckers) {
            item.div.addEventListener("click", checkPossibilities);
        }
    }
}

function removeListeners() {
        for (let item of gameBoard.whiteCheckers) {
            item.div.removeEventListener("click", checkPossibilities);
        }
        for (let item of gameBoard.blackCheckers) {
            item.div.removeEventListener("click", checkPossibilities);
        }
}


function getBeatPositions(checkerId) {
    let takenPositions = [];
    if (gameBoard.board[checkerId].color == "White" || gameBoard.board[checkerId].isLady) {
    if (gameBoard.allCheckers[checkerId + 7] != undefined && gameBoard.board[checkerId + 7] != null && !gameBoard.allCheckers[checkerId + 7].classList.contains("cleanCell") && gameBoard.board[checkerId].color !== gameBoard.board[checkerId+7].color) {
        if (gameBoard.allCheckers[checkerId + 14] != undefined && gameBoard.board[checkerId + 14] == null && !gameBoard.allCheckers[checkerId + 14].classList.contains("cleanCell")) {
            takenPositions.push(checkerId + 14);
        }
        
    }
    if (gameBoard.allCheckers[checkerId + 9] != undefined && gameBoard.board[checkerId + 9] != null && !gameBoard.allCheckers[checkerId + 9].classList.contains("cleanCell") && gameBoard.board[checkerId].color !== gameBoard.board[checkerId+9].color) {
        if (gameBoard.allCheckers[checkerId + 18] != undefined && gameBoard.board[checkerId + 18] == null && !gameBoard.allCheckers[checkerId + 18].classList.contains("cleanCell")) {
            takenPositions.push(checkerId + 18);
        }
        
    }
}
if (gameBoard.board[checkerId].color == "Black" || gameBoard.board[checkerId].isLady) {
    if (gameBoard.allCheckers[checkerId - 7] != undefined && gameBoard.board[checkerId - 7] != null && !gameBoard.allCheckers[checkerId - 7].classList.contains("cleanCell") && gameBoard.board[checkerId].color !== gameBoard.board[checkerId-7].color) {
        if (gameBoard.allCheckers[checkerId - 14] != undefined && gameBoard.board[checkerId - 14] == null && !gameBoard.allCheckers[checkerId - 14].classList.contains("cleanCell")) {
            takenPositions.push(checkerId - 14);
        }
        
    }
    if (gameBoard.allCheckers[checkerId - 9] != undefined && gameBoard.board[checkerId - 9] != null && !gameBoard.allCheckers[checkerId - 9].classList.contains("cleanCell") && gameBoard.board[checkerId].color !== gameBoard.board[checkerId-9].color) {
        if (gameBoard.allCheckers[checkerId - 18] != undefined && gameBoard.board[checkerId - 18] == null && !gameBoard.allCheckers[checkerId - 18].classList.contains("cleanCell")) {
            takenPositions.push(checkerId - 18);
        }
        
    }
}
    return takenPositions;
}

function checkMoveVariants(checkerId) {
    let possibleWays = getBeatPositions(checkerId);
    if (possibleWays.length === 0) {
        if (gameBoard.board[checkerId].color == "White" || gameBoard.board[checkerId].isLady) {
    if (gameBoard.board[checkerId + 7] == null && !gameBoard.allCheckers[checkerId + 7].classList.contains("cleanCell")) {
        possibleWays.push(checkerId + 7);
    }
    if (gameBoard.board[checkerId + 9] == null && !gameBoard.allCheckers[checkerId + 9].classList.contains("cleanCell")) {
        possibleWays.push(checkerId + 9);
    }
}
if (gameBoard.board[checkerId].color == "Black" || gameBoard.board[checkerId].isLady) {
    if (gameBoard.board[checkerId - 7] == null && !gameBoard.allCheckers[checkerId - 7].classList.contains("cleanCell")) {
        possibleWays.push(checkerId - 7);
    }
    if (gameBoard.board[checkerId - 9] == null && !gameBoard.allCheckers[checkerId - 9].classList.contains("cleanCell")) {
        possibleWays.push(checkerId - 9);
    }
}
}
    if (possibleWays.length > 0) {
        highlightPossibleWays(possibleWays);
        addMoveListener(checkerId, possibleWays);
    }
}

function checkPossibilities(event) {
    clearHighlightedCells();
    let checker = event.target.id;
    console.log(gameBoard.board);
    let checkerId = gameBoard.getBoardIndex(checker);
    console.log(checkerId);
    currentChecker = checkerId;
    checkMoveVariants(checkerId);
}

function clearHighlightedCells() {
    for(let item of gameBoard.allCheckers) {
        item.classList.remove("highlightedCell");
    }
}

function highlightPossibleWays(ways) {
    for(let item of ways) {
       gameBoard.allCheckers[item].classList.add("highlightedCell");
    }
}

function addMoveListener(id, ways) {
    let item;
    for (item of ways) {
        gameBoard.allCheckers[item].addEventListener("click", moveChecker);
    }
}

function findIndexOfNode(event) {
    for (let i = 0; i < gameBoard.allCheckers.length; i++) {
        if (gameBoard.allCheckers[i] === event.target) {
            return i;
        }
    }
}

function removeChecker(difference) {
    if (difference % 7 === 0) {
        if (difference > 0) {
            gameBoard.board[currentChecker + 7] = null;
            gameBoard.allCheckers[currentChecker + 7].removeChild(gameBoard.allCheckers[currentChecker + 7].firstChild);
        } else {
            gameBoard.board[currentChecker - 7] = null;
            gameBoard.allCheckers[currentChecker - 7].removeChild(gameBoard.allCheckers[currentChecker - 7].firstChild);
        }
    } else {
        if (difference > 0) {
            gameBoard.board[currentChecker + 9] = null;
            gameBoard.allCheckers[currentChecker + 9].removeChild(gameBoard.allCheckers[currentChecker + 9].firstChild);
        } else {
            gameBoard.board[currentChecker - 9] = null;
            gameBoard.allCheckers[currentChecker - 9].removeChild(gameBoard.allCheckers[currentChecker - 9].firstChild);
        }
    }

}

function makeLady(position) {
    if (gameBoard.board[position].color === "Black" && position < 8) {
        gameBoard.board[position].isLady = true;
        gameBoard.board[position].div.classList.add("lady");
    }
    if (gameBoard.board[position].color === "White" && position > 55) {
        gameBoard.board[position].isLady = true;
        gameBoard.board[position].div.classList.add("lady");
    }
}

const moveChecker = (event) => {
    event.target.appendChild(gameBoard.allCheckers[currentChecker].firstChild);
    let newIndex = findIndexOfNode(event);
    gameBoard.board[newIndex] = gameBoard.board[currentChecker];
    gameBoard.board[newIndex].position = newIndex;
    let difference = newIndex - currentChecker;
    makeLady(newIndex);
    let pos = [];
    if (Math.abs(difference) > 9) {
        removeChecker(difference);
        pos = getBeatPositions(newIndex);
    }
    gameBoard.board[currentChecker] = null;
    if(pos.length > 0) {
        clearHighlightedCells();
        currentChecker = newIndex;
        checkMoveVariants(newIndex);
        return;
    }
    
    clearHighlightedCells();
    event.target.removeEventListener("click", moveChecker);
    removeListeners();
    changeTeam();
    startMove();
}
startMove();

