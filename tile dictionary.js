// File for converting between two different formats to differentiate tiles
// tileId is internal board's representation of each tile, starting with 1
// at a1, up through 64 at h8
// tileString represents string consisting of letter to represent column (a-h),
// along with a number (1-8 inclusive), for the frontend html/css

// Functions allow for converting between the two different formats
let tileLetter = {
    8: "a",
    16: "b",
    24: "c",
    32: "d",
    40: "e",
    48: "f",
    56: "g",
    64: "h"
}

//Given number (1-64), return hml representation of tile ([column letter][row number])
// Converting from tileId to tileString
function getTileString(num) {
    return getTileLetter(num) + getTileNumber(num); 
}

//Given number (1-64), return html column representation (a-h)
function getTileLetter(num) {
    if(num in tileLetter)
        return tileLetter[num];
    else
        for(let tile in tileLetter) {
            if(num / tile < 1)
                return tileLetter[tile];
        }
    return "h";
}

// Given number (1-64), return html row representation
function getTileNumber(num) {
    if(num < 9)
        return num.toString();
    else
        if(num % 8 == 0)
            return 8;
        else
            return num % 8;
}
// Get tile ID (Number between 0-64 (inclusive))
// Given a tile letter (a-h) and row num(1-8) 
// Converting from tileString to tileId
function getTileId(letter, tileNum) {
    let temp = 0;
    for(let i in tileLetter) {
        if(tileLetter[i] == letter) {
            temp = i;
        }
    }
    return temp - 8 + parseInt(tileNum);
}

export {getTileString, getTileId, getTileNumber};