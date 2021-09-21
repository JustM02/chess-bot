import {getTileNumber} from "./tile dictionary.js";

class Pawn {
    constructor(tileId, color) {
        // currentTile can be int between 1 and 64, representing a1-h8 tiles.  a1 = 1, a2=2 ... b1=8...h8=64
        this.hasMoved = false;
        this.currentTile = tileId;
        this.pieceId = 1;
        this.display = "Pawn";
        this.color = color;
        this.validTiles = [];
        this.validSpaces(true);
        
    }

    // Returns array with ints representing which tiles piece can move to
    // For all pieces validSpaces both returns array of valid tileIds piece can move to,
    // But also stores all valid tileIds, and is only updated when piece is actually moved
    // If update is true, then will recalculate and update validTiles with currentTile
    // Otherwise will return currently stored validTiles
    // Outside of this file, every call should pass in false and use updatePiece to update validTiles
    validSpaces(update) {
        if(!update) {
            return this.validTiles;
        }
        if(this.color == "white") {
            let i = this.currentTile;
            if(this.hasMoved) {
                this.validTiles = [i + 1];
                return [i + 1];
            } else {
                this.validTiles = [i + 1, i + 2];
                return [i + 1, i + 2];
            }
        } else {
            let i = this.currentTile;
            if(this.hasMoved) {
                this.validTiles = [i - 1];
                return [i - 1];
            } else {
                this.validTiles = [i - 1, i - 2];
                return [i - 1, i - 2];
            }
        }
    }

    // Called after player clicks on valid space for piece to move to
    updatePiece(tileId) {
        if(!this.hasMoved)
            this.hasMoved = true;
        this.currentTile = tileId;
        this.validSpaces(true);
    }
}

class Knight {
    constructor(tileId, color) {
        this.currentTile = tileId;
        this.pieceId = 2;
        this.display = "Knight";
        this.validTiles = [];
        this.validSpaces(true);
        this.color = color;
    }

    validSpaces(update) {
        if(!update)
            return this.validTiles;
        let spaces = [];
        let i = this.currentTile + 8;
        let tileNum = getTileNumber(i);
        if(i < 65) {
            if(tileNum  <= 2) {
                spaces.push(i + 2);
            } else if(tileNum > 2 && tileNum < 7) {
                spaces.push(i + 2, i - 2);
            } else {
                spaces.push(i - 2);
            }
        }
        i = this.currentTile - 8;
        if(i > 0) {
            if(tileNum  <= 2) {
                spaces.push(i + 2);
            } else if(tileNum > 2 && tileNum < 7) {
                spaces.push(i + 2, i - 2);
            } else {
                spaces.push(i - 2);
            }
        }
        i = this.currentTile + 16;
        tileNum = getTileNumber(i);
        if(i < 65) {
            if(tileNum == 1) {
                spaces.push(i + 1);
            } else if(tileNum > 1 && tileNum < 8) {
                spaces.push(i + 1, i - 1);
            } else {
                spaces.push(i - 1);
            }
        }
        i = this.currentTile - 16;
        if(i > 0) {
            if(tileNum  == 1) {
                spaces.push(i + 1);
            } else if(tileNum > 1 && tileNum < 8) {
                spaces.push(i + 1, i - 1);
            } else {
                spaces.push(i - 1);
            }
        }
        this.validTiles = spaces;
        return spaces;
    }

    updatePiece(tileId) {
        this.currentTile = tileId;
        this.validSpaces(true);
    }

}

class Bishop {
    constructor(tileId, color) {
        this.currentTile = tileId;
        this.pieceId = 3;
        this.display = "Bishop"
        this.validTiles = [];
        this.validSpaces(true);
        this.color = color;
    }

    validSpaces(update) {
        if(!update)
            return this.validTiles;
        let i = bishopAndQueenValidSpaces(this.currentTile);
        this.validTiles = i;
        return i;
    }

    updatePiece(tileId) {
        this.currentTile = tileId;
        this.validSpaces(true);
    }
}

