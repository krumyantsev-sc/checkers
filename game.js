import Board from './board.js';
import {get, post} from './util.js';
let socket = io.connect('http://localhost:3001',{query: {auth:localStorage.getItem('token')}});
let currentChecker;
let gameBoard = new Board;


let currTeamDiv = document.querySelector(".current-team");
let whiteScore = document.querySelector("#whiteSpan");
let blackScore = document.querySelector("#blackSpan");


 async function getMoveStatusInfo() {
    let res = await get(`http://localhost:3001/checkers/${localStorage.getItem("roomId")}/getMoveStatusInfo`);
    console.log(res);
     whiteScore.textContent = res.firstPlayerScore;
     blackScore.textContent = res.secondPlayerScore;
     currTeamDiv.innerHTML = (res.color === "White") ? "Ходят белые" : "Ходят черные";
}



export async function startMove() {
    await gameBoard.init();
    await getMoveStatusInfo();
}

socket.on("giveListeners", (data) => {
    if (data.color === "White") {
        for (let item of gameBoard.whiteCheckers) {
            item.addEventListener("click", checkPossibilities);
        }
    } else {
        for (let item of gameBoard.blackCheckers) {
            item.addEventListener("click", checkPossibilities);
        }
    }
})

function removeListeners(event) {
        for (let item of gameBoard.whiteCheckers) {
            item.removeEventListener("click", checkPossibilities);
        }
        for (let item of gameBoard.blackCheckers) {
            item.removeEventListener("click", checkPossibilities);
        }
        event.target.removeEventListener("click", moveChecker);
}

export function checkMoveVariants(i,j) {
    let position = {
        i: i,
        j: j
    };
    post(position,`http://localhost:3001/checkers/${localStorage.getItem("roomId")}/getPossiblePositions`)
        .then(response => response.json())
        .then(json => {
            if (json.length > 0) {
               highlightPossibleWays(json);
               addMoveListener(json);
            }
        });
}

function checkPossibilities(event) {
    clearHighlightedCells();
    let checker = event.target.id;
    let checkerId = gameBoard.getBoardIndex(checker);
    console.log(checkerId);
    currentChecker = checkerId;
    checkMoveVariants(checkerId.i,checkerId.j);
}

function clearHighlightedCells() {
    for(let item of gameBoard.allCheckers) {
        for(let i = 0; i < item.length; i++) {
            item[i].classList.remove("highlightedCell");
        }
    }
}

function highlightPossibleWays(ways) {
    for(let item of ways) {
       gameBoard.allCheckers[item.i][item.j].classList.add("highlightedCell");
    }
}

function addMoveListener(ways) {
    let item;
    for (item of ways) {
        gameBoard.allCheckers[item.i][item.j].addEventListener("click", moveChecker);
    }
}

export function moveCheckerDiv(initialCell, targetCellDiv) {
    targetCellDiv.appendChild(gameBoard.allCheckers[initialCell.i][initialCell.j].firstChild);
}

const moveChecker = async (event) => {
    let newIndex = gameBoard.findIndexOfNode(event);
    let res = await post({
        fromI: currentChecker.i,
        fromJ: currentChecker.j,
        toI: newIndex.i,
        toJ: newIndex.j
    }, `http://localhost:3001/checkers/${localStorage.getItem("roomId")}/updateBoard`);
    let beatPos = await res.json();
    console.log(beatPos)
    if (beatPos.length > 0) {
        clearHighlightedCells();
        currentChecker = newIndex;
        checkMoveVariants(newIndex.i, newIndex.j);
        return;
    }
    clearHighlightedCells();
    removeListeners(event);
    await startMove();
}

socket.on('checkerMoved', function(data) {
    if (gameBoard.allCheckers[data.fromI][data.fromJ].firstChild)
        moveCheckerDiv({i:data.fromI,j:data.fromJ}, gameBoard.allCheckers[data.toI][data.toJ]);
})

socket.on('removeChecker', function(data) {
    gameBoard.allCheckers[data.i][data.j].removeChild(gameBoard.allCheckers[data.i][data.j].firstChild);
})

socket.on('makeLady', function(data) {
    gameBoard.allCheckers[data.i][data.j].firstChild.classList.add("lady");
})

socket.on('refreshScore', function(data) {
    whiteScore.textContent = data.firstPlayerScore;
    blackScore.textContent = data.secondPlayerScore;
})

socket.on('switchTeam', function(data) {
    currTeamDiv.innerHTML = (data.color === "White") ? "Ходят белые" : "Ходят черные";
})
startMove().then();

