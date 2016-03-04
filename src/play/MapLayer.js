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

        //build our array of map tiles
        var mapArray = [];
        for (i=0; i<4096; i++) {
            //for now: set tile i to a random tile
            mapArray.push(Math.random()*483 + 1);
        }
        var mapArrayString = mapArray.toString();

        //add header and footer to build .tmx string
        var header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<map version=\"1.0\" orientation=\"orthogonal\" renderorder=\"right-down\" width=\"64\" height=\"64\" tilewidth=\"32\" tileheight=\"32\" nextobjectid=\"1\">\r\n <tileset firstgid=\"1\" name=\"terrain\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"483\" columns=\"21\">\r\n  <image source=\"terrain.jpg\" width=\"672\" height=\"736\"\/>\r\n <\/tileset>\r\n <layer name=\"Tile Layer 1\" width=\"64\" height=\"64\">\r\n  <data encoding=\"csv\">\r\n";
        var footer = "<\/data>\r\n <\/layer>\r\n<\/map>\r\n";
        var mapAsTmxString = header.concat(mapArrayString, footer);

        //create 16 tiled maps
        for (i=0; i<16; i++) {
            var map = new cc.TMXTiledMap.create(mapAsTmxString, "res/map");
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