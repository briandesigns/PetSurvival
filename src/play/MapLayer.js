/**
 * layer containing all map elements like tiles and trees
 */

var MapLayer = cc.Layer.extend({
    collisionArray: null, //tiles that the user can't walk over because of trees, etc.
    terrainArray: null, //terrain texture at a tile
    featuresArray: null, //features like rocks, trees, at a tile
    mapAsTmxStrings: null, //string representation of tiled maps
    tiledMapsWide: null, //number of tiled maps stacked widthwise
    tiledMapsHigh: null, //number of tiled maps stacked heightwise
    totalTiledMaps: null, //total number of tiled maps
    tiledMapWidth: null, //width of each tiled map
    tiledMapHeight: null, //height of each tiled map
    fullMapWidth: null, //full width of map in tiles
    fullMapHeight: null, //full height of map in tiles
    fullMapTileCount: null, //total number of tiles in overall map
    space: null,

    /**
     * constructor
     * @param space
     * @param mapAsTmxStrings
     * @param collisionArray
     * @param tiledMapsWide
     * @param tiledMapsHigh
     * @param totalTiledMaps
     * @param tiledMapWidth
     * @param tiledMapHeight
     */
    ctor:function (space, mapAsTmxStrings, collisionArray, tiledMapsWide, tiledMapsHigh, totalTiledMaps, tiledMapWidth, tiledMapHeight) {
        this._super();
        this.space = space;
        //width == height otherwise the map will not load
        this.tiledMapsWide = tiledMapsWide;
        this.tiledMapsHigh = tiledMapsHigh;
        this.totalTiledMaps = this.tiledMapsWide * this.tiledMapsHigh;

        //for our map to generate properly, these need to be (a power of 2) + 1
        this.tiledMapWidth = tiledMapWidth;
        this.tiledMapHeight = tiledMapHeight;
        this.fullMapWidth = this.tiledMapWidth * this.tiledMapsWide;
        this.fullMapHeight = this.tiledMapHeight * this.tiledMapsHigh;
        this.fullMapTileCount = this.fullMapWidth * this.fullMapHeight;

        this.mapAsTmxStrings = mapAsTmxStrings;
        this.collisionArray = collisionArray;
        this.init();
    },

    /**
     * post constructor initiation
     */
    init: function () {
        this._super();

        if (this.mapAsTmxStrings == null) {
            this.createNewMap();
        }

        //create tiled map objects
        var maps = [];
        for (var i = 0; i < this.totalTiledMaps; i++) {
            var map = new cc.TMXTiledMap.create(this.mapAsTmxStrings[i], "res/map");
            maps.push(map);
        }

        this.mapWidth = maps[0].getContentSize().width;
        this.mapHeight = maps[0].getContentSize().height;

        //set the position of tiled maps in a square grid
        for (i = 0; i < this.totalTiledMaps; i++) {
            var xPosition = (this.mapWidth * i) % (this.mapWidth * this.tiledMapsWide);
            var yPosition = this.mapHeight * (this.tiledMapsHigh - 1 - parseInt(i / this.tiledMapsHigh));

            maps[i].setPosition(cc.p(xPosition, yPosition));
            this.addChild(maps[i]);
        }

        this.scheduleUpdate();
    },


    createNewMap: function () {
        // Size map based on player setting
        if (chosenMapSize == MAP_SIZE.small) {
            this.tiledMapsWide = 1;
            this.tiledMapsHigh = 1;
            this.tiledMapWidth = 17;
            this.tiledMapHeight = 17;
        } else if (chosenMapSize == MAP_SIZE.medium) {
            this.tiledMapsWide = 1;
            this.tiledMapsHigh = 1;
            this.tiledMapWidth = 33;
            this.tiledMapHeight = 33;
        } else if (chosenMapSize == MAP_SIZE.big) {
            this.tiledMapsWide = 1;
            this.tiledMapsHigh = 1;
            this.tiledMapWidth = 65;
            this.tiledMapHeight = 65;
        }

        // Calculate value of map variables based on input
        this.totalTiledMaps = this.tiledMapsWide * this.tiledMapsHigh;
        this.fullMapWidth = this.tiledMapWidth * this.tiledMapsWide;
        this.fullMapHeight = this.tiledMapHeight * this.tiledMapsHigh;
        this.fullMapTileCount = this.fullMapWidth * this.fullMapHeight;

        this.terrainArray = new Array(this.fullMapTileCount);
        this.featuresArray = new Array(this.fullMapTileCount);
        this.collisionArray = new Array(this.fullMapTileCount);

        // Get the diamond square array
        var diamondSquare = new DiamondSquare(this.fullMapWidth);
        diamondSquare.generate(0.7);

        for (i = 0; i < this.fullMapTileCount; i++) {
            this.featuresArray[i] = 1046; //fill features array with blank transparent tiles
            this.collisionArray[i] = 0; //fill collision array with 0s (no collision)

            // Divide the result of diamond square to give less water tiles if the map is small
            var divisor = 0;
            if (chosenMapSize == MAP_SIZE.small) {
                divisor = 3;
            } else if (chosenMapSize == MAP_SIZE.medium) {
                divisor = 10;
            } else if (chosenMapSize == MAP_SIZE.big) {
                divisor = 20;
            }

            // Set tile terrain based on diamond square array value
            var terrainAsInt = parseInt(diamondSquare.map[i] / divisor);
            
            switch (true) {
                case (terrainAsInt < 0):
                    this.terrainArray[i] = 320; //sand
                    break;
                case (terrainAsInt == 0):
                    this.terrainArray[i] = 323; //water
                    this.collisionArray[i] = 1;
                    break;
                case (terrainAsInt == 1):
                    this.terrainArray[i] = 320; //sand
                    break;
                case (terrainAsInt == 2):
                    this.terrainArray[i] = 191; //grass
                    break;
                case (terrainAsInt == 3):
                    this.terrainArray[i] = 326; //earth
                    break;
                case (terrainAsInt > 3):
                    this.terrainArray[i] = 191; //grass again
                    break;
            }
        }
        
        this.smoothTiles(320,323,256,277,279,278,258,257,342,340,300,298,299,341,319,321); //water/sand smoothing
        this.smoothTiles(320,191,253,274,276,275,255,254,339,337,297,295,296,338,316,318); //sand/grass smoothing
        this.smoothTiles(326,191,262,283,285,284,264,263,348,346,306,304,305,347,325,327); //grass/dirt smoothing

        this.varyAndAddFeatures();

        //an array of empty tiled map data arrays
        var tiledMapData = new Array(this.totalTiledMaps);
        for (var i = 0; i < this.totalTiledMaps; i++) {
            tiledMapData[i] = [];
        }

        //fill the tiled map data arrays with the proper data from the input array
        for (var j = 0; j < this.fullMapTileCount; j++) {
            var row = parseInt((j % this.fullMapWidth) / this.tiledMapHeight);
            var column = parseInt((j / this.fullMapHeight) / this.tiledMapWidth);
            var array = column * this.tiledMapsWide + row;
            tiledMapData[array].push(this.terrainArray[j]);
        }

        var header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<map version=\"1.0\" orientation=\"orthogonal\" renderorder=\"right-down\" width=\"" + this.tiledMapWidth + "\" height=\"" + this.tiledMapHeight + "\" tilewidth=\"32\" tileheight=\"32\" nextobjectid=\"1\">\r\n <tileset firstgid=\"1\" name=\"terrain\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"483\" columns=\"21\">\r\n  <image source=\"terrain.jpg\" width=\"672\" height=\"736\"\/>\r\n <\/tileset>\r\n <tileset firstgid=\"484\" name=\"terrain2\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"483\" columns=\"21\">\r\n  <image source=\"terrain2.png\" trans=\"ffffff\" width=\"672\" height=\"736\"\/>\r\n <\/tileset>\r\n <tileset firstgid=\"967\" name=\"terrain3\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"256\" columns=\"16\">\r\n  <image source=\"terrain3.png\" trans=\"ffffff\" width=\"512\" height=\"512\"\/>\r\n <\/tileset>\r\n <layer name=\"Tile Layer 1\" width=\"" + this.tiledMapWidth + "\" height=\"" + this.tiledMapHeight + "\">\r\n  <data encoding=\"csv\">\r\n";
        var divider = "<\/data>\r\n <\/layer>\r\n <layer name=\"UpperTerrain\" width=\"" + this.tiledMapWidth + "\" height=\"" + this.tiledMapHeight + "\" offsetx=\"448\" offsety=\"251\">\r\n  <data encoding=\"csv\">";
        var footer = "<\/data>\r\n <\/layer>\r\n<\/map>\r\n";

        //attach headers and footers to our arrays to form tmx strings
        this.mapAsTmxStrings = [];
        for (var k = 0; k < this.totalTiledMaps; k++) {
            var mapArrayAsString = tiledMapData[k].toString();
            this.mapAsTmxStrings.push(header.concat(mapArrayAsString, divider, this.featuresArray.toString(), footer));
        }
    },

    //the next four functions safely check if an index is on another column or outside the bounds of the map before we use it
    tileLeftOf: function (index) {
        if ((index - 1) % this.fullMapWidth != this.fullMapWidth-1) {
            return this.terrainArray[index - 1];
        } else {
            return 0;
        }
    },

    tileRightOf: function (index) {
        if ((index + 1) % this.fullMapWidth != 0) {
            return this.terrainArray[index + 1];
        } else {
            return 0;
        }
    },

    tileAbove: function (index) {
        if (index - this.fullMapWidth >=0) {
            return this.terrainArray[index - this.fullMapWidth];
        } else {
            return 0;
        }
    },

    tileBelow: function (index) {
        if (index + this.fullMapWidth < this.fullMapTileCount) {
            return this.terrainArray[index + this.fullMapWidth];
        } else {
            return 0;
        }
    },

    coordinateAtTileIndex: function (tileIndex) {
        var xTile = tileIndex % this.fullMapWidth;
        var yTile = parseInt(tileIndex / this.fullMapWidth);

        var xCoordinate = xTile * 32;
        var yCoordinate = this.fullMapHeight*32-((yTile+1) * 32);

        return {x:xCoordinate, y:yCoordinate};
    },

    tileAtCoordinate: function (xCoord, yCoord) {
        var xTile = parseInt(xCoord / 32);
        var yTile = parseInt(this.fullMapHeight - yCoord / 32);
        console.log("(" + xTile + "," + yTile + ") has index: " + (xTile + yTile * this.fullMapWidth) + " with tile type " + this.terrainArray[(xTile + yTile * this.fullMapWidth)] + " and collision: " + this.collisionArray[xTile + yTile * this.fullMapWidth]);
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

            for (var i = 0; i < this.fullMapTileCount; i++) {

                //p SURROUNDED BY q
                if (this.terrainArray[i] == p) { //p tile
                    if (this.tileLeftOf(i) == q || this.tileLeftOf(i) == piql || this.tileLeftOf(i) == qpbl || this.tileLeftOf(i) == qrpl || this.tileLeftOf(i) == qpul) { //q left
                        if (this.tileAbove(i) == q || this.tileAbove(i) == piql || this.tileAbove(i) == qpur || this.tileAbove(i) == qbpa || this.tileAbove(i) == qpul) { //q above
                            if (this.tileRightOf(i) == q || this.tileRightOf(i) == piql || this.tileRightOf(i) == qpbr || this.tileRightOf(i) == qlpr || this.tileRightOf(i) == qpur) { //q right
                                if (this.tileBelow(i) == q || this.tileBelow(i) == piql || this.tileBelow(i) == qpbr || this.tileBelow(i) == qapb || this.tileBelow(i) == qpbl) { //q below
                                    if (this.terrainArray[i] != piql) {
                                        this.terrainArray[i] = piql;
                                        corrections++;
                                        if (q == 323) {
                                            this.collisionArray[i] = 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                //p WITH q IN BOTTOM RIGHT
                if (this.tileRightOf(i) == pqbl || this.tileRightOf(i) == qbpa || this.tileRightOf(i) == qpul) { //p right on top half
                    if (this.tileBelow(i) == pqur || this.tileBelow(i) == qrpl || this.tileBelow(i) == qpul) { //p below on left half
                        if (this.terrainArray[i] != pqbr) {
                            this.terrainArray[i] = pqbr;
                            corrections++;
                            if (q == 323) {
                                this.collisionArray[i] = 0;
                            }
                        }
                    }
                }

                //p WITH q IN BOTTOM LEFT
                if (this.tileLeftOf(i) == pqbr || this.tileLeftOf(i) == qpur || this.tileLeftOf(i) == qbpa) { //p left on top half
                    if (this.tileBelow(i) == pqul || this.tileBelow(i) == qlpr || this.tileBelow(i) == qpur) { //p below on right half
                        if (this.terrainArray[i] != pqbl) {
                            this.terrainArray[i] = pqbl;
                            corrections++;
                            if (q == 323) {
                                this.collisionArray[i] = 0;
                            }
                        }
                    }
                }

                //p WITH q IN TOP RIGHT
                if (this.tileAbove(i) == pqbr || this.tileAbove(i) == qpbl || this.tileAbove(i) == qrpl) { //p above on left half
                    if (this.tileRightOf(i) == pqul || this.tileRightOf(i) == qapb || this.tileRightOf(i) == qpbl) { //p right on bottom half
                        if (this.terrainArray[i] != pqur) {
                            this.terrainArray[i] = pqur;
                            corrections++;
                            if (q == 323) {
                                this.collisionArray[i] = 0;
                            }
                        }
                    }
                }


                //p WITH q IN TOP LEFT
                if (this.tileLeftOf(i) == pqur || this.tileLeftOf(i) == qpbr || this.tileLeftOf(i) == 399) { //p left in bottom half
                    if (this.tileAbove(i) == pqbl || this.tileAbove(i) == qpbr || this.tileAbove(i) == qlpr) { //p above on right half
                        if (this.terrainArray[i] != pqul) {
                            this.terrainArray[i] = pqul;
                            corrections++;
                            if (q == 323) {
                                this.collisionArray[i] = 0;
                            }
                        }
                    }
                }

                //q WITH p IN BOTTOM RIGHT
                if (this.tileRightOf(i) == pqul || this.tileRightOf(i) == qapb || this.tileRightOf(i) == qpbl) { //q right on top half
                    if (this.tileBelow(i) == pqul || this.tileBelow(i) == qlpr || this.tileBelow(i) == qpur) { //q below on left half
                        if (this.terrainArray[i] != qpbr) {
                            this.terrainArray[i] = qpbr;
                            corrections++;
                            if (q == 323) {
                                this.collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //q WITH p IN BOTTOM LEFT
                if (this.tileLeftOf(i) == pqur || this.tileLeftOf(i) == qpbr || this.tileLeftOf(i) == qapb) { //q left on top half
                    if (this.tileBelow(i) == pqur || this.tileBelow(i) == qrpl || this.tileBelow(i) == qpul) { //q below in right half
                        if (this.terrainArray[i] != qpbl) {
                            this.terrainArray[i] = qpbl;
                            corrections++;
                            if (q == 323) {
                                this.collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //q WITH p IN TOP RIGHT
                if (this.tileAbove(i) == pqbl || this.tileAbove(i) == qpbr || this.tileAbove(i) == qlpr) { //q above in left half
                    if (this.tileRightOf(i) == pqbl || this.tileRightOf(i) == qbpa || this.tileRightOf(i) == qpul) { //q right in bottom half
                        if (this.terrainArray[i] != qpur) {
                            this.terrainArray[i] = qpur;
                            corrections++;
                            if (q == 323) {
                                this.collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //q WITH p IN TOP LEFT
                if (this.tileLeftOf(i) == pqbr || this.tileLeftOf(i) == qpur || this.tileLeftOf(i) == qbpa) { //q left in bottom half
                    if (this.tileAbove(i) == pqbr || this.tileAbove(i) == qpbl || this.tileAbove(i) == qrpl) { //q above in right half
                        if (this.terrainArray[i] != qpul) {
                            this.terrainArray[i] = qpul;
                            corrections++;
                            if (q == 323) {
                                this.collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //q ABOVE, p BELOW
                if (this.tileAbove(i) == q || this.tileAbove(i) == piql || this.tileAbove(i) == qpur || this.tileAbove(i) == qbpa || this.tileAbove(i) == qpul) { //q above
                    if (this.tileBelow(i) == p || this.tileBelow(i) == qpur) { //p below
                        if (this.terrainArray[i] != qapb) {
                            this.terrainArray[i] = qapb;
                            corrections++;
                            if (q == 323) {
                                this.collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //q LEFT, p RIGHT
                if (this.tileLeftOf(i) == q || this.tileLeftOf(i) == piql || this.tileLeftOf(i) == qpbl || this.tileLeftOf(i) == qrpl || this.tileLeftOf(i) == qpul) {
                    if (this.tileRightOf(i) == p || this.tileRightOf(i) == qrpl) {
                        if (this.terrainArray[i] != qlpr) {
                            this.terrainArray[i] = qlpr;
                            corrections++;
                            if (q == 323) {
                                this.collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //p LEFT, q RIGHT
                if (this.tileLeftOf(i) == p || this.tileLeftOf(i) == qlpr) {
                    if (this.tileRightOf(i) == q || this.tileRightOf(i) == piql || this.tileRightOf(i) == qpbr || this.tileRightOf(i) == qlpr || this.tileRightOf(i) == qpur) {
                        if (this.terrainArray[i] != qrpl) {
                            this.terrainArray[i] = qrpl;
                            corrections++;
                            if (q == 323) {
                                this.collisionArray[i] = 1;
                            }
                        }
                    }
                }

                //p ABOVE, q BELOW
                if (this.tileAbove(i) == p || this.tileAbove(i) == qapb || this.tileAbove(i) == pqur || this.tileAbove(i) == pqul) {
                    if (this.tileBelow(i) == q || this.tileBelow(i) == piql || this.tileBelow(i) == qpbr || this.tileBelow(i) == qapb || this.tileBelow(i) == qpbl) {
                        if (this.terrainArray[i] != qbpa) {
                            this.terrainArray[i] = qbpa;
                            corrections++;
                            if (q == 323) {
                                this.collisionArray[i] = 1;
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
        for (var d = 0; d < this.fullMapTileCount; d++) {

            //randomly vary sand texture
            if (this.terrainArray[d] == 320) {
                terrainSeed = parseInt(Math.random() * 5);
                switch (terrainSeed) {
                    case 0:
                        this.terrainArray[d] = 317;
                        break;
                    case 1:
                        this.terrainArray[d] = 320;
                        break;
                    case 2:
                        this.terrainArray[d] = 358;
                        break;
                    case 3:
                        this.terrainArray[d] = 359;
                        break;
                    case 4:
                        this.terrainArray[d] = 360;
                        break;
                    default:
                }

                //randomly place sand features
                featureSeed = parseInt(Math.random() * 40);
                switch (featureSeed) {
                    case 0:
                        this.featuresArray[d] = 994; //big rock
                        this.collisionArray[d] = 1;
                        break;
                    case 1:
                        this.featuresArray[d] = 995; //small rocks
                        this.collisionArray[d] = 1;
                        break;
                    case 2:
                        this.featuresArray[d] = 996; //seaweed-y plant
                        this.collisionArray[d] = 1;
                        break;
                    case 3:
                        this.featuresArray[d] = 1012; //big fern
                        this.collisionArray[d] = 1;
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
            if (this.terrainArray[d] == 191) {
                terrainSeed = parseInt(Math.random() * 6);
                switch (terrainSeed) {
                    case 0:
                        this.terrainArray[d] = 232;
                        break;
                    case 1:
                        this.terrainArray[d] = 233;
                        break;
                    case 2:
                        this.terrainArray[d] = 234;
                        break;
                    case 3:
                        this.terrainArray[d] = 235;
                        break;
                    case 4:
                        this.terrainArray[d] = 236;
                        break;
                    case 5:
                        this.terrainArray[d] = 194;
                        break;
                    default:
                }

                //randomly place grass features
                featureSeed = parseInt(Math.random() * 60);
                switch (featureSeed) {
                    case 0:
                        this.featuresArray[d] = 980; //mushroom
                        this.collisionArray[d] = 1;
                        break;
                    case 1:
                        this.featuresArray[d] = 994; //big rock
                        this.collisionArray[d] = 1;
                        break;
                    case 2:
                        this.featuresArray[d] = 995; //small rocks
                        this.collisionArray[d] = 1;
                        break;
                    case 3:
                        this.featuresArray[d] = 1017; //dark fern
                        this.collisionArray[d] = 1;
                        break;
                    case 4:
                        this.featuresArray[d] = 1018; //scattered leaves
                        break;
                    case 5:
                        this.featuresArray[d] = 1019; //flowers
                        this.collisionArray[d] = 1;
                        break;
                    case 6:
                        this.featuresArray[d] = 1020; //flowers in bush
                        this.collisionArray[d] = 1;
                        break;
                    case 7:
                        this.featuresArray[d] = 1021; //tree stump
                        this.collisionArray[d] = 1;
                        break;
                    case 8:
                        //check that we are not overlapping with other trees
                        if (this.collisionArray[d] == 0 && this.collisionArray[d-this.fullMapWidth] == 0) {
                            this.featuresArray[d] = 1009; //skinny pine tree bottom
                            this.featuresArray[d-this.fullMapWidth] = 993; //skinny pine tree top
                            this.collisionArray[d] = 1;
                            this.collisionArray[d-this.fullMapWidth] = 1;
                        }
                        break;
                    case 9:
                        if (this.collisionArray[d-1] == 0 && this.collisionArray[d] == 0 && this.collisionArray[d-this.fullMapWidth-1] == 0 &&this.collisionArray[d-this.fullMapWidth] == 0) {
                            this.featuresArray[d-1] = 1079; //wide pine tree bottom left
                            this.featuresArray[d] = 1080; //bottom right
                            this.featuresArray[d-this.fullMapWidth-1] = 1063; //top left
                            this.featuresArray[d-this.fullMapWidth] = 1064; //top left
                            this.collisionArray[d-1] = 1;
                            this.collisionArray[d] = 1;
                            this.collisionArray[d-this.fullMapWidth-1] = 1;
                            this.collisionArray[d-this.fullMapWidth] = 1;
                        }
                        break;
                    case 10:
                        if (this.collisionArray[d-1] == 0 && this.collisionArray[d] == 0 && this.collisionArray[d-this.fullMapWidth-1] == 0 &&this.collisionArray[d-this.fullMapWidth] == 0) {
                            this.featuresArray[d-1] = 1111; //wide leafy tree bottom left
                            this.featuresArray[d] = 1112; //bottom right
                            this.featuresArray[d-this.fullMapWidth-1] = 1095; //top left
                            this.featuresArray[d-this.fullMapWidth] = 1096; //top left
                            this.collisionArray[d-1] = 1;
                            this.collisionArray[d] = 1;
                            this.collisionArray[d-this.fullMapWidth-1] = 1;
                            this.collisionArray[d-this.fullMapWidth] = 1;
                        }
                        break;
                    default:
                }
            }

            //randomly vary solid dirt texture
            if (this.terrainArray[d] == 326) {
                terrainSeed = parseInt(Math.random() * 6);
                switch (terrainSeed) {
                    case 0:
                        this.terrainArray[d] = 326;
                        break;
                    case 1:
                        this.terrainArray[d] = 389;
                        break;
                    case 2:
                        this.terrainArray[d] = 390;
                        break;
                    case 3:
                        this.terrainArray[d] = 391;
                        break;
                    case 4:
                        this.terrainArray[d] = 392;
                        break;
                    case 5:
                        this.terrainArray[d] = 393;
                        break;
                    default:
                }

                //randomly place dirt features
                featureSeed = parseInt(Math.random() * 6);
                switch (featureSeed) {
                    case 0:
                        this.featuresArray[d] = 994; //big rock
                        this.collisionArray[d] = 1;
                        break;
                    case 1:
                        this.featuresArray[d] = 995; //small rocks
                        this.collisionArray[d] = 1;
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