/*
 This function finds the longest shortest path between two points
 on the map. This ensures that the playable map area is not too
 small to be fun.
 */

//traverse the map horizontally and vertically to find 2 tiles in a row to create an edge between
function CreateGraph() {
    var graph = new Graph();
    var lastValue = 0;
    var lastIndex = null;

    //traverse map horizontally
    for (var i=0; i<fullMapTileCount; i+=fullMapWidth) {
        for (var j=0; j<fullMapWidth; j++) {
            if (collisionArray[i+j] == 1 && lastValue == 1) {
                graph.addEdge((i+j), lastIndex);
            }
            lastValue = collisionArray[i+j];
            lastIndex = i+j;
        }
    }

    //traverse map vertically
    for (i=0; i<fullMapWidth; i++) {
        for (j=0; j<fullMapTileCount; j+=fullMapWidth) {
            if (collisionArray[i+j] && lastValue == 1) {
                graph.addEdge((i+j), lastIndex);
            }
            lastValue = collisionArray[i+j];
            lastIndex = i+j;
        }
    }

    //initialize an array of distances between first tile and second tile to maxmimum values (fullMapTileCount)
    var minimumDistance = new Array(fullMapTileCount);
    for (i=0; i < fullMapTileCount; i++) {
        minimumDistance[i] = new Array(fullMapTileCount);
        for (j=0; j<fullMapTileCount; j++) {
            minimumDistance[i][j] = fullMapTileCount;
        }
    }

    //Floyd-Warshall algorithm
    for (node in graph.nodes) {
        minimumDistance[node][node] = 0;
    }
    for (edge in graph.edges) {
        minimumDistance[edge.source][edge.target] = 1;
        console.log(edge.source + edge.target);
    }
}