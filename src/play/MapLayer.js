/**
 * Created by brian on 2/13/16.
 */
var MapLayer = cc.Layer.extend({
    maps:[],
    mapWidth:0,
    mapHeight:0,

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        //the input array of map tiles. for now make this iterate through the tile types
        var inputTileData = [];
        for (i=0; i<65536; i++) {
            inputTileData.push(parseInt(i/483));
        }

        //an array of empty tiled map data arrays
        var tiledMapData = new Array(16);
        for (var i = 0; i<16; i++) {
            tiledMapData[i] = [];
        }

        //fill the tiled map data arrays with the proper data from the input array
        for (var j=0; j<65536; j++) {
            var row = parseInt((j%256)/64);
            var column = parseInt((j/256)/64);
            var array = column*4 + row;
            tiledMapData[array].push(inputTileData[j]);
        }

        var header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<map version=\"1.0\" orientation=\"orthogonal\" renderorder=\"right-down\" width=\"64\" height=\"64\" tilewidth=\"32\" tileheight=\"32\" nextobjectid=\"1\">\r\n <tileset firstgid=\"1\" name=\"terrain\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"483\" columns=\"21\">\r\n  <image source=\"terrain.jpg\" width=\"672\" height=\"736\"\/>\r\n <\/tileset>\r\n <layer name=\"Tile Layer 1\" width=\"64\" height=\"64\">\r\n  <data encoding=\"csv\">\r\n";
        var footer = "<\/data>\r\n <\/layer>\r\n<\/map>\r\n";
        var mapAsTmxStrings = [];

        //attach headers and footers to our arrays to form tmx strings
        for (var k=0; k<16; k++) {
            var mapArrayAsString = tiledMapData[k].toString();
            mapAsTmxStrings.push(header.concat(mapArrayAsString, footer));
        }

        //create 16 tiled map objects
        for (i=0; i<16; i++) {
            var map = new cc.TMXTiledMap.create(mapAsTmxStrings[i], "res/map");
            this.maps.push(map);
        }

        this.mapWidth = this.maps[0].getContentSize().width;
        this.mapHeight = this.maps[0].getContentSize().height;

        //set the position of 16 tiled maps in a 4x4 grid
        for (i=0; i<16; i++) {
            var xPosition = (this.mapWidth * i) % (this.mapWidth * 4);
            var yPosition = this.mapHeight * parseInt(i / 4);

            this.maps[i].setPosition(cc.p(xPosition, yPosition));
            this.addChild(this.maps[i]);
        }

        this.scheduleUpdate();
    }
});