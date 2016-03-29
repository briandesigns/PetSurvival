/*
 This function finds the longest shortest path between two points
 on the map. This ensures that the playable map area is not too
 small to be fun.
 */

//traverse the map horizontally and vertically to find 2 tiles in a row to create an edge between
function FunChecker(fullMapTileCount, fullMapWidth, collisionArray, objectsToPosition) {

    //Build an array that keeps track of adjacent tiles from the tile at the array's index
    var edgesFrom = new Array(fullMapTileCount);

    for (var i=0; i<edgesFrom.count; i++) {
        edgesFrom[i] = [];
    }

    var lastValue = 1;
    var lastIndex = null;

    //Traverse map horizontally
    for (i=0; i<fullMapTileCount; i+=fullMapWidth) {
        lastValue = 1;
        //cc.log("i: " + i);
        for (var j=0; j<fullMapWidth; j++) {
            //cc.log("j: " + j);
            //cc.log("collisionArray[" + (i+j) + "]: " + collisionArray[i+j]);
            //cc.log("lastValue: " + lastValue);
            if (collisionArray[i+j] == 0 && lastValue == 0) {
                //cc.log("adding " + lastIndex + " to edgesFrom[" + (i+j) + "]");
                //if our tile is connected to the last tile, we add each to the other's edgesFrom entry
                if (!edgesFrom[i+j]) { edgesFrom[i+j] = []; }
                edgesFrom[i+j].push(lastIndex);
                if (!edgesFrom[lastIndex]) { edgesFrom[lastIndex] = []; }
                edgesFrom[lastIndex].push(i+j);
            }
            lastValue = collisionArray[i+j];
            lastIndex = i+j;
        }
    }

    //Traverse map vertically
    for (i=0; i<fullMapWidth; i++) {
        lastValue = 1;
        for (j=0; j<fullMapTileCount; j+=fullMapWidth) {
            if (collisionArray[i+j] == 0 && lastValue == 0) {
                //cc.log("adding " + lastIndex + " to edgesFrom[" + (i+j) + "]");
                //if our tile is connected to the last tile, we add each to the other's edgesFrom entry
                if (!edgesFrom[i+j]) { edgesFrom[i+j] = []; }
                edgesFrom[i+j].push(lastIndex);
                if (!edgesFrom[lastIndex]) { edgesFrom[lastIndex] = []; }
                edgesFrom[lastIndex].push(i+j);
            }
            lastValue = collisionArray[i+j];
            lastIndex = i+j;
        }
    }

    //Count how many possible tiles there are
    var validStartTiles = [];
    for (i=0; i<edgesFrom.length; i++) {
        //cc.log("Edges from " + i + " edgesFrom[i]: " + edgesFrom[i]);
        if (edgesFrom[i]) {
            validStartTiles.push(i);
        }
    }
    //cc.log("There are " + validStartTiles.length + " valid start tiles");

    //Pick some at random and set up a 2d array that tracks the distance between each of them
    var chosenRandomTiles = [];
    var numberOfRandomTiles = 10;
    var distanceBetweenRandomTiles = new Array(numberOfRandomTiles);

    for (i=0; i<numberOfRandomTiles; i++) {
        chosenRandomTiles.push(validStartTiles[parseInt(Math.random()*validStartTiles.length)]);
        distanceBetweenRandomTiles[i] = new Array(numberOfRandomTiles);
    }
    cc.log("Random tiles chosen: " + chosenRandomTiles);

    var accessibleTiles = [];

    //Run BFS on each of the randomly chosen tiles
    for (i=0; i<numberOfRandomTiles; i++) {
        //console.log("##################Checking new random tile " + i + ": " + chosenRandomTiles[i]);
        //Copy our edgesFromArray so that we can mutate it
        var edgesFromCopy = new Array(fullMapTileCount);
        for (j=0; j<edgesFromCopy.length; j++) {
            if (edgesFrom[j]) {
                edgesFromCopy[j] = edgesFrom[j].slice();
            }
        }

        var root = chosenRandomTiles[i];
        var distance = new Array(fullMapTileCount);

        for (j=0; j<distance.length; j++) {
            distance[j] = Infinity;
        }

        var queue = [];
        distance[root] = 0;
        queue.push(root);
        accessibleTiles.push(root);
        //console.log("Enqueued " + root);
        //console.log("[" + queue + "]");

        while (queue.length > 0) {
            var current = queue.shift();
            //console.log("Dequeued " + current + " with edges " + edgesFromCopy[current]);
            //console.log("[" + queue + "]");

            for (j=0; j<edgesFromCopy[current].length; j++) {
                var next = edgesFromCopy[current][j];
                //console.log("Picked " + next + " with edges " + edgesFromCopy[next]);

                if (distance[next] == Infinity) {
                    distance[next] = distance[current] + 1;
                    if (chosenRandomTiles.indexOf(next) > -1) {
                        distanceBetweenRandomTiles[chosenRandomTiles.indexOf(root)][chosenRandomTiles.indexOf(next)] = distance[next];
                        distanceBetweenRandomTiles[chosenRandomTiles.indexOf(next)][chosenRandomTiles.indexOf(root)] = distance[next];
                        //cc.log("Distance from " + coordinateAtTileIndex(root, fullMapWidth) + " to " + coordinateAtTileIndex(next, fullMapWidth) + " is " + distance[next]);
                    }
                    //console.log(next + " has distance: " + distance[next]);
                    //remove edge from each edge array
                    edgesFromCopy[current].splice(edgesFromCopy[current].indexOf(next), 1);
                    j--;
                    queue.push(next);
                    accessibleTiles.push(next);
                    //console.log("Enqueued " + next);
                    //console.log("[" + queue + "]");
                }
            }
        }
    }

    var maximumDistance = 0;
    var startTile = null;
    var endTile = null;

    for (i=0; i<distanceBetweenRandomTiles.length; i++) {
        for (j=0; j<distanceBetweenRandomTiles.length; j++) {
            if (distanceBetweenRandomTiles[i][j] > maximumDistance) {
                maximumDistance = distanceBetweenRandomTiles[i][j];
                startTile = chosenRandomTiles[i];
                endTile = chosenRandomTiles[j];
            }
        }
        console.log(coordinateAtTileIndex(chosenRandomTiles[i], fullMapWidth));
    }

    console.log("Start tile should be " + coordinateAtTileIndex(startTile, fullMapWidth) + " and end tile " + coordinateAtTileIndex(endTile, fullMapWidth) + " with distance " + maximumDistance);

    accessibleTiles.splice(accessibleTiles.indexOf(startTile), 1);
    accessibleTiles.splice(accessibleTiles.indexOf(endTile), 1);

    var objectRandomTiles = [];

    //mark tiles as valid places to put enemy spawns & caves
    for (i=0; i<objectsToPosition; i++) {
        var randomNumber = parseInt(Math.random()*accessibleTiles.length);
        var randomTile = accessibleTiles[randomNumber];

        if (collisionArray[randomTile-1-fullMapWidth] == 0 && collisionArray[randomTile-fullMapWidth] == 0 && collisionArray[randomTile+1-fullMapWidth] == 0 && collisionArray[randomTile-1] == 0 && collisionArray[randomTile+fullMapWidth] == 0 && collisionArray[randomTile-1+fullMapWidth] == 0 && collisionArray[randomTile+fullMapWidth] == 0 && collisionArray[randomTile+1+fullMapWidth] == 0) {
            objectRandomTiles.push(randomTile);
            //remove used tiles so we don't put spawns on top of each other
            accessibleTiles.splice(accessibleTiles.indexOf(randomTile-1-fullMapWidth), 3);
            accessibleTiles.splice(accessibleTiles.indexOf(randomTile-1), 3);
            accessibleTiles.splice(accessibleTiles.indexOf(randomTile-1+fullMapWidth), 3);

            cc.log(coordinateAtTileIndex(randomTile, fullMapWidth));
        } else {
            i--;
        }
    }

    return {start: startTile, end: endTile, objectLocations: objectRandomTiles};

}

function coordinateAtTileIndex(tileIndex, fullMapWidth) {
    var xTile = tileIndex % fullMapWidth;
    var yTile = parseInt(tileIndex / fullMapWidth);
    return "(" + xTile + "," + yTile + ")";
}