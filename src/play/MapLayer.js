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

        //this string represents .tmx tiled map data
        var mapAsString0 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<map version=\"1.0\" orientation=\"orthogonal\" renderorder=\"right-down\" width=\"5\" height=\"5\" tilewidth=\"32\" tileheight=\"32\" nextobjectid=\"1\">\r\n <tileset firstgid=\"1\" name=\"terrain\" tilewidth=\"32\" tileheight=\"32\" tilecount=\"192\" columns=\"16\">\r\n  <image source=\"HF1_A2.png\" width=\"512\" height=\"384\"\/>\r\n <\/tileset>\r\n <layer name=\"Tile Layer 1\" width=\"5\" height=\"5\">\r\n  <data encoding=\"csv\">\r\n69,70,71,72,73,\r\n85,86,87,88,89,\r\n101,102,103,104,105,\r\n117,118,119,120,121,\r\n133,134,135,136,137\r\n<\/data>\r\n <\/layer>\r\n<\/map>\r\n";

        //create 25 tiled maps
        for (i=0; i<25; i++) {
            var map = new cc.TMXTiledMap.create(mapAsString0, "res/map");
            this.maps.push(map);
        }

        this.mapWidth = this.maps[0].getContentSize().width;
        this.mapHeight = this.maps[0].getContentSize().height;

        //set the position of 25 tiled maps in a 5x5 grid
        for (i=0; i<25; i++) {
            var xPosition = (this.mapWidth * i) % (this.mapWidth * 5);
            var yPosition = this.mapHeight * parseInt(i / 5);

            this.maps[i].setPosition(cc.p(xPosition, yPosition));
            this.addChild(this.maps[i]);
        }

        this.scheduleUpdate();
    }
});