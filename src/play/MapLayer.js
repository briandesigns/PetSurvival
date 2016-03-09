/**
 * Created by brian on 2/13/16.
 */
var MapLayer = cc.Layer.extend({

    map: null,
    maps: [],
    tileArray: [],
    fullMapTileCount: null,
    fullMapWidth: null,
    fullMapHeight: null,
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

        //for our map to generate properly, these need to be a power of 2 + 1
        var tiledMapWidth = 65;
        var tiledMapHeight = 65;
        this.fullMapWidth = tiledMapWidth * tiledMapsWide;
        this.fullMapHeight = tiledMapHeight * tiledMapsHigh;
        this.fullMapTileCount = this.fullMapWidth * this.fullMapHeight;

        this.tileArray = new Array(this.fullMapTileCount);
        var terrain = new Terrain(tiledMapWidth);
        terrain.generate(0.7);
        for (i = 0; i < this.fullMapTileCount; i++) {
            var terrainAsInt = parseInt(terrain.map[i] / 20);

            switch (terrainAsInt) {
                case (terrainAsInt < 0):
                    this.tileArray[i] = 320; //sand
                    break;
                case 0:
                    this.tileArray[i] = 323; //water
                    break;
                case 1:
                    this.tileArray[i] = 320; //sand
                    break;
                case 2:
                    this.tileArray[i] = 191; //grass
                    break;
                case 3:
                    this.tileArray[i] = 326; //earth
                    break;
                case (terrainAsInt > 3):
                    this.tileArray[i] = 191;
                    break;
                default:
            }
        }
        console.log("max " + parseInt(Math.max.apply(Math, terrain.map) / 20) + ", min " + parseInt(Math.min.apply(Math, terrain.map) / 20));
        
        this.smoothTiles(320,323,256,277,279,278,258,257,342,340,300,298,299,341,319,321); //water/sand smoothing
        this.smoothTiles(320,191,253,274,276,275,255,254,339,337,297,295,296,338,316,318); //sand/grass smoothing
        this.smoothTiles(326,191,262,283,285,284,264,263,348,346,306,304,305,347,325,327); //grass/dirt smoothing

        //RANDOMLY VARY SOLID TILE TEXTURE
        var seed;
        for (var d = 0; d < this.fullMapTileCount; d++) {

            //sand
            if (this.tileArray[d] == 320) {
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

            //grass
            if (this.tileArray[d] == 191) {
                seed = parseInt(Math.random() * 6);
                switch (seed) {
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
            }

            //dirt
            if (this.tileArray[d] == 326) {
                seed = parseInt(Math.random() * 6);
                switch (seed) {
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
            }
        }

        //an array of empty tiled map data arrays
        var tiledMapData = new Array(totalTiledMaps);
        for (var i = 0; i < totalTiledMaps; i++) {
            tiledMapData[i] = [];
        }

        //fill the tiled map data arrays with the proper data from the input array
        for (var j = 0; j < this.fullMapTileCount; j++) {
            var row = parseInt((j % this.fullMapWidth) / tiledMapHeight);
            var column = parseInt((j / this.fullMapHeight) / tiledMapWidth);
            var array = column * tiledMapsWide + row;
            tiledMapData[array].push(this.tileArray[j]);
        }

        var header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<map version=\"1.0\" orientation=\"orthogonal\" renderorder=\"right-down\" width=\"" + tiledMapWidth + "\" height=\"" + tiledMapHeight + "\" tilewidth=\"32\" tileheight=\"32\" nextobjectid=\"1\">\r\n <tileset firstgid=\"1\" name=\"terrain\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"483\" columns=\"21\">\r\n  <image source=\"terrain.jpg\" width=\"672\" height=\"736\"\/>\r\n <\/tileset>\r\n <tileset firstgid=\"484\" name=\"terrain2\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"483\" columns=\"21\">\r\n  <image source=\"terrain2.png\" trans=\"ffffff\" width=\"672\" height=\"736\"\/>\r\n <\/tileset>\r\n <tileset firstgid=\"967\" name=\"terrain3\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"256\" columns=\"16\">\r\n  <image source=\"terrain3.png\" trans=\"ffffff\" width=\"512\" height=\"512\"\/>\r\n <\/tileset>\r\n <layer name=\"Tile Layer 1\" width=\"" + tiledMapWidth + "\" height=\"" + tiledMapHeight + "\">\r\n  <data encoding=\"csv\">\r\n";
        var divider = "<\/data>\r\n <\/layer>\r\n <layer name=\"UpperTerrain\" width=\"" + tiledMapWidth + "\" height=\"" + tiledMapHeight + "\" offsetx=\"448\" offsety=\"251\">\r\n  <data encoding=\"csv\">";
        var topLayerArray = "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,1095,1096,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,1111,1112,0,0,0,0,1012,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1063,1064,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1079,1080,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,1095,1096,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,1111,1112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,1015,1016,1017,1018,1019,1020,1021,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,\r\n0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
        var footer = "<\/data>\r\n <\/layer>\r\n<\/map>\r\n";
        var mapAsTmxStrings = [];

        //attach headers and footers to our arrays to form tmx strings
        for (var k = 0; k < totalTiledMaps; k++) {
            var mapArrayAsString = tiledMapData[k].toString();
            mapAsTmxStrings.push(header.concat(mapArrayAsString, divider, topLayerArray, footer));
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

    tileAtCoordinate: function (xCoord, yCoord) {
        var xTile = parseInt(xCoord / 32);
        var yTile = parseInt(this.fullMapHeight - yCoord / 32);
        console.log("index at (" + xTile + "," + yTile + ") is: " + (xTile + yTile * this.fullMapWidth) + " with tile: " + this.tileArray[(xTile + yTile * this.fullMapWidth)]);
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
            console.log("corrections: " + corrections);
            lastCorrections = corrections;
            corrections = 0;

            for (var i = 0; i < this.fullMapTileCount; i++) {

                //SAND SURROUNDED BY WATER
                if (this.tileArray[i] == p) { //sand tile
                    if (this.tileArray[i - 1] == q || this.tileArray[i - 1] == piql || this.tileArray[i - 1] == qpbl || this.tileArray[i - 1] == qrpl || this.tileArray[i - 1] == qpul) { //water left
                        if (this.tileArray[i - this.fullMapWidth] == q || this.tileArray[i - this.fullMapWidth] == piql || this.tileArray[i - this.fullMapWidth] == qpur || this.tileArray[i - this.fullMapWidth] == qbpa || this.tileArray[i - this.fullMapWidth] == qpul) { //water above
                            if (this.tileArray[i + 1] == q || this.tileArray[i + 1] == piql || this.tileArray[i + 1] == qpbr || this.tileArray[i + 1] == qlpr || this.tileArray[i + 1] == qpur) { //water right
                                if (this.tileArray[i + this.fullMapWidth] == q || this.tileArray[i + this.fullMapWidth] == piql || this.tileArray[i + this.fullMapWidth] == qpbr || this.tileArray[i + this.fullMapWidth] == qapb || this.tileArray[i + this.fullMapWidth] == qpbl) { //water below
                                    if (this.tileArray[i] != piql) {
                                        this.tileArray[i] = piql;
                                        corrections++;
                                    }
                                }
                            }
                        }
                    }
                }

                //SAND WITH WATER IN BOTTOM RIGHT
                if (this.tileArray[i + 1] == pqbl || this.tileArray[i + 1] == qbpa || this.tileArray[i + 1] == qpul) { //sand right on top half
                    if (this.tileArray[i + this.fullMapWidth] == pqur || this.tileArray[i + this.fullMapWidth] == qrpl || this.tileArray[i + this.fullMapWidth] == qpul) { //sand below on left half
                        if (this.tileArray[i] != pqbr) {
                            this.tileArray[i] = pqbr;
                            corrections++;
                        }
                    }
                }

                //SAND WITH WATER IN BOTTOM LEFT
                if (this.tileArray[i - 1] == pqbr || this.tileArray[i - 1] == qpur || this.tileArray[i - 1] == qbpa) { //sand left on top half
                    if (this.tileArray[i + this.fullMapWidth] == pqul || this.tileArray[i + this.fullMapWidth] == qlpr || this.tileArray[i + this.fullMapWidth] == qpur) { //sand below on right half
                        if (this.tileArray[i] != pqbl) {
                            this.tileArray[i] = pqbl;
                            corrections++;
                        }
                    }
                }

                //SAND WITH WATER IN TOP RIGHT
                if (this.tileArray[i - this.fullMapWidth] == pqbr || this.tileArray[i - this.fullMapWidth] == qpbl || this.tileArray[i - this.fullMapWidth] == qrpl) { //sand above on left half
                    if (this.tileArray[i + 1] == pqul || this.tileArray[i + 1] == qapb || this.tileArray[i + 1] == qpbl) { //sand right on bottom half
                        if (this.tileArray[i] != pqur) {
                            this.tileArray[i] = pqur;
                            corrections++;
                        }
                    }
                }


                //SAND WITH WATER IN TOP LEFT
                if (this.tileArray[i - 1] == pqur || this.tileArray[i - 1] == qpbr || this.tileArray[i - 1] == 399) { //sand left in bottom half
                    if (this.tileArray[i - this.fullMapWidth] == pqbl || this.tileArray[i - this.fullMapWidth] == qpbr || this.tileArray[i - this.fullMapWidth] == qlpr) { //sand above on right half
                        if (this.tileArray[i] != pqul) {
                            this.tileArray[i] = pqul;
                            corrections++;
                        }
                    }
                }

                //WATER WITH SAND IN BOTTOM RIGHT
                if (this.tileArray[i + 1] == pqul || this.tileArray[i + 1] == qapb || this.tileArray[i + 1] == qpbl) { //water right on top half
                    if (this.tileArray[i + this.fullMapWidth] == pqul || this.tileArray[i + this.fullMapWidth] == qlpr || this.tileArray[i + this.fullMapWidth] == qpur) { //water below on left half
                        if (this.tileArray[i] != qpbr) {
                            this.tileArray[i] = qpbr;
                            corrections++;
                        }
                    }
                }

                //WATER WITH SAND IN BOTTOM LEFT
                if (this.tileArray[i - 1] == pqur || this.tileArray[i - 1] == qpbr || this.tileArray[i - 1] == qapb) { //water left on top half
                    if (this.tileArray[i + this.fullMapWidth] == pqur || this.tileArray[i + this.fullMapWidth] == qrpl || this.tileArray[i + this.fullMapWidth] == qpul) { //water below in right half
                        if (this.tileArray[i] != qpbl) {
                            this.tileArray[i] = qpbl;
                            corrections++;
                        }
                    }
                }

                //WATER WITH SAND IN TOP RIGHT
                if (this.tileArray[i - this.fullMapWidth] == pqbl || this.tileArray[i - this.fullMapWidth] == qpbr || this.tileArray[i - this.fullMapWidth] == qlpr) { //water above in left half
                    if (this.tileArray[i + 1] == pqbl || this.tileArray[i + 1] == qbpa || this.tileArray[i + 1] == qpul) { //water right in bottom half
                        if (this.tileArray[i] != qpur) {
                            this.tileArray[i] = qpur;
                            corrections++;
                        }
                    }
                }

                //WATER WITH SAND IN TOP LEFT
                if (this.tileArray[i - 1] == pqbr || this.tileArray[i - 1] == qpur || this.tileArray[i - 1] == qbpa) { //water left in bottom half
                    if (this.tileArray[i - this.fullMapWidth] == pqbr || this.tileArray[i - this.fullMapWidth] == qpbl || this.tileArray[i - this.fullMapWidth] == qrpl) { //water above in right half
                        if (this.tileArray[i] != qpul) {
                            this.tileArray[i] = qpul;
                            corrections++;
                        }
                    }
                }

                //WATER ABOVE, SAND BELOW
                if (this.tileArray[i - this.fullMapWidth] == q || this.tileArray[i - this.fullMapWidth] == piql || this.tileArray[i - this.fullMapWidth] == qpur || this.tileArray[i - this.fullMapWidth] == qbpa || this.tileArray[i - this.fullMapWidth] == qpul) { //water above
                    if (this.tileArray[i + this.fullMapWidth] == p || this.tileArray[i + this.fullMapWidth] == qpur) { //sand below
                        if (this.tileArray[i] != qapb) {
                            this.tileArray[i] = qapb;
                            corrections++;
                        }
                    }
                }

                //WATER LEFT, SAND RIGHT
                if (this.tileArray[i - 1] == q || this.tileArray[i - 1] == piql || this.tileArray[i - 1] == qpbl || this.tileArray[i - 1] == qrpl || this.tileArray[i - 1] == qpul) {
                    if (this.tileArray[i + 1] == p || this.tileArray[i + 1] == qrpl) {
                        if (this.tileArray[i] != qlpr) {
                            this.tileArray[i] = qlpr;
                            corrections++;
                        }
                    }
                }

                //SAND LEFT, WATER RIGHT
                if (this.tileArray[i - 1] == p || this.tileArray[i - 1] == qlpr) {
                    if (this.tileArray[i + 1] == q || this.tileArray[i + 1] == piql || this.tileArray[i + 1] == qpbr || this.tileArray[i + 1] == qlpr || this.tileArray[i + 1] == qpur) {
                        if (this.tileArray[i] != qrpl) {
                            this.tileArray[i] = qrpl;
                            corrections++;
                        }
                    }
                }

                //SAND ABOVE, WATER BELOW
                if (this.tileArray[i - this.fullMapWidth] == p || this.tileArray[i - this.fullMapWidth] == qapb || this.tileArray[i - this.fullMapWidth] == pqur || this.tileArray[i - this.fullMapWidth] == pqul) {
                    if (this.tileArray[i + this.fullMapWidth] == q || this.tileArray[i + this.fullMapWidth] == piql || this.tileArray[i + this.fullMapWidth] == qpbr || this.tileArray[i + this.fullMapWidth] == qapb || this.tileArray[i + this.fullMapWidth] == qpbl) {
                        if (this.tileArray[i] != qbpa) {
                            this.tileArray[i] = qbpa;
                            corrections++;
                        }
                    }
                }
            }
        } while (corrections != lastCorrections);
    }
});