class Rook {
    constructor(tileId, color) {
        this.currentTile = tileId;
        this.pieceId = 4;
        this.display = "Rook";
        this.hasMoved = false;
        this.validTiles = [];
        this.validSpaces(true);
        this.color = color;
    }

    validSpaces(update) {
        if(!update)
            return this.validTiles;
        let i = rookAndQueenValidSpaces(this.currentTile);
        this.validTiles = i;
        return i;
    }

    updatePiece(tileId) {
        this.currentTile = tileId;
        this.validSpaces(true);
    }
}

class Queen {
    constructor(tileId, color) {
        this.currentTile = tileId;
        this.pieceId = 5;
        this.display = "Queen";
        this.validTiles = [];
        this.validSpaces(true);
        this.color = color;
    }

    validSpaces(update) {
        if(!update)
            return this.validTiles;
        let i = rookAndQueenValidSpaces(this.currentTile).concat(bishopAndQueenValidSpaces(this.currentTile));
        this.validTiles = i;
        return i;
    }

    updatePiece(tileId) {
        this.currentTile = tileId;
        this.validSpaces(true);
    }
}

class King {
    constructor(tileId, color) {
        this.currentTile = tileId;
        this.pieceId = 6;
        this.display = "King";
        this.inCheck = false;
        this.hasMoved = false;
        this.validTiles = [];
        this.validSpaces(true);
        this.color = color;
    }

    validSpaces(update) {
        if(!update)
            return this.validTiles;
        let spaces = [];
        let i = this.currentTile;
        if(getTileNumber(i) != 8) {
            spaces.push(i + 1);
            if(i - 7 > 0) {
                spaces.push(i - 7);
            }
            if(i + 9 < 65) {
                spaces.push(i + 9);
            }
        }
        if(getTileNumber(i) != 1) {
            spaces.push(i - 1);
            if(i - 9 > 0) {
                spaces.push(i - 9);
            }
            if(i + 7 < 65) {
                spaces.push(i + 7);
            }
        }
        if(i - 8 > 0) {
            spaces.push(i - 8);
        }
        if(i + 8 < 65) {
            spaces.push(i + 8);
        }
        this.validTiles = spaces;
        return spaces;
    }

    updatePiece(tileId) {
        if(!this.hasMoved)
            this.hasMoved = true;
        this.currentTile = tileId;
        this.validSpaces(true);
    }
}

// Calculate valid spaces for bishop and for queen's diagonal movement
function bishopAndQueenValidSpaces(currentTile) {
    let i = currentTile;
    i += 9;
    let spaces = [];
    while(i < 65 && getTileNumber(i) != 1) {
        spaces.push(i);
        i += 9;
    }
    i = currentTile;
    i += 7;
    while(i < 65 && getTileNumber(i) != 8) {
        spaces.push(i);
        i += 7;
    }
    i = currentTile;
    i -= 9;
    while(i > 0 && getTileNumber(i) != 8) {
        spaces.push(i);
        i -= 9;
    }
    i = currentTile;
    i -= 7;
    while(i > 0 && getTileNumber(i) != 1) {
        spaces.push(i);
        i -= 7;
    }
    return spaces;
}

// Calculate movement for rook and queen's horizontal and vertical movemenet
function rookAndQueenValidSpaces(currentTile) {
    let i = currentTile + 1;
    let spaces = [];
    while(getTileNumber(i) != 1) {
        spaces.push(i);
        i += 1;
    }
    i = currentTile + 8;
    while(i < 65) {
        spaces.push(i);
        i += 8;
    }
    i = currentTile - 1;
    // Need i > 0 specifically for decrementing i but not incrementing
    // Results in infinite loop without it
    while(getTileNumber(i) != 8 && i > 0) {
        spaces.push(i);
        i -= 1;
    }
    i = currentTile - 8;
    while(i > 0) {
        spaces.push(i);
        i -= 8;
    }
    return spaces;
}


export {Pawn, Knight, Bishop, Rook, Queen, King};