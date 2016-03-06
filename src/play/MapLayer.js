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
            var terrainAsInt = parseInt(terrain.map[i]/10);
            console.log(terrainAsInt);
            inputTileData[i] = terrainAsInt;
        }

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

        var header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<map version=\"1.0\" orientation=\"orthogonal\" renderorder=\"right-down\" width=\"" + tiledMapWidth + "\" height=\"" + tiledMapHeight + "\" tilewidth=\"32\" tileheight=\"32\" nextobjectid=\"1\">\r\n <tileset firstgid=\"1\" name=\"terrain\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"483\" columns=\"21\">\r\n  <image source=\"terrain.jpg\" width=\"672\" height=\"736\"\/>\r\n <\/tileset>\r\n <layer name=\"Tile Layer 1\" width=\"" + tiledMapWidth + "\" height=\"" + tiledMapHeight + "\">\r\n  <data encoding=\"csv\">\r\n";
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

        this.scheduleUpdate();
    }
});