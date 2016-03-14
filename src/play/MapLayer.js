var MapLayer = cc.Layer.extend({
    map: null,
    maps: [],
    tileArray: [], //texture of terrain tiles
    featuresArray: [], //features like trees, rocks, etc. on tiles
    mapWidth: 0,
    mapHeight: 0,
    space: null,

    ctor:function (space) {
        this._super();
        this.space = space;
        this.init();
    },

    init: function () {
        this._super();

        //width == height otherwise the map will not load
        var tiledMapsWide = 1;
        var tiledMapsHigh = 1;
        var totalTiledMaps = tiledMapsWide * tiledMapsHigh;

        //for our map to generate properly, these need to be (a power of 2) + 1
        var tiledMapWidth = 65;
        var tiledMapHeight = 65;
        fullMapWidth = tiledMapWidth * tiledMapsWide;
        fullMapHeight = tiledMapHeight * tiledMapsHigh;
        fullMapTileCount = fullMapWidth * fullMapHeight;

        this.tileArray = new Array(fullMapTileCount);
        this.featuresArray = new Array(fullMapTileCount);
        collisionArray = new Array(fullMapTileCount);

        var terrain = new Terrain(tiledMapWidth);
        terrain.generate(0.7);

        for (i = 0; i < fullMapTileCount; i++) {
            this.featuresArray[i] = 1046; //fill features array with blank transparent tiles
            collisionArray[i] = 0; //fill collision array with 0s (no collision)

            var terrainAsInt = parseInt(terrain.map[i] / 20);

            switch (true) {
                case (terrainAsInt < 0):
                    this.tileArray[i] = 320; //sand
                    break;
                case (terrainAsInt == 0):
                    this.tileArray[i] = 323; //water
                    collisionArray[i] = 1;
                    break;
                case (terrainAsInt == 1):
                    this.tileArray[i] = 320; //sand
                    break;
                case (terrainAsInt == 2):
                    this.tileArray[i] = 191; //grass
                    break;
                case (terrainAsInt == 3):
                    this.tileArray[i] = 326; //earth
                    break;
                case (terrainAsInt > 3):
                    this.tileArray[i] = 191; //grass again
                    break;
                default:
                    console.log(terrainAsInt > 3);
                    console.log(terrainAsInt);

            }
        }

        //console.log("max " + parseInt(Math.max.apply(Math, terrain.map) / 20) + ", min " + parseInt(Math.min.apply(Math, terrain.map) / 20));

        this.smoothTiles(320,323,256,277,279,278,258,257,342,340,300,298,299,341,319,321); //water/sand smoothing
        this.smoothTiles(320,191,253,274,276,275,255,254,339,337,297,295,296,338,316,318); //sand/grass smoothing
        this.smoothTiles(326,191,262,283,285,284,264,263,348,346,306,304,305,347,325,327); //grass/dirt smoothing

        this.varyAndAddFeatures();

        CreateGraph();

        //an array of empty tiled map data arrays
        var tiledMapData = new Array(totalTiledMaps);
        for (var i = 0; i < totalTiledMaps; i++) {
            tiledMapData[i] = [];
        }

        //fill the tiled map data arrays with the proper data from the input array
        for (var j = 0; j < fullMapTileCount; j++) {
            var row = parseInt((j % fullMapWidth) / tiledMapHeight);
            var column = parseInt((j / fullMapHeight) / tiledMapWidth);
            var array = column * tiledMapsWide + row;
            tiledMapData[array].push(this.tileArray[j]);
        }

        var header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<map version=\"1.0\" orientation=\"orthogonal\" renderorder=\"right-down\" width=\"" + tiledMapWidth + "\" height=\"" + tiledMapHeight + "\" tilewidth=\"32\" tileheight=\"32\" nextobjectid=\"1\">\r\n <tileset firstgid=\"1\" name=\"terrain\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"483\" columns=\"21\">\r\n  <image source=\"terrain.jpg\" width=\"672\" height=\"736\"\/>\r\n <\/tileset>\r\n <tileset firstgid=\"484\" name=\"terrain2\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"483\" columns=\"21\">\r\n  <image source=\"terrain2.png\" trans=\"ffffff\" width=\"672\" height=\"736\"\/>\r\n <\/tileset>\r\n <tileset firstgid=\"967\" name=\"terrain3\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"256\" columns=\"16\">\r\n  <image source=\"terrain3.png\" trans=\"ffffff\" width=\"512\" height=\"512\"\/>\r\n <\/tileset>\r\n <layer name=\"Tile Layer 1\" width=\"" + tiledMapWidth + "\" height=\"" + tiledMapHeight + "\">\r\n  <data encoding=\"csv\">\r\n";
        var divider = "<\/data>\r\n <\/layer>\r\n <layer name=\"UpperTerrain\" width=\"" + tiledMapWidth + "\" height=\"" + tiledMapHeight + "\" offsetx=\"448\" offsety=\"251\">\r\n  <data encoding=\"csv\">";
        var footer = "<\/data>\r\n <\/layer>\r\n<\/map>\r\n";
        var mapAsTmxStrings = [];

        //attach headers and footers to our arrays to form tmx strings
        for (var k = 0; k < totalTiledMaps; k++) {
            var mapArrayAsString = tiledMapData[k].toString();
            mapAsTmxStrings.push(header.concat(mapArrayAsString, divider, this.featuresArray.toString(), footer));
        }

        //create tiled map objects
        for (i = 0; i < totalTiledMaps; i++) {
            var map = new cc.TMXTiledMap.create(mapAsTmxStrings[i], "res/map");
            this.maps.push(map);
        }

        this.mapWidth = this.maps[0].getContentSize().width;
        this.mapHeight = this.maps[0].getContentSize().height;

        //set the position of tiled maps in a square grid
        for (i = 0; i < totalTiledMaps; i++) {
            var xPosition = (this.mapWidth * i) % (this.mapWidth * tiledMapsWide);
            var yPosition = this.mapHeight * parseInt(i / tiledMapsHigh);

            this.maps[i].setPosition(cc.p(xPosition, yPosition));
            this.addChild(this.maps[i]);
        }

        //this.map = new cc.TMXTiledMap(res.testmap_tmx);
        //this.addChild(this.map);

        this.scheduleUpdate();
    },

    //the next four functions safely check if an index is on another column or outside the bounds of the map before we use it
    tileLeftOf: function (index) {
        if ((index - 1) % fullMapWidth != fullMapWidth-1) {
            return this.tileArray[index - 1];
        } else {
            return 0;
        }
    },

    tileRightOf: function (index) {
        if ((index + 1) % fullMapWidth != 0) {
            return this.tileArray[index + 1];
        } else {
            return 0;
        }
    },

    tileAbove: function (index) {
        if (index - fullMapWidth >=0) {
            return this.tileArray[index - fullMapWidth];
        } else {
            return 0;
        }
    },

    tileBelow: function (index) {
        if (index + fullMapWidth < fullMapTileCount) {
            return this.tileArray[index + fullMapWidth];
        } else {
            return 0;
        }
    },

    coordinateAtTileIndex: function (tileIndex) {
        var xTile = tileIndex % fullMapWidth;
        var yTile = parseInt(tileIndex / this.fullWidth);

        var xCoordinate = xTile * 32;
        var yCoordinate = yTile * 32;

        console.log("index " + tileIndex + " has coordinate (" + xCoordinate + "," + yCoordinate + ")");
    },

    tileAtCoordinate: function (xCoord, yCoord) {
        var xTile = parseInt(xCoord / 32);
        var yTile = parseInt(fullMapHeight - yCoord / 32);
        console.log("(" + xTile + "," + yTile + ") has index: " + (xTile + yTile * fullMapWidth) + " with tile type " + this.tileArray[(xTile + yTile * fullMapWidth)] + " and collision: " + collisionArray[xTile + yTile * fullMapWidth]);
    },

    /*
    ABOUT THE SMOOTH TILES FUNCTION:
    This function checks for two types of tiles bordering each other and ensures
    by pattern-matching that the visual transition between them is not blocky.
    It does this by substituting in appropriate tiles (provided as parameters).
    This function loops until the number of tile corrections stops decreasing.
    
    p: first tile type
    q: second tile type
    piqs: small p island surrounded by q
    piql: large p island surrounded by q
    pqul: p with q in upper left
    pqur: p with q in upper right
    pqbl: p with q in bottom left
    pqbr: p with q in bottom right
    qpul: q with p in upper left
    qpur: q with p in upper right
    qpbl: q with p in bottom left
    qpbr: q with p in bottom right
    qapb: q above, p below
    qbpa: q below, p above
    qlpr: q left, p right
    qrpl: q right, p left
     */
    
    smoothTiles: function (p, q, piqs, piql, pqul, pqur, pqbl, pqbr, qpul, qpur, qpbl, qpbr, qapb, qbpa, qlpr, qrpl) {
        var corrections = 0;
        var lastCorrections = 0;

        do {
            //console.log("corrections: " + corrections);
            lastCorrections = corrections;
            corrections = 0;

            for (var i = 0; i < fullMapTileCount; i++) {

                //SAND SURROUNDED BY WATER
                if (this.tileArray[i] == p) { //sand tile
                    if (this.tileLeftOf(i) == q || this.tileLeftOf(i) == piql || this.tileLeftOf(i) == qpbl || this.tileLeftOf(i) == qrpl || this.tileLeftOf(i) == qpul) { //water left
                        if (this.tileAbove(i) == q || this.tileAbove(i) == piql || this.tileAbove(i) == qpur || this.tileAbove(i) == qbpa || this.tileAbove(i) == qpul) { //water above
                            if (this.tileRightOf(i) == q || this.tileRightOf(i) == piql || this.tileRightOf(i) == qpbr || this.tileRightOf(i) == qlpr || this.tileRightOf(i) == qpur) { //water right
                                if (this.tileBelow(i) == q || this.tileBelow(i) == piql || this.tileBelow(i) == qpbr || this.tileBelow(i) == qapb || this.tileBelow(i) == qpbl) { //water below
                                    if (this.tileArray[i] != piql) {
                                        this.tileArray[i] = piql;
                                        corrections++;
                                        if (p == 323) {
                                            collisionArray[i] = 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                //SAND WITH WATER IN BOTTOM RIGHT
                if (this.tileRightOf(i) == pqbl || this.tileRightOf(i) == qbpa || this.tileRightOf(i) == qpul) { //sand right on top half
                    if (this.tileBelow(i) == pqur || this.tileBelow(i) == qrpl || this.tileBelow(i) == qpul) { //sand below on left half
                        if (this.tileArray[i] != pqbr) {
                            this.tileArray[i] = pqbr;
                            corrections++;
                            if (p == 323) {
                                collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //SAND WITH WATER IN BOTTOM LEFT
                if (this.tileLeftOf(i) == pqbr || this.tileLeftOf(i) == qpur || this.tileLeftOf(i) == qbpa) { //sand left on top half
                    if (this.tileBelow(i) == pqul || this.tileBelow(i) == qlpr || this.tileBelow(i) == qpur) { //sand below on right half
                        if (this.tileArray[i] != pqbl) {
                            this.tileArray[i] = pqbl;
                            corrections++;
                            if (p == 323) {
                                collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //SAND WITH WATER IN TOP RIGHT
                if (this.tileAbove(i) == pqbr || this.tileAbove(i) == qpbl || this.tileAbove(i) == qrpl) { //sand above on left half
                    if (this.tileRightOf(i) == pqul || this.tileRightOf(i) == qapb || this.tileRightOf(i) == qpbl) { //sand right on bottom half
                        if (this.tileArray[i] != pqur) {
                            this.tileArray[i] = pqur;
                            corrections++;
                            if (p == 323) {
                                collisionArray[i] = 1;
                            }
                        }
                    }
                }


                //SAND WITH WATER IN TOP LEFT
                if (this.tileLeftOf(i) == pqur || this.tileLeftOf(i) == qpbr || this.tileLeftOf(i) == 399) { //sand left in bottom half
                    if (this.tileAbove(i) == pqbl || this.tileAbove(i) == qpbr || this.tileAbove(i) == qlpr) { //sand above on right half
                        if (this.tileArray[i] != pqul) {
                            this.tileArray[i] = pqul;
                            corrections++;
                            if (p == 323) {
                                collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //WATER WITH SAND IN BOTTOM RIGHT
                if (this.tileRightOf(i) == pqul || this.tileRightOf(i) == qapb || this.tileRightOf(i) == qpbl) { //water right on top half
                    if (this.tileBelow(i) == pqul || this.tileBelow(i) == qlpr || this.tileBelow(i) == qpur) { //water below on left half
                        if (this.tileArray[i] != qpbr) {
                            this.tileArray[i] = qpbr;
                            corrections++;
                            if (p == 323) {
                                collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //WATER WITH SAND IN BOTTOM LEFT
                if (this.tileLeftOf(i) == pqur || this.tileLeftOf(i) == qpbr || this.tileLeftOf(i) == qapb) { //water left on top half
                    if (this.tileBelow(i) == pqur || this.tileBelow(i) == qrpl || this.tileBelow(i) == qpul) { //water below in right half
                        if (this.tileArray[i] != qpbl) {
                            this.tileArray[i] = qpbl;
                            corrections++;
                            if (p == 323) {
                                collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //WATER WITH SAND IN TOP RIGHT
                if (this.tileAbove(i) == pqbl || this.tileAbove(i) == qpbr || this.tileAbove(i) == qlpr) { //water above in left half
                    if (this.tileRightOf(i) == pqbl || this.tileRightOf(i) == qbpa || this.tileRightOf(i) == qpul) { //water right in bottom half
                        if (this.tileArray[i] != qpur) {
                            this.tileArray[i] = qpur;
                            corrections++;
                            if (p == 323) {
                                collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //WATER WITH SAND IN TOP LEFT
                if (this.tileLeftOf(i) == pqbr || this.tileLeftOf(i) == qpur || this.tileLeftOf(i) == qbpa) { //water left in bottom half
                    if (this.tileAbove(i) == pqbr || this.tileAbove(i) == qpbl || this.tileAbove(i) == qrpl) { //water above in right half
                        if (this.tileArray[i] != qpul) {
                            this.tileArray[i] = qpul;
                            corrections++;
                            if (p == 323) {
                                collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //WATER ABOVE, SAND BELOW
                if (this.tileAbove(i) == q || this.tileAbove(i) == piql || this.tileAbove(i) == qpur || this.tileAbove(i) == qbpa || this.tileAbove(i) == qpul) { //water above
                    if (this.tileBelow(i) == p || this.tileBelow(i) == qpur) { //sand below
                        if (this.tileArray[i] != qapb) {
                            this.tileArray[i] = qapb;
                            corrections++;
                            if (p == 323) {
                                collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //WATER LEFT, SAND RIGHT
                if (this.tileLeftOf(i) == q || this.tileLeftOf(i) == piql || this.tileLeftOf(i) == qpbl || this.tileLeftOf(i) == qrpl || this.tileLeftOf(i) == qpul) {
                    if (this.tileRightOf(i) == p || this.tileRightOf(i) == qrpl) {
                        if (this.tileArray[i] != qlpr) {
                            this.tileArray[i] = qlpr;
                            corrections++;
                            if (p == 323) {
                                collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //SAND LEFT, WATER RIGHT
                if (this.tileLeftOf(i) == p || this.tileLeftOf(i) == qlpr) {
                    if (this.tileRightOf(i) == q || this.tileRightOf(i) == piql || this.tileRightOf(i) == qpbr || this.tileRightOf(i) == qlpr || this.tileRightOf(i) == qpur) {
                        if (this.tileArray[i] != qrpl) {
                            this.tileArray[i] = qrpl;
                            corrections++;
                            if (p == 323) {
                                collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //SAND ABOVE, WATER BELOW
                if (this.tileAbove(i) == p || this.tileAbove(i) == qapb || this.tileAbove(i) == pqur || this.tileAbove(i) == pqul) {
                    if (this.tileBelow(i) == q || this.tileBelow(i) == piql || this.tileBelow(i) == qpbr || this.tileBelow(i) == qapb || this.tileBelow(i) == qpbl) {
                        if (this.tileArray[i] != qbpa) {
                            this.tileArray[i] = qbpa;
                            corrections++;
                            if (p == 323) {
                                collisionArray[i] = 1;
                            }
                        }
                    }
                }
            }
        } while (corrections != lastCorrections);
    },

    //randomly vary patterns for grass, dirt etc. also place appropriate features on these tiles
    varyAndAddFeatures : function () {
        var terrainSeed;
        var featureSeed;
        for (var d = 0; d < fullMapTileCount; d++) {

            //randomly vary sand texture
            if (this.tileArray[d] == 320) {
                terrainSeed = parseInt(Math.random() * 5);
                switch (terrainSeed) {
                    case 0:
                        this.tileArray[d] = 317;
                        break;
                    case 1:
                        this.tileArray[d] = 320;
                        break;
                    case 2:
                        this.tileArray[d] = 358;
                        break;
                    case 3:
                        this.tileArray[d] = 359;
                        break;
                    case 4:
                        this.tileArray[d] = 360;
                        break;
                    default:
                }

                //randomly place sand features
                featureSeed = parseInt(Math.random() * 40);
                switch (featureSeed) {
                    case 0:
                        this.featuresArray[d] = 994; //big rock
                        collisionArray[d] = 1;
                        break;
                    case 1:
                        this.featuresArray[d] = 995; //small rocks
                        collisionArray[d] = 1;
                        break;
                    case 2:
                        this.featuresArray[d] = 996; //seaweed-y plant
                        collisionArray[d] = 1;
                        break;
                    case 3:
                        this.featuresArray[d] = 1012; //big fern
                        collisionArray[d] = 1;
                        break;
                    case 4:
                        this.featuresArray[d] = 1015; //two ferns
                        break;
                    case 5:
                        this.featuresArray[d] = 1016; //small fern
                        break;
                    default:
                }
            }

            //randomly vary grass texture
            if (this.tileArray[d] == 191) {
                terrainSeed = parseInt(Math.random() * 6);
                switch (terrainSeed) {
                    case 0:
                        this.tileArray[d] = 232;
                        break;
                    case 1:
                        this.tileArray[d] = 233;
                        break;
                    case 2:
                        this.tileArray[d] = 234;
                        break;
                    case 3:
                        this.tileArray[d] = 235;
                        break;
                    case 4:
                        this.tileArray[d] = 236;
                        break;
                    case 5:
                        this.tileArray[d] = 194;
                        break;
                    default:
                }

                //randomly place grass features
                featureSeed = parseInt(Math.random() * 60);
                switch (featureSeed) {
                    case 0:
                        this.featuresArray[d] = 980; //mushroom
                        collisionArray[d] = 1;
                        break;
                    case 1:
                        this.featuresArray[d] = 994; //big rock
                        collisionArray[d] = 1;
                        break;
                    case 2:
                        this.featuresArray[d] = 995; //small rocks
                        collisionArray[d] = 1;
                        break;
                    case 3:
                        this.featuresArray[d] = 1017; //dark fern
                        collisionArray[d] = 1;
                        break;
                    case 4:
                        this.featuresArray[d] = 1018; //scattered leaves
                        break;
                    case 5:
                        this.featuresArray[d] = 1019; //flowers
                        collisionArray[d] = 1;
                        break;
                    case 6:
                        this.featuresArray[d] = 1020; //flowers in bush
                        collisionArray[d] = 1;
                        break;
                    case 7:
                        this.featuresArray[d] = 1021; //tree stump
                        collisionArray[d] = 1;
                        break;
                    case 8:
                        //check that we are not overlapping with other trees
                        if (collisionArray[d] == 0 && collisionArray[d-fullMapWidth] == 0) {
                            this.featuresArray[d] = 1009; //skinny pine tree bottom
                            this.featuresArray[d-fullMapWidth] = 993; //skinny pine tree top
                            collisionArray[d] = 1;
                            collisionArray[d-fullMapWidth] = 1;
                        }
                        break;
                    case 9:
                        if (collisionArray[d] == 0 && collisionArray[d+1] == 0 && collisionArray[d-fullMapWidth] == 0 &&collisionArray[d-fullMapWidth+1] == 0) {
                            this.featuresArray[d] = 1079; //wide pine tree bottom left
                            this.featuresArray[d+1] = 1080; //bottom right
                            this.featuresArray[d-fullMapWidth] = 1063; //top left
                            this.featuresArray[d-fullMapWidth+1] = 1064; //top left
                            collisionArray[d] = 1;
                            collisionArray[d+1] = 1;
                            collisionArray[d-fullMapWidth] = 1;
                            collisionArray[d-fullMapWidth+1] = 1;
                        }
                        break;
                    case 10:
                        if (collisionArray[d] == 0 && collisionArray[d+1] == 0 && collisionArray[d-fullMapWidth] == 0 &&collisionArray[d-fullMapWidth+1] == 0) {
                            this.featuresArray[d] = 1111; //wide leafy tree bottom left
                            this.featuresArray[d+1] = 1112; //bottom right
                            this.featuresArray[d-fullMapWidth] = 1095; //top left
                            this.featuresArray[d-fullMapWidth+1] = 1096; //top left
                            collisionArray[d] = 1;
                            collisionArray[d+1] = 1;
                            collisionArray[d-fullMapWidth] = 1;
                            collisionArray[d-fullMapWidth+1] = 1;
                        }
                        break;
                    default:
                }
            }

            //randomly vary solid dirt texture
            if (this.tileArray[d] == 326) {
                terrainSeed = parseInt(Math.random() * 6);
                switch (terrainSeed) {
                    case 0:
                        this.tileArray[d] = 326;
                        break;
                    case 1:
                        this.tileArray[d] = 389;
                        break;
                    case 2:
                        this.tileArray[d] = 390;
                        break;
                    case 3:
                        this.tileArray[d] = 391;
                        break;
                    case 4:
                        this.tileArray[d] = 392;
                        break;
                    case 5:
                        this.tileArray[d] = 393;
                        break;
                    default:
                }

                //randomly place dirt features
                featureSeed = parseInt(Math.random() * 6);
                switch (featureSeed) {
                    case 0:
                        this.featuresArray[d] = 994; //big rock
                        collisionArray[d] = 1;
                        break;
                    case 1:
                        this.featuresArray[d] = 995; //small rocks
                        collisionArray[d] = 1;
                        break;
                    case 2:
                        this.featuresArray[d] = 1015; //two ferns
                        break;
                    case 3:
                        this.featuresArray[d] = 1018; //scattered leaves
                        break;
                    default:
                }
            }
        }
    }
});