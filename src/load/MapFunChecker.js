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

    //we want to run BFS from every vertex in the graph, and keep track of the longest distance
    //console.log("Nodes: " + graph.nodes);
    var minimumDistance = new Array(graph.nodes.length);

    for (startNode in graph.nodes) {
        minimumDistance[startNode] = new Array(graph.nodes.length);

        for (endNode in graph.nodes) {
            minimumDistance[startNode][endNode] = Infinity;
        }

        var queue = [];
        minimumDistance[startNode][startNode] = 0;
        queue.push(startNode);

        while (queue.length == 0){
            var current = queue.shift();

            startNode.edges.forEach(function (edge) {
                var endNode = (startNode === target) ? edge.source : edge.target; //get source or target depending on what startNode is
                if (minimumDistance[startNode][endNode] != Infinity) {
                    minimumDistance[startNode][endNode] = minimumDistance[startNode][current] + 1;
                    queue.push(endNode);
                }
            })
        }
    }

    var maxDistance = 0;

    for (distanceFromStart in minimumDistance) {
        for (distance in distanceFromStart) {
            if (distance > maxDistance) {
                maxDistance = distance;
            }
            //console.log(maxDistance);
        }
    }
    //console.log(minimumDistance[0]);

/*
    //Floyd-Warshall algorithm
    for (node in graph.nodes) {
        minimumDistance[node][node] = 0;
    }
    for (edge in graph.edges) {
        minimumDistance[graph.edges[edge].source.id][graph.edges[edge].target.id] = 1;
    }
    for (var k=0; k<fullMapTileCount; k++) {
        for (i=0; i<fullMapTileCount; i++) {
            for (j=0; j<fullMapTileCount; j++) {
                if (minimumDistance[i][j] > (minimumDistance[i][k] + minimumDistance[k][j])) {
                    minimumDistance[i][j] = (minimumDistance[i][k] + minimumDistance[k][j]);
                }
            }
        }
        console.log(k);
    }
    console.log("done");*/
}