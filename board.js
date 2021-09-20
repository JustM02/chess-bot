import {Pawn, Knight, Bishop, Rook, Queen, King} from "./pieces.js";

class Board {
    constructor() {
        this.tiles = {};
        for(let i = 1; i <= 64; i++) {
            this.tiles[i] = 0;
        }
    }

    // IDs : Pawn - 1, Knight - 2, Bishop - 3, Rook - 4, Queen - 5, King - 6
    addPiece(tileId, pieceId) {
        switch(pieceId) {
            case 1:
                this.tiles[tileId] = new Pawn(tileId);
                break;
            case 2:
                this.tiles[tileId] = new Knight(tileId);
                break;
            case 3:
                this.tiles[tileId] = new Bishop(tileId);
                break;
            case 4:
                this.tiles[tileId] = new Rook(tileId);
                break;
            case 5:
                this.tiles[tileId] = new Queen(tileId);
                break;
            case 6:
                this.tiles[tileId] = new King(tileId);
                break;
            default:
                console.log("Invalid pieceId passed to board");
        }

    }

    getTilePiece(tileId) {
        return this.tiles[tileId];
    }

    updatePiece(currTile, newTile) {
        let piece = this.tiles[currTile];
        this.tiles[currTile].updatePiece(newTile);
        this.tiles[currTile] = 0;
        this.tiles[newTile] = piece;
    }

    getPieceValidMoves(tileId) {
        let piece = this.tiles[tileId];
        return piece.validSpaces();
    } 
}



export {Board};