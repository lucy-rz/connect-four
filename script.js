/*----- constants -----*/
const COLOR_LOOKUP = {
    "1": "purple",
    "-1": "orange",
    "null": "white"
};

/*----- state variables -----*/
let board;
let winner;
let turn;

/*----- cached elements  -----*/
const messageEl = document.querySelector("h1");
const playAgainBtn = document.querySelector("button");
const markerEls = Array.from(document.querySelectorAll("#markers > div"));
//const markerEls = [...document.querySelectorAll("#markers > div")];

/*----- event listeners -----*/
playAgainBtn.addEventListener("click", init); 
document.getElementById("markers").addEventListener("click", handleDrop);
/*----- functions -----*/

init();

function init() {
    board = [
        [null, null, null, null, null, null], //col0
        [null, null, null, null, null, null], //col1
        [null, null, null, null, null, null], //col2 
        [null, null, null, null, null, null], //col3
        [null, null, null, null, null, null], //col4
        [null, null, null, null, null, null], //col5
        [null, null, null, null, null, null], //col6
    ];

    winner = null; // null represents no winner no tie; game in progress
    turn = 1; // purple or player 1, will be the first player to go

    render(); // transfer the initial state to the DOM
}

function handleDrop(evt) {
    //find the column index that each clicked marker pertains to
    //we have a list of marker elements in anodelist named markerEls
    // each of those marker lements contains a indez position
    // we can use those position values to determine which column array
    const colIdx = markerEls.indexOf(evt.target);
    if(colIdx === -1) return;
    const colArr = board[colIdx];
    const rowIdx = colArr.indexOf(null);
    colArr[rowIdx] = turn;
    //check if winning move
    winner = checkWinner(colIdx, rowIdx)
    turn *= -1; // toggle to other players
    render();
}

function checkWinner(colIdx, rowIdx) {
    // check four in a row vertical
    return checkVerticalWin(colIdx, rowIdx) ||
    checkNeSwWin(colIdx, rowIdx) ||
    checkNwSeWin(colIdx, rowIdx) ||
    checkHorizontalWin(colIdx, rowIdx)
    // check four in a row horizontal
    // check four in a row diagonal NE SW (up to the right - down to the left)
    // check four in a row diagonal NW SE (up to the left - down to the right)
}

function checkNwSeWin(colIdx, rowIdx){
    //1) check NW
    const adjCountNW = checkAdjacent(colIdx, rowIdx, -1, 1);
    //2) check SE
    const adjCountSE = checkAdjacent(colIdx, rowIdx, 1, -1);
    //3) add count from NW + SE and if value >=3, win
    return adjCountNW + adjCountSE >= 3 ? board[colIdx][rowIdx] : null;
}
function checkNeSwWin(colIdx, rowIdx){
    //1) check NE
    const adjCountNE = checkAdjacent(colIdx, rowIdx, 1, 1);
    //2) check SW
    const adjCountSW = checkAdjacent(colIdx, rowIdx, -1, -1);
    //3) add count from NE + SW and if value >=3, win
    return adjCountNE + adjCountSW >= 3 ? board[colIdx][rowIdx] : null;
}

function checkHorizontalWin(colIdx, rowIdx){
    const adjCountRight = checkAdjacent(colIdx, rowIdx, 1, 0)
    const adjCountLeft = checkAdjacent(colIdx, rowIdx, -1, 0)
    return adjCountRight + adjCountLeft >= 3 ? board[colIdx][rowIdx] : null;
}

function checkVerticalWin(colIdx, rowIdx){
    const adjCount = checkAdjacent(colIdx, rowIdx, 0, -1)
    return adjCount === 3 ? board[colIdx][rowIdx] : null;
}

function checkAdjacent(colIdx, rowIdx, colOffset, rowOffset){
    let count = 0;
    const playerValue = board[colIdx][rowIdx];

    //perform the offset to begin checking adjacent cells
    colIdx += colOffset;
    rowIdx += rowOffset;
    while(board[colIdx] && board[colIdx][rowIdx] === playerValue) {
        count ++;
        colIdx += colOffset;
        rowIdx += rowOffset;
    }
    return count;
}

function render(){
    renderBoard(); //transfer state "data" from the board 2d array to the browser's dom
    renderMessage(); // display who's turn or who won based on turn or winner state
    renderControls(); // show/hide game controls bsed on win state
}

function renderControls() {
    playAgainBtn.style.visibility = winner ? "visible" : "hidden";
    markerEls.forEach(function(markerEl, idx) {
        const hideMarker = !board[idx].includes(null) || winner
        markerEl.style.visibility = hideMarker ? "hidden" : "visible"
    });
}

function renderMessage() {
    if (winner === "T") {
        // Display tie game
        messageEl.innerText = "Tie Game!";
    } else if (winner){
        // Display who won
        messageEl.innerHTML = `<span style="color: ${COLOR_LOOKUP[winner]}">${COLOR_LOOKUP[winner]}</span> Wins!`;
    } else {
        messageEl.innerHTML = `<span style="color: ${COLOR_LOOKUP[turn]}">${COLOR_LOOKUP[turn]}'s</span> Turn`;
        // Display the turn
    }
}

function renderBoard() {
    // loop over the board array
    board.forEach(function(colArray, colIdx) {
        // for each column array inside the board array
        colArray.forEach(function(cellValue, rowIdx) {
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            // we'll evaluate each cell and ise that value to set the background color of the each 
            // corresponding cell div in the dom
            cellEl.style.backgroundColor = COLOR_LOOKUP[cellValue];
        })
    });
}