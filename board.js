import {Pawn, Knight, Bishop, Rook, Queen, King} from "./pieces.js";
import { getTileNumber } from "./tile dictionary.js";

let pieceIds = {

}

class Board {
    constructor() {
        this.tiles = {};
        for(let i = 1; i <= 64; i++) {
            this.tiles[i] = 0;
        }
    }

    // IDs : Pawn - 1, Knight - 2, Bishop - 3, Rook - 4, Queen - 5, King - 6
    addPiece(tileId, pieceId, color) {
        switch(pieceId) {
            case 1:
                this.tiles[tileId] = new Pawn(tileId, color);
                break;
            case 2:
                this.tiles[tileId] = new Knight(tileId, color);
                break;
            case 3:
                this.tiles[tileId] = new Bishop(tileId, color);
                break;
            case 4:
                this.tiles[tileId] = new Rook(tileId, color);
                break;
            case 5:
                this.tiles[tileId] = new Queen(tileId, color);
                break;
            case 6:
                this.tiles[tileId] = new King(tileId, color);
                break;
            default:
                console.error("Invalid pieceId passed to board");
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
        let validMovesNoCollision = piece.validSpaces(false);
        let validMovesCollision = [];
        switch(piece.pieceId) {
            case 1:
                validMovesCollision = this.getPawnMovesCollision(validMovesNoCollision);
                break;
            case 2:
                validMovesCollision = this.getKnightMovesCollision(piece, validMovesNoCollision);
                break;
            case 3:
                validMovesCollision = this.getBishopQueenMovesCollision(piece);
                break;
            case 4:
                validMovesCollision = this.getRookQueenMovesCollision(piece);
                break;
            case 5:
                validMovesCollision = this.getBishopQueenMovesCollision(piece).concat(this.getRookQueenMovesCollision(piece));
                break;
            case 6:
                validMovesCollision = this.getKingMovesCollision(piece, validMovesNoCollision);
                break;
            default:
        }
        return validMovesCollision;
    }

    // Takes in tileId of piece to determine which of the moves in valid moves array are
    // valid given current board position
    getPawnMovesCollision(validMovesNoCollision) {
        let piece = null;
        let validMovesCollision = [];
        for(let tileId of validMovesNoCollision) {
            piece = this.getTilePiece(tileId);
            if(piece != 0) {
                break;
            } else {
                validMovesCollision.push(tileId);
            }
        }
        return validMovesCollision;
    }

    getKnightMovesCollision(knight, validMovesNoCollision) {
        let piece = null;
        let validMovesCollision = [];
        for(let tileId of validMovesNoCollision) {
            piece = this.getTilePiece(tileId);
            if(piece == 0) {
                validMovesCollision.push(tileId);
            }
            else if(piece.color != knight.color) {
                validMovesCollision.push(tileId);
            }
        }
        return validMovesCollision;
    }

    getBishopQueenMovesCollision(piece) {
        let validMovesCollision = [];
        let i = piece.currentTile;
        i += 9;
        while(i < 65 && getTileNumber(i) != 1) {
            if(this.getTilePiece(i) == 0) {
                validMovesCollision.push(i);
                i += 9;
            } else {
                if(this.getTilePiece(i).color != piece.color) {
                    validMovesCollision.push(i);
                    break;
                } else {
                    break;
                }
            }
        }
        i = piece.currentTile;
        i += 7;
        while(i < 65 && getTileNumber(i) != 8) {
            if(this.getTilePiece(i) == 0) {
                validMovesCollision.push(i);
                i += 7;
            } else {
                if(this.getTilePiece(i).color != piece.color) {
                    validMovesCollision.push(i);
                    break;
                } else {
                    break;
                }
            }
        }
        i = piece.currentTile;
        i -= 9;
        while(i > 0 && getTileNumber(i) != 8) {
            if(this.getTilePiece(i) == 0) {
                validMovesCollision.push(i);
                i -= 9;
            } else {
                if(this.getTilePiece(i).color != piece.color) {
                    validMovesCollision.push(i);
                    break;
                } else {
                    break;
                }
            }
        }
        i = piece.currentTile;
        i -= 7;
        while(i > 0 && getTileNumber(i) != 1) {
            if(this.getTilePiece(i) == 0) {
                validMovesCollision.push(i);
                i -= 7;
            } else {
                if(this.getTilePiece(i).color != piece.color) {
                    validMovesCollision.push(i);
                    break;
                } else {
                    break;
                }
            }
        }
        return validMovesCollision;
    }

    getRookQueenMovesCollision(piece) {
    let i = piece.currentTile + 1;
    let validMovesCollision = [];
    while(getTileNumber(i) != 1) {
        if(this.getTilePiece(i) == 0) {
            validMovesCollision.push(i);
            i += 1;
        } else {
            if(this.getTilePiece(i).color != piece.color) {
                validMovesCollision.push(i);
                break;
            } else {
                break;
            }
        }
    }
    i = piece.currentTile + 8;
    while(i < 65) {
        if(this.getTilePiece(i) == 0) {
            validMovesCollision.push(i);
            i += 8;
        } else {
            if(this.getTilePiece(i).color != piece.color) {
                validMovesCollision.push(i);
                break;
            } else {
                break;
            }
        }
    }
    i = piece.currentTile - 1;
    // Need i > 0 specifically for decrementing i but not incrementing
    // Results in infinite loop without it
    while(getTileNumber(i) != 8 && i > 0) {
        if(this.getTilePiece(i) == 0) {
            validMovesCollision.push(i);
            i -= 1;
        } else {
            if(this.getTilePiece(i).color != piece.color) {
                validMovesCollision.push(i);
                break;
            } else {
                break;
            }
        }
    }
    i = piece.currentTile - 8;
    while(i > 0) {
        if(this.getTilePiece(i) == 0) {
            validMovesCollision.push(i);
            i -= 8;
        } else {
            if(this.getTilePiece(i).color != piece.color) {
                validMovesCollision.push(i);
                break;
            } else {
                break;
            }
        }
    }
    return validMovesCollision;
    }

    getKingMovesCollision(king, validMovesNoCollision) {
        let validMovesCollision = [];
        for(let tileId of validMovesNoCollision) {
            if(this.getTilePiece(tileId) == 0) {
                validMovesCollision.push(tileId);
            } else {
                if(this.getTilePiece(tileId).color != king.color) {
                    validMovesCollision.push(tileId);
                }
            }
        }
        return validMovesCollision;
    }
}



export {Board};