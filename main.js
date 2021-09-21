import {getTileString, getTileId} from "./tile dictionary.js";
import {Board} from "./board.js";

window.addEventListener('DOMContentLoaded', (e) => {
    startGame();
});

let board, playerTurn = true, pieceSelected = false;
let currPieceSelected = null, currTileSelected = null;

function startGame() {
    //Initialize position score to be used in algorithm, initialize board, add click functionality to all 64 tiles
    let positionScore = 0;
    board = new Board();
    let tiles = document.querySelectorAll(".tile");
    loadPieces(tiles);

    tiles.forEach(tile => {
        tile.addEventListener('click', onTileClick);
            
    });
}

function onTileClick(e) {
    processPlayerClick(getTileId(this.id[0], this.id[1]), this);
}

function processPlayerClick(tileId, tile) {
    // If player clicks when not their turn (bot stil processing turn), don't do any processing
    if(!playerTurn)
        return;
    // If player doesn't currently have a piece selected, then changed pieceSelected to true and store piece selected
    // If player doesn't currently have a piece selected and tile they clicked on tile that doesn't contain piece, return
    if(!pieceSelected) {
        if(board.getTilePiece(tileId) == 0)
            return;
        changeToPieceSelected(tileId, tile);
        displayValidMoves(currPieceSelected.currentTile);
    }
    else {
        // If player previously selected piece, process new tile selected to see if valid move
        let validMoves = board.getPieceValidMoves(currPieceSelected.currentTile);
        // If player clicks tile piece can't move to - deselect piece and tile
        if(!validMoves.includes(tileId)) {
            console.log("Invalid move");
            changeToPieceDeselected(tileId, tile);
            return;
        }
        // Pass piece's current tile and tile to move to to updatePiece
        // First update board's view of game, deselect piece, then update display
        board.updatePiece(currPieceSelected.currentTile, tileId);
        changeToPieceDeselected(tileId);
        updateDisplay();
    }
}

function changeToPieceSelected(tileId, tile) {
    pieceSelected = true;
    currPieceSelected = board.getTilePiece(tileId);
    currTileSelected = tile;
    currTileSelected.style.background = "blue";
}

function changeToPieceDeselected(tileId) {
    pieceSelected = false;
    currPieceSelected = null;
    currTileSelected.style.background = null;
    currTileSelected = null;
    updateDisplay();
}

function loadPieces(tiles) {
    //Load all pieces onto board and update browser display
    //Initialize pawns
    for(let i = 0, tileNum = 2; i < 8; i++) {
        board.addPiece(tileNum, 1, "white");
        tileNum += 8;
    }
    for(let i = 0, tileNum = 7; i < 8; i++) {
        board.addPiece(tileNum, 1, "black");
        tileNum += 8;
    }
    //Initialize knights
    board.addPiece(9, 2, "white");
    board.addPiece(49, 2, "white");
    board.addPiece(16, 2, "black");
    board.addPiece(56, 2, "black");

    // Initialize bishops
    board.addPiece(17, 3, "white");
    board.addPiece(41, 3, "white");
    board.addPiece(24, 3, "black");
    board.addPiece(48, 3, "black");

    // Initialize rooks
    board.addPiece(1, 4, "white");
    board.addPiece(57, 4, "white");
    board.addPiece(8, 4, "black");
    board.addPiece(64, 4, "black");

    // Initialize queens
    board.addPiece(25, 5, "white");
    board.addPiece(32, 5, "black");

    // Initialize kings
    board.addPiece(33, 6, "white");
    board.addPiece(40, 6, "black");

    updateDisplay(board);
}

function displayValidMoves(tileId) {
    let tileIds = board.getPieceValidMoves(tileId);
    for(let tile of tileIds) {
        let htmlTile = document.querySelector(`#${getTileString(tile)}`);
        let circle = document.createElement("div");
        circle.className = "circle";
        htmlTile.appendChild(circle);
    }
}

function updateDisplay() {
    //Loop through all tiles in board and update display
    //Could be improved so doesn't loop through all tiles everytime, only on initialization
    for(let tile in board.tiles) {
        let piece = board.tiles[tile];
        let tileString = getTileString(tile);
        let htmlTile = document.querySelector(`#${tileString}`);
        while(htmlTile.firstChild)
            htmlTile.removeChild(htmlTile.firstChild);
        if(piece != 0) {
            let div = document.createElement("div");
            if(piece.color == "black")
                div.className = "black-piece"
            let text = document.createTextNode(piece.display);
            div.appendChild(text);
            htmlTile.appendChild(div);

        } 
    }
    console.log(board);
}

