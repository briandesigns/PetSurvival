/*
 This function finds the longest shortest path between two points
 on the map. This ensures that the playable map area is not too
 small to be fun.
 */

//traverse the map horizontally and vertically to find 2 tiles in a row to create an edge between
function CreateGraph(fullMapTileCount, fullMapWidth, collisionArray) {

    //Build an array that keeps track of accessible tiles from the tile at the array's index
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

    //Pick some at random
    var chosenRandomTiles = [];
    var numberOfRandomTiles = 10;
    for (i=0; i<numberOfRandomTiles; i++) {
        chosenRandomTiles.push(validStartTiles[parseInt(Math.random()*validStartTiles.length)]);
    }
    //cc.log("Random tiles chosen: " + chosenRandomTiles);

    var testTile = 0;
    var distance = new Array(fullMapTileCount);

    for (i=0; i<distance.length; i++) {
        distance[i] = Infinity;
    }

    var queue = [];
    distance[testTile] = 0;
    queue.push(testTile);

    while (queue.length > 0) {
        var current = queue.shift();
        console.log("Dequeued " + current + " with edges " + edgesFrom[current]);
        console.log("[" + queue + "]");

        for (i=0; i<edgesFrom[current].length; i++) {
            //console.log("i is " + i);
            var next = edgesFrom[current][i];
            //console.log("Picked " + next + " with edges " + edgesFrom[next]);

            if (distance[next] == Infinity) {
                distance[next] = distance[current] + 1;
                console.log(next + " has distance: " + distance[next]);
                //remove edge from each edge array
                edgesFrom[current].splice(edgesFrom[current].indexOf(next), 1);
                edgesFrom[next].splice(edgesFrom[next].indexOf(current), 1);
                i--;
                queue.push(next);
                console.log("Enqueued " + next);
                console.log("[" + queue + "]");
            }
        }
    }

/*
    var minimumDistance = new Array(graph.nodes.length);

    for (var startNode in graph.nodes) {
        minimumDistance[startNode.id] = new Array(graph.nodes.length);

        for (var endNode in graph.nodes) {
            minimumDistance[startNode.id][endNode.id] = Infinity;
        }

        for (var endNode in graph.nodes) {
            var queue = [];
            minimumDistance[startNode.id][endNode.id] = 0;
            queue.push(graph.nodes[endNode]);
            while (queue.length > 0) {
                var current = queue.shift();
                //console.log("Dequeued node " + current.id + " from queue which now has length " + queue.length);
                current.edges.forEach(function (edge) {
                    var nextNode = (current === edge.target) ? edge.source : edge.target;
                    //console.log("Found next node " + nextNode.id);
                    if (minimumDistance[startNode.id][nextNode.id] == Infinity) {
                        minimumDistance[startNode.id][nextNode.id] = minimumDistance[startNode][current.id] + 1;
                        //console.log("Distance: " + (minimumDistance[startNode][current.id] + 1));
                        queue.push(nextNode);
                        //console.log("Added node " + nextNode.id + " to queue which now has length " + queue.length);
                    }
                });
            }
        }
    }

    console.log(minimumDistance[0][0]);

    var max = 0;
    for (i=0; i<; i++) {
        for (j=0; j<minimumDistance.length; j++) {
            if (minimumDistance[i][j] > max) {
                max = minimumDistance[i][j];
                console.log(maxDistance);
            }
        }
    }*/
/*
    for (i=0; i<distance.length; i++) {
        console.log(distance[i]);
    }*/

    //we want to run BFS from every vertex in the graph, and keep track of the longest distance
/*
    for (startNode in graph.nodes) {
        minimumDistance[startNode] = new Array(graph.nodes.length);

        for (endNode in graph.nodes) {
            minimumDistance[startNode][endNode] = Infinity;
        }

        var queue = [];
        minimumDistance[startNode][startNode] = 0;
        queue.push(startNode);

        while (queue.length != 0){
            var current = queue.shift();

            startNode.edges.forEach(function(edge) {
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
*/
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