/**
 * Created by Joe on 2016-04-13.
 */

function SpawnPointCoordinates (playerID) {
    switch (playerID) {
        case 1:
            return CoordinatesAtTile(13,8);
        case 2:
            return CoordinatesAtTile(5,5);
        case 3:
            return CoordinatesAtTile(10,8);
        default:
            return CoordinatesAtTile(4,12);
    }
}