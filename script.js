class checker {
    isLady = false;
    constructor(color, divId, position,div) {
        this.color = color;
        this.divId = divId;
        this.position = position;
        this.div = div;
    }
    color;
    position;
    divId;
    div;
    move() {

    }
    beat() {

    }
}

class Player {
    score = 0;
}

class Board {
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
            this.whiteCheckers.push(new checker("white", i, this.getBoardIndex(i), whiteCheckerSelectors[i]));
        }
        let blackCheckerSelectors = document.querySelectorAll(".black-checker");
        for (let i = 12; i < 24; i++) {
            this.blackCheckers.push(new checker("black", i, this.getBoardIndex(i)));
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
                if (this.board[i] > 12 && this.board[i] != null) {
                    this.board[i] = this.whiteCheckers[j];
                    j++;
                }
            }
        }
    }

    getBoardIndex(id) {
        return this.board.indexOf(parseInt(id));
    }


    allCheckers = document.querySelectorAll("td");
}

class lady extends checker {
    moveForward() {

    }

    beatForward() {

    }
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



function checkPossibilities(event) {
    clearHighlightedCells();
    let possibleWays = [];
    let checker = event.target.id;
    let checkerId = gameBoard.getBoardIndex(checker);
    console.log(checkerId);
    currentChecker = checkerId;
    if (gameBoard.board[checkerId + 7] == null && !gameBoard.board[checkerId + 7].classList.contains("cleanCell")) {
        possibleWays.push(checkerId + 7);
    }
    if (gameBoard.board[checkerId + 9] == null && !gameBoard.board[checkerId + 9].classList.contains("cleanCell")) {
        possibleWays.push(checkerId + 9);
    }
    if (gameBoard.board[checkerId - 7] == null && !gameBoard.board[checkerId - 7].classList.contains("cleanCell")) {
        possibleWays.push(checkerId - 7);
    }
    if (gameBoard.board[checkerId - 9] == null && !gameBoard.board[checkerId - 9].classList.contains("cleanCell")) {
        possibleWays.push(checkerId - 9);
    }
    if (possibleWays.length > 0) {
        highlightPossibleWays(possibleWays);
        addMoveListener(checkerId, possibleWays);
    }
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

const moveChecker = (event) => {
    event.target.appendChild(gameBoard.allCheckers[currentChecker].firstChild);
    let newCheckerDiv = event.target.firstChild;
    gameBoard.board[findIndexOfNode(event)] = +newCheckerDiv.id;
    gameBoard.board[currentChecker] = null;
    clearHighlightedCells();
    event.target.removeEventListener("click", moveChecker);
    removeListeners();
    changeTeam();
    startMove();
}
startMove();

