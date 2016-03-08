/**
 * Created by brian on 2/13/16.
 */
var MapLayer = cc.Layer.extend({
    map:null,
    maps:[],
    mapWidth:0,
    mapHeight:0,

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        //width == height otherwise the map will not load
        var tiledMapsWide = 1;
        var tiledMapsHigh = 1;
        var totalTiledMaps = tiledMapsWide * tiledMapsHigh;

        //for our map to generate properly, these need to be a power of 2 + 1
        var tiledMapWidth = 65;
        var tiledMapHeight = 65;
        var fullMapWidth = tiledMapWidth * tiledMapsWide;
        var fullMapHeight = tiledMapHeight * tiledMapsHigh;
        var fullMapTileCount = fullMapWidth * fullMapHeight;

        var inputTileData = new Array(fullMapTileCount);
        var terrain = new Terrain(tiledMapWidth);
        terrain.generate(0.7);
        for (i=0; i<fullMapTileCount; i++) {
            var terrainAsInt = parseInt(terrain.map[i]/20);

            switch (terrainAsInt) {
                case 0:
                    inputTileData[i] = 323;
                    break;
                case 1:
                    inputTileData[i] = 320;
                    break;
                case 2:
                    inputTileData[i] = 191;
                    break;
                case 3:
                    inputTileData[i] = 197;
                    break;
                case 4:
                    inputTileData[i] = 71;
                    break;
                case 5:
                    inputTileData[i] = 65;
                    break;
                case 6:
                    inputTileData[i] = 206;
                    break;
                case 7:
                    inputTileData[i] = 203;
                    break;
                default:
                    inputTileData[i] = 326;
            }
        }
        console.log("max " + parseInt(Math.max.apply(Math, terrain.map)/20) + ", min " + parseInt(Math.min.apply(Math, terrain.map)/20));

        var p;
        var w = 323;
        var s = 320;
        var madeIt = 0;

        for (p=0; p<fullMapTileCount; p++) {

            //SAND SURROUNDED BY WATER
            if (inputTileData[p] == s) { //sand tile
                if (inputTileData[p-1] == w) { //water left
                    if (inputTileData[p-fullMapWidth] == w) { //water above
                        if (inputTileData[p+1] == w) { //water right
                            if (inputTileData[p+fullMapWidth] == w) { //water below
                                inputTileData[p] = 277;
                            }
                        }
                    }
                }
            }

            //SAND WITH WATER IN BOTTOM RIGHT
            if (inputTileData[p-1] == s) { //sand left
                if (inputTileData[p-fullMapWidth] == s) { //sand above
                    if (inputTileData[p+1] == 258 || inputTileData[p+1] == 341 || inputTileData[p+1] == 342) { //sand right on top half
                        if (inputTileData[p+fullMapWidth] == 278 || inputTileData[p+fullMapWidth] == 321 || inputTileData[p+fullMapWidth] == 342) { //sand below on left half
                            inputTileData[p] = 256;
                        }
                    }
                }
            }

            //SAND WITH WATER IN BOTTOM LEFT
            if (inputTileData[p-1] == 257 || inputTileData[p-1] == 340 || inputTileData[p-1] == 341) { //sand left on to half
                if (inputTileData[p-fullMapWidth] == s) { //sand above
                    if (inputTileData[p+1]) { //sand right
                        if (inputTileData[p+fullMapWidth] == 279 || inputTileData[p+fullMapWidth] == 319 || inputTileData[p+fullMapWidth] == 340) { //sand below on right half
                            inputTileData[p] = 257;
                        }
                    }
                }
            }

            //SAND WITH WATER IN TOP RIGHT
            if (inputTileData[p-1] == s) { //sand left
                if (inputTileData[p-fullMapWidth] == 257 || inputTileData[p-fullMapWidth] == 300 || inputTileData[p-fullMapWidth] == 321) { //sand above on left half
                    if (inputTileData[p+1] == 279 || inputTileData[p+1] == 299 || inputTileData[p+1] == 300) { //sand right on bottom half
                        if (inputTileData[p+fullMapWidth] == s) { //sand below
                            inputTileData[p] = 278;
                        }
                    }
                }
            }

            //SAND WITH WATER IN TOP LEFT
            if (inputTileData[p-1] == 278 || inputTileData[p-1] == 298 || inputTileData[p-1] == 399) { //sand left in bottom half
                if (inputTileData[p-fullMapWidth] == 258 || inputTileData[p-fullMapWidth] == 298 || inputTileData[p-fullMapWidth] == 319) { //sand above on right half
                    if (inputTileData[p+1] == s) { //sand right on top half
                        if (inputTileData[p+fullMapWidth] == s) { //sand below on left half
                            inputTileData[p] = 279;
                        }
                    }
                }
            }



        }

        console.log(madeIt);


        //an array of empty tiled map data arrays
        var tiledMapData = new Array(totalTiledMaps);
        for (var i = 0; i<totalTiledMaps; i++) {
            tiledMapData[i] = [];
        }

        //fill the tiled map data arrays with the proper data from the input array
        for (var j=0; j<fullMapTileCount; j++) {
            var row = parseInt((j % fullMapWidth) / tiledMapHeight);
            var column = parseInt((j / fullMapHeight) / tiledMapWidth);
            var array = column * tiledMapsWide + row;
            tiledMapData[array].push(inputTileData[j]);
        }

        var header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<map version=\"1.0\" orientation=\"orthogonal\" renderorder=\"right-down\" width=\"" + tiledMapWidth + "\" height=\"" + tiledMapHeight + "\" tilewidth=\"32\" tileheight=\"32\" nextobjectid=\"1\">\r\n <tileset firstgid=\"1\" name=\"terrain\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"483\" columns=\"21\">\r\n  <image source=\"terrain.jpg\" width=\"672\" height=\"736\"\/>\r\n <tile id=\"322\">\r\n   <objectgroup draworder=\"index\">\r\n    <object id=\"0\" x=\"0.17234\" y=\"0.344679\" width=\"31.5381\" height=\"31.3658\"\/>\r\n   <\/objectgroup>\r\n  <\/tile> <\/tileset>\r\n <layer name=\"Tile Layer 1\" width=\"" + tiledMapWidth + "\" height=\"" + tiledMapHeight + "\">\r\n  <data encoding=\"csv\">\r\n";
        var footer = "<\/data>\r\n <\/layer>\r\n<\/map>\r\n";
        var mapAsTmxStrings = [];

        //attach headers and footers to our arrays to form tmx strings
        for (var k=0; k<totalTiledMaps; k++) {
            var mapArrayAsString = tiledMapData[k].toString();
            mapAsTmxStrings.push(header.concat(mapArrayAsString, footer));
        }

        //create tiled map objects
        for (i=0; i<totalTiledMaps; i++) {
            var map = new cc.TMXTiledMap.create(mapAsTmxStrings[i], "res/map");
            this.maps.push(map);
        }

        this.mapWidth = this.maps[0].getContentSize().width;
        this.mapHeight = this.maps[0].getContentSize().height;

        //set the position of tiled maps in a square grid
        for (i=0; i<totalTiledMaps; i++) {
            var xPosition = (this.mapWidth * i) % (this.mapWidth * tiledMapsWide);
            var yPosition = this.mapHeight * parseInt(i / tiledMapsHigh);

            this.maps[i].setPosition(cc.p(xPosition, yPosition));
            this.addChild(this.maps[i]);
        }

       //this.map = new cc.TMXTiledMap(res.testmap_tmx);
        //this.addChild(this.map);

        this.scheduleUpdate();
    }
});