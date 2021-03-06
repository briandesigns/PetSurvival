/**
 * Helper functions for multiplayer to determine the coordinates of a tile and vice versa.
 */

function CoordinatesAtTile(xTile, yTile) {
    var xCoord = parseInt(xTile*32 + 16);
    var yCoord = parseInt(16*32 - ((yTile+1)*32)+16);
    
    return {xCoordinate: xCoord, yCoordinate: yCoord};
}

function TileAtCoordinates(xCoordinate, yCoordinate) {
    var xTile = parseInt(xCoordinate / 32);
    var yTile = 16 - parseInt(yCoordinate / 32);
    
    return {xTile: xTile, yTile: yTile};
}