/**
 * Created by brian on 2/13/16.
 */
var MapLayer = cc.Layer.extend({
    map:null,
    maps:[],
    tileArray:[],
    fullMapTileCount:null,
    fullMapWidth:null,
    fullMapHeight:null,
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
        this.fullMapWidth = tiledMapWidth * tiledMapsWide;
        this.fullMapHeight = tiledMapHeight * tiledMapsHigh;
        this.fullMapTileCount = this.fullMapWidth * this.fullMapHeight;

        this.tileArray = new Array(this.fullMapTileCount);
        var terrain = new Terrain(tiledMapWidth);
        terrain.generate(0.7);
        for (i=0; i<this.fullMapTileCount; i++) {
            var terrainAsInt = parseInt(terrain.map[i]/20);

            switch (terrainAsInt) {
                case 0:
                    this.tileArray[i] = 323;
                    break;
                case 1:
                    this.tileArray[i] = 320;
                    break;
                case 2:
                    this.tileArray[i] = 191;
                    break;
                case 3:
                    this.tileArray[i] = 197;
                    break;
                case 4:
                    this.tileArray[i] = 71;
                    break;
                case 5:
                    this.tileArray[i] = 65;
                    break;
                case 6:
                    this.tileArray[i] = 206;
                    break;
                case 7:
                    this.tileArray[i] = 203;
                    break;
                default:
                    this.tileArray[i] = 326;
            }
        }
        console.log("max " + parseInt(Math.max.apply(Math, terrain.map)/20) + ", min " + parseInt(Math.min.apply(Math, terrain.map)/20));

        var siws = 256; //sand island surrounded by water (small)
        var swbr = 257; //sand with water in bottom right
        var swbl = 258; //sand with water in bottom left
        var siwl = 277; //sand island surrounded by water (large)
        var swur = 278; //sand with water in upper left
        var swul = 279; //sand with water in upper right
        var wsbr = 298; //water with sand in bottom right
        var wasb = 299; //water above sand below
        var wsbl = 300; //water with sand in bottom left
        var wlsr = 319; //water left sand right
        var wrsl = 321; //water right sand left
        var wstp = 340; //water with sand in top right
        var wbsa = 341; //water below sand above
        var wstl = 342; //water with sand in top left

        var w = 323; //water
        var s = 320; //sand

        var corrections = 0;
        var lastCorrections = 0;

        do {
            console.log("corrections: " + corrections);
            lastCorrections = corrections;
            corrections = 0;

            for (var p = 0; p < this.fullMapTileCount; p++) {

                //SAND SURROUNDED BY WATER
                if (this.tileArray[p] == s) { //sand tile
                    if (this.tileArray[p - 1] == w || this.tileArray[p - 1] == siwl || this.tileArray[p - 1] == wsbl || this.tileArray[p - 1] == wrsl || this.tileArray[p - 1] == wstl) { //water left
                        if (this.tileArray[p - this.fullMapWidth] == w || this.tileArray[p - this.fullMapWidth] == siwl || this.tileArray[p - this.fullMapWidth] == wstp || this.tileArray[p - this.fullMapWidth] == wbsa || this.tileArray[p - this.fullMapWidth] == wstl) { //water above
                            if (this.tileArray[p + 1] == w || this.tileArray[p + 1] == siwl || this.tileArray[p + 1] == wsbr || this.tileArray[p + 1] == wlsr || this.tileArray[p + 1] == wstp) { //water right
                                if (this.tileArray[p + this.fullMapWidth] == w || this.tileArray[p + this.fullMapWidth] == siwl || this.tileArray[p + this.fullMapWidth] == wsbr || this.tileArray[p + this.fullMapWidth] == wasb || this.tileArray[p + this.fullMapWidth] == wsbl) { //water below
                                    if (this.tileArray[p] != siwl) {
                                        this.tileArray[p] = siwl;
                                        corrections++;
                                    }
                                }
                            }
                        }
                    }
                }

                //SAND WITH WATER IN BOTTOM RIGHT
                        if (this.tileArray[p + 1] == swbl || this.tileArray[p + 1] == wbsa || this.tileArray[p + 1] == wstl) { //sand right on top half
                            if (this.tileArray[p + this.fullMapWidth] == swur || this.tileArray[p + this.fullMapWidth] == wrsl || this.tileArray[p + this.fullMapWidth] == wstl) { //sand below on left half
                                if (this.tileArray[p] != swbr) {
                                    this.tileArray[p] = swbr;
                                    corrections++;
                                }
                            }
                        }

                //SAND WITH WATER IN BOTTOM LEFT
                if (this.tileArray[p - 1] == swbr || this.tileArray[p - 1] == wstp || this.tileArray[p - 1] == wbsa) { //sand left on top half
                            if (this.tileArray[p + this.fullMapWidth] == swul || this.tileArray[p + this.fullMapWidth] == wlsr || this.tileArray[p + this.fullMapWidth] == wstp) { //sand below on right half
                                if (this.tileArray[p] != swbl) {
                                    this.tileArray[p] = swbl;
                                    corrections++;
                                }
                            }
                }

                //SAND WITH WATER IN TOP RIGHT
                    if (this.tileArray[p - this.fullMapWidth] == swbr || this.tileArray[p - this.fullMapWidth] == wsbl || this.tileArray[p - this.fullMapWidth] == wrsl) { //sand above on left half
                        if (this.tileArray[p + 1] == swul || this.tileArray[p + 1] == wasb || this.tileArray[p + 1] == wsbl) { //sand right on bottom half
                                if (this.tileArray[p] != swur) {
                                    this.tileArray[p] = swur;
                                    corrections++;
                                }
                        }
                    }


                //SAND WITH WATER IN TOP LEFT
                if (this.tileArray[p - 1] == swur || this.tileArray[p - 1] == wsbr || this.tileArray[p - 1] == 399) { //sand left in bottom half
                    if (this.tileArray[p - this.fullMapWidth] == swbl || this.tileArray[p - this.fullMapWidth] == wsbr || this.tileArray[p - this.fullMapWidth] == wlsr) { //sand above on right half
                                if (this.tileArray[p] != swul) {
                                    this.tileArray[p] = swul;
                                    corrections++;
                                }
                    }
                }

                //WATER WITH SAND IN BOTTOM RIGHT
                if (this.tileArray[p - 1] == w || this.tileArray[p - 1] == siwl || this.tileArray[p - 1] == wsbl || this.tileArray[p - 1] == wrsl || this.tileArray[p - 1] == wstl) { //water left
                    if (this.tileArray[p - this.fullMapWidth] == w || this.tileArray[p - this.fullMapWidth] == siwl || this.tileArray[p - this.fullMapWidth] == wstp || this.tileArray[p - this.fullMapWidth] == wbsa || this.tileArray[p - this.fullMapWidth] == wstl) { //water above
                        if (this.tileArray[p + 1] == swul || this.tileArray[p + 1] == wasb || this.tileArray[p + 1] == wsbl) { //water right on top half
                            if (this.tileArray[p + this.fullMapWidth] == swul || this.tileArray[p + this.fullMapWidth] == wlsr || this.tileArray[p + this.fullMapWidth] == wstp) { //water below on left half
                                if (this.tileArray[p] != wsbr) {
                                    this.tileArray[p] = wsbr;
                                    corrections++;
                                }
                            }
                        }
                    }
                }

                //WATER WITH SAND IN BOTTOM LEFT
                if (this.tileArray[p - 1] == swur || this.tileArray[p - 1] == wsbr || this.tileArray[p - 1] == wasb) { //water left on top half
                            if (this.tileArray[p + this.fullMapWidth] == swur || this.tileArray[p + this.fullMapWidth] == wrsl || this.tileArray[p + this.fullMapWidth] == wstl) { //water below in right half
                                if (this.tileArray[p] != wsbl) {
                                    this.tileArray[p] = wsbl;
                                    corrections++;
                                }
                            }
                }

                //WATER WITH SAND IN TOP RIGHT
                    if (this.tileArray[p - this.fullMapWidth] == swbl || this.tileArray[p - this.fullMapWidth] == wsbr || this.tileArray[p - this.fullMapWidth] == wlsr) { //water above in left half
                        if (this.tileArray[p + 1] == swbl || this.tileArray[p + 1] == wbsa || this.tileArray[p + 1] == wstl) { //water right in bottom half
                                if (this.tileArray[p] != wstp) {
                                    this.tileArray[p] = wstp;
                                    corrections++;
                                }
                        }
                    }

                //WATER WITH SAND IN TOP LEFT
                if (this.tileArray[p - 1] == swbr || this.tileArray[p - 1] == wstp || this.tileArray[p - 1] == wbsa) { //water left in bottom half
                    if (this.tileArray[p - this.fullMapWidth] == swbr || this.tileArray[p - this.fullMapWidth] == wsbl || this.tileArray[p - this.fullMapWidth] == wrsl) { //water above in right half
                                if (this.tileArray[p] != wstl) {
                                    this.tileArray[p] = wstl;
                                    corrections++;
                                }
                    }
                }


                //WATER ABOVE, SAND BELOW
                if (this.tileArray[p - this.fullMapWidth] == w || this.tileArray[p - this.fullMapWidth] == siwl || this.tileArray[p - this.fullMapWidth] == wstp || this.tileArray[p - this.fullMapWidth] == wbsa || this.tileArray[p - this.fullMapWidth] == wstl) { //water above
                    if (this.tileArray[p + this.fullMapWidth] == s || this.tileArray[p + this.fullMapWidth] == wstp) { //sand below
                        if (this.tileArray[p] != wasb) {
                            this.tileArray[p] = wasb;
                            corrections++;
                        }
                    }
                }

                //WATER LEFT, SAND RIGHT
                if (this.tileArray[p - 1] == w || this.tileArray[p - 1] == siwl || this.tileArray[p - 1] == wsbl || this.tileArray[p - 1] == wrsl || this.tileArray[p - 1] == wstl) {
                    if (this.tileArray[p + 1] == s || this.tileArray[p + 1] == wrsl) {
                        if (this.tileArray[p] != wlsr) {
                            this.tileArray[p] = wlsr;
                            corrections++;
                        }
                    }
                }

                //SAND LEFT, WATER RIGHT
                if (this.tileArray[p - 1] == s || this.tileArray[p - 1] == wlsr) {
                    if (this.tileArray[p + 1] == w || this.tileArray[p + 1] == siwl || this.tileArray[p + 1] == wsbr || this.tileArray[p + 1] == wlsr || this.tileArray[p + 1] == wstp) {
                        if (this.tileArray[p] != wrsl) {
                            this.tileArray[p] = wrsl;
                            corrections++;
                        }
                    }
                }

                //SAND ABOVE, WATER BELOW
                if (this.tileArray[p - this.fullMapWidth] == s || this.tileArray[p - this.fullMapWidth] == wasb || this.tileArray[p - this.fullMapWidth] == swur || this.tileArray[p - this.fullMapWidth] == swul) {
                    if (this.tileArray[p + this.fullMapWidth] == w || this.tileArray[p + this.fullMapWidth] == siwl || this.tileArray[p + this.fullMapWidth] == wsbr || this.tileArray[p + this.fullMapWidth] == wasb || this.tileArray[p + this.fullMapWidth] == wsbl) {
                        if (this.tileArray[p] != wbsa) {
                            this.tileArray[p] = wbsa;
                            corrections++;
                        }
                    }
                }
            }

        } while (corrections != lastCorrections);

        //RANDOMLY VARY SOLID TILE TEXTURE
        var seed;
        for (var d=0; d<this.fullMapTileCount; d++) {

            //sand
            if (this.tileArray[d] == s) {
                seed = parseInt(Math.random() * 5);

                switch (seed) {
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
            }
        }

        //an array of empty tiled map data arrays
        var tiledMapData = new Array(totalTiledMaps);
        for (var i = 0; i<totalTiledMaps; i++) {
            tiledMapData[i] = [];
        }

        //fill the tiled map data arrays with the proper data from the input array
        for (var j=0; j<this.fullMapTileCount; j++) {
            var row = parseInt((j % this.fullMapWidth) / tiledMapHeight);
            var column = parseInt((j / this.fullMapHeight) / tiledMapWidth);
            var array = column * tiledMapsWide + row;
            tiledMapData[array].push(this.tileArray[j]);
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
    },

    tileAtCoordinate: function (xCoord, yCoord){
        var xTile = parseInt(xCoord/32);
        var yTile = parseInt(this.fullMapHeight - yCoord/32);
        console.log("index at (" + xTile + "," + yTile + ") is: " + (xTile + yTile * this.fullMapWidth) + " with tile: " + this.tileArray[(xTile + yTile * this.fullMapWidth)]);
    }
});