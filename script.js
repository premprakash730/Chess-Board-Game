const board = document.getElementById("board");
const turnText = document.getElementById("turn");
const whiteCaptured = document.getElementById("whiteCaptured");
const blackCaptured = document.getElementById("blackCaptured");

let pieces = [
    ["♜", "black"], ["♞", "black"], ["♝", "black"], ["♛", "black"],
    ["♚", "black"], ["♝", "black"], ["♞", "black"], ["♜", "black"],

    ["♟", "black"], ["♟", "black"], ["♟", "black"], ["♟", "black"],
    ["♟", "black"], ["♟", "black"], ["♟", "black"], ["♟", "black"],

    [null, null], [null, null], [null, null], [null, null],
    [null, null], [null, null], [null, null], [null, null],

    [null, null], [null, null], [null, null], [null, null],
    [null, null], [null, null], [null, null], [null, null],

    [null, null], [null, null], [null, null], [null, null],
    [null, null], [null, null], [null, null], [null, null],

    [null, null], [null, null], [null, null], [null, null],
    [null, null], [null, null], [null, null], [null, null],

    ["♙", "white"], ["♙", "white"], ["♙", "white"], ["♙", "white"],
    ["♙", "white"], ["♙", "white"], ["♙", "white"], ["♙", "white"],

    ["♖", "white"], ["♘", "white"], ["♗", "white"], ["♕", "white"],
    ["♔", "white"], ["♗", "white"], ["♘", "white"], ["♖", "white"]
];

let currentTurn = "white";
let selected = null;


/* =========================
   BOARD CREATE
========================= */

function createBoard() {

    board.innerHTML = "";

    for (let i = 0; i < 64; i++) {

        let square = document.createElement("div");

        square.classList.add("square");

        if ((Math.floor(i / 8) + i) % 2 === 0) {
            square.classList.add("White");
        } else {
            square.classList.add("Brown");
        }

        square.dataset.index = i;

        if (pieces[i][0] !== null) {

            square.textContent = pieces[i][0];

            square.dataset.color = pieces[i][1];

            if (pieces[i][1] === "black") {
                square.style.color = "black";
            } else {
                square.style.color = "white";
                square.style.textShadow = "0 0 2px black";
            }
        }

        square.addEventListener("click", function () {
            clickSquare(i);
        });

        board.appendChild(square);
    }
}


/* =========================
   CLICK SQUARE
========================= */

function clickSquare(index) {

    let piece = pieces[index];

    // Agar koi piece selected nahi hai
    if (selected === null) {

        if (piece[0] === null) {
            return;
        }

        if (piece[1] !== currentTurn) {

            alert(
                "Abhi " +
                (currentTurn === "white" ? "Team 1" : "Team 2") +
                " ki turn hai!"
            );

            return;
        }

        selected = index;

        highlightMoves(index);

        return;
    }


    // Same square dobara click
    if (selected === index) {

        selected = null;

        createBoard();

        return;
    }


    // Agar apni team ki ghoti par click kiya
    if (
        pieces[index][0] !== null &&
        pieces[index][1] === currentTurn
    ) {

        selected = index;

        highlightMoves(index);

        return;
    }


    // Piece move karo
    if (isValidMove(selected, index)) {

        movePiece(selected, index);

    } else {

        alert("Ye ghoti yahan nahi ja sakti!");
    }
}


/* =========================
   MOVE PIECE
========================= */

function movePiece(from, to) {

    let movingPiece = pieces[from];
    let targetPiece = pieces[to];


    // Capture
    if (targetPiece[0] !== null) {

        if (targetPiece[1] === "white") {

            whiteCaptured.innerHTML +=
                targetPiece[0] + " ";

        } else {

            blackCaptured.innerHTML +=
                targetPiece[0] + " ";
        }
    }


    // Move
    pieces[to] = movingPiece;

    pieces[from] = [null, null];


    // Pawn promotion
    let row = Math.floor(to / 8);

    if (
        movingPiece[0] === "♙" &&
        row === 0
    ) {
        pieces[to][0] = "♕";
    }

    if (
        movingPiece[0] === "♟" &&
        row === 7
    ) {
        pieces[to][0] = "♛";
    }


    // Turn change
    if (currentTurn === "white") {

        currentTurn = "black";

        turnText.textContent = "Team 2";

    } else {

        currentTurn = "white";

        turnText.textContent = "Team 1";
    }


    selected = null;

    createBoard();
}


/* =========================
   VALID MOVE
========================= */

function isValidMove(from, to) {

    let piece = pieces[from];

    let target = pieces[to];

    if (!piece[0]) {
        return false;
    }

    // Apni ghoti ko capture nahi kar sakte
    if (
        target[0] !== null &&
        target[1] === piece[1]
    ) {
        return false;
    }


    let pieceSymbol = piece[0];

    let fromRow = Math.floor(from / 8);
    let fromCol = from % 8;

    let toRow = Math.floor(to / 8);
    let toCol = to % 8;

    let rowDiff = toRow - fromRow;
    let colDiff = toCol - fromCol;

    let absRow = Math.abs(rowDiff);
    let absCol = Math.abs(colDiff);


    /* =========================
       ROOK / HATHI
    ========================= */

    if (
        pieceSymbol === "♖" ||
        pieceSymbol === "♜"
    ) {

        if (
            rowDiff !== 0 &&
            colDiff !== 0
        ) {
            return false;
        }

        return pathClear(
            fromRow,
            fromCol,
            toRow,
            toCol
        );
    }


    /* =========================
       KNIGHT / HORSE
    ========================= */

    if (
        pieceSymbol === "♘" ||
        pieceSymbol === "♞"
    ) {

        if (
            (absRow === 2 && absCol === 1) ||
            (absRow === 1 && absCol === 2)
        ) {
            return true;
        }

        return false;
    }


    /* =========================
       BISHOP / OONT
    ========================= */

    if (
        pieceSymbol === "♗" ||
        pieceSymbol === "♝"
    ) {

        if (absRow !== absCol) {
            return false;
        }

        return pathClear(
            fromRow,
            fromCol,
            toRow,
            toCol
        );
    }


    /* =========================
       QUEEN / WAZIR
    ========================= */

    if (
        pieceSymbol === "♕" ||
        pieceSymbol === "♛"
    ) {

        // Seedha
        if (
            rowDiff === 0 ||
            colDiff === 0
        ) {

            return pathClear(
                fromRow,
                fromCol,
                toRow,
                toCol
            );
        }


        // Tircha
        if (absRow === absCol) {

            return pathClear(
                fromRow,
                fromCol,
                toRow,
                toCol
            );
        }

        return false;
    }


    /* =========================
       KING / RAJA
    ========================= */

    if (
        pieceSymbol === "♔" ||
        pieceSymbol === "♚"
    ) {

        if (
            absRow <= 1 &&
            absCol <= 1
        ) {
            return true;
        }

        return false;
    }


    /* =========================
       PAWN / PYADA
    ========================= */

    if (
        pieceSymbol === "♙" ||
        pieceSymbol === "♟"
    ) {

        return pawnMove(
            from,
            to,
            piece[1],
            fromRow,
            fromCol,
            toRow,
            toCol
        );
    }


    return false;
}


/* =========================
   PATH CLEAR
   HATHI / OONT / QUEEN
========================= */

function pathClear(
    fromRow,
    fromCol,
    toRow,
    toCol
) {

    let rowStep = Math.sign(toRow - fromRow);
    let colStep = Math.sign(toCol - fromCol);

    let row = fromRow + rowStep;
    let col = fromCol + colStep;


    while (
        row !== toRow ||
        col !== toCol
    ) {

        let index = row * 8 + col;

        if (pieces[index][0] !== null) {
            return false;
        }

        row += rowStep;
        col += colStep;
    }


    return true;
}


/* =========================
   PAWN MOVEMENT
========================= */

function pawnMove(
    from,
    to,
    color,
    fromRow,
    fromCol,
    toRow,
    toCol
) {

    let direction;

    let startingRow;


    // White upar jayega
    if (color === "white") {

        direction = -1;
        startingRow = 6;

    } else {

        // Black neeche jayega
        direction = 1;
        startingRow = 1;
    }


    let rowDiff = toRow - fromRow;
    let colDiff = Math.abs(toCol - fromCol);

    let target = pieces[to];


    /* -------------------------
       1 STEP FORWARD
    ------------------------- */

    if (
        colDiff === 0 &&
        rowDiff === direction &&
        target[0] === null
    ) {

        return true;
    }


    /* -------------------------
       2 STEP FIRST MOVE
    ------------------------- */

    if (
        colDiff === 0 &&
        fromRow === startingRow &&
        rowDiff === direction * 2
    ) {

        let middleRow = fromRow + direction;

        let middleIndex =
            middleRow * 8 + fromCol;

        if (
            pieces[middleIndex][0] === null &&
            target[0] === null
        ) {

            return true;
        }
    }


    /* -------------------------
       DIAGONAL CAPTURE
    ------------------------- */

    if (
        colDiff === 1 &&
        rowDiff === direction &&
        target[0] !== null &&
        target[1] !== color
    ) {

        return true;
    }


    return false;
}


/* =========================
   SHOW POSSIBLE MOVES
========================= */

function highlightMoves(index) {

    createBoard();

    let squares =
        document.querySelectorAll(".square");

    squares[index].classList.add("selected");


    for (let i = 0; i < 64; i++) {

        if (i === index) {
            continue;
        }

        if (isValidMove(index, i)) {

            squares[i].classList.add("possible");
        }
    }
}


/* =========================
   START GAME
========================= */

createBoard();
