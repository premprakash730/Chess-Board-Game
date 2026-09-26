const board = document.getElementById("board");
const turnText = document.getElementById("turn");
const whiteCaptured = document.getElementById("whiteCaptured");
const blackCaptured = document.getElementById("blackCaptured");
let pieces = [
    ["♜","black"], ["♞","black"], ["♝","black"], ["♛","black"],
    ["♚","black"], ["♝","black"], ["♞","black"], ["♜","black"],
    ["♟","black"], ["♟","black"], ["♟","black"], ["♟","black"],
    ["♟","black"], ["♟","black"], ["♟","black"], ["♟","black"],
    [null,null], [null,null], [null,null], [null,null],
    [null,null], [null,null], [null,null], [null,null],
    [null,null], [null,null], [null,null], [null,null],
    [null,null], [null,null], [null,null], [null,null],
    [null,null], [null,null], [null,null], [null,null],
    [null,null], [null,null], [null,null], [null,null],
    [null,null], [null,null], [null,null], [null,null],
    [null,null], [null,null], [null,null], [null,null],
    ["♙","white"], ["♙","white"], ["♙","white"], ["♙","white"],
    ["♙","white"], ["♙","white"], ["♙","white"], ["♙","white"],
    ["♖","white"], ["♘","white"], ["♗","white"], ["♕","white"],
    ["♔","white"], ["♗","white"], ["♘","white"], ["♖","white"]
];
let currentTurn = "white";
let selected = null;
function createBoard() {
    board.innerHTML = "";
    for (let i = 0; i < 64; i++) {
        let square = document.createElement("div");
        square.classList.add("square");
        if ((Math.floor(i / 8) + i) % 2 == 0) {
            square.classList.add("White");
        } else {
            square.classList.add("Brown");
        }
        square.dataset.index = i;
        if (pieces[i][0]) {
            square.textContent = pieces[i][0];
            square.dataset.color = pieces[i][1];
            if (pieces[i][1] === "black") {
                square.style.color = "black";
            } else {
                square.style.color = "white";
                square.style.textShadow = "0 0 2px black";
            }
        }
        square.addEventListener("click", () => clickSquare(i));

        board.appendChild(square);
    }
}
function clickSquare(index) {
    let piece = pieces[index];
    if (selected === null) {
        if (piece[0] === null) {
            return;
        }
        if (piece[1] !== currentTurn) {
            alert("Abhi " + (currentTurn === "white" ? "Team 1" : "Team 2") + " ki turn hai!");
            return;
        }
        selected = index;
        highlightMoves(index);
        return;
    }
    if (selected === index) {
        selected = null;
        createBoard();
        return;
    }
    movePiece(selected, index);
}
function movePiece(from, to) {
    let movingPiece = pieces[from];
    let targetPiece = pieces[to];
    // Same team capture nahi kar sakti
    if (targetPiece[1] === movingPiece[1]) {
        selected = to;
        highlightMoves(to);
        return;
    }
    if (targetPiece[0] !== null) {
        if (targetPiece[1] === "white") {
            whiteCaptured.innerHTML += targetPiece[0];
        } else {
            blackCaptured.innerHTML += targetPiece[0];
        }
    }
    pieces[to] = movingPiece;
    pieces[from] = [null, null];
    selected = null;
    if (currentTurn === "white") {
        currentTurn = "black";
        turnText.textContent = "Team 2";
    } else {
        currentTurn = "white";
        turnText.textContent = "Team 1";
    }
    createBoard();
}
function highlightMoves(index) {
    createBoard();
    let squares = document.querySelectorAll(".square");
    squares[index].classList.add("selected");
    let row = Math.floor(index / 8);
    let col = index % 8;
    if (row > 0) {
        checkMove(index - 8, squares);
    }
    if (row < 7) {
        checkMove(index + 8, squares);
    }
    if (col > 0) {
        checkMove(index - 1, squares);
    }
    if (col < 7) {
        checkMove(index + 1, squares);
    }
    if (row > 0 && col > 0) {
        checkMove(index - 9, squares);
    }
    if (row > 0 && col < 7) {
        checkMove(index - 7, squares);
    }
    if (row < 7 && col > 0) {
        checkMove(index + 7, squares);
    }
    if (row < 7 && col < 7) {
        checkMove(index + 9, squares);
    }
}
function checkMove(index, squares) {
    if (pieces[index][0] === null ||
        pieces[index][1] !== currentTurn) {
        squares[index].classList.add("possible");
    }
}
createBoard();
