var CaveMapLayer = cc.Layer.extend ({
    /**
     * layer that contains boss maps
     */
    map: null,
    collisionArray: null,
    space: null,
    fullMapWidth: null,
    fullMapHeight: null,
    fullMapTileCount: null,


    ctor: function (space) {
        this._super();
        this.space = space;
        this.init();
    },

    init: function() {
        this._super();
        this.fullMapHeight = 16;
        this.fullMapWidth = 16;
        this.fullMapTileCount = this.fullMapWidth * this.fullMapHeight;
        this.map = new cc.TMXTiledMap(res.caveTerrain_tmx);
        this.addChild(this.map);

        // Represents walkable areas
        this.collisionArray = [
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,
            1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,
            1,1,1,1,0,0,0,1,1,0,0,1,1,1,1,1,
            1,1,1,1,0,0,0,1,1,0,0,0,1,1,1,1,
            1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,
            1,1,0,0,1,1,0,0,0,0,0,1,0,1,1,1,
            1,1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,
            1,1,0,0,0,0,0,0,1,1,0,0,0,1,1,1,
            1,1,1,0,0,0,0,0,1,1,0,0,1,1,1,1,
            1,1,1,1,0,0,1,0,0,0,0,1,1,1,1,1,
            1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,
            1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
        ];
    },

    /**
     * find the x , y in pixels given the tile we want
     * @param tileIndex
     * @returns {{x: number, y: number}}
     */
    coordinateAtTileIndex: function (tileIndex) {
        var xTile = tileIndex % this.fullMapWidth;
        var yTile = parseInt(tileIndex / this.fullMapWidth);

        var xCoordinate = xTile * 32;
        var yCoordinate = this.fullMapHeight*32-((yTile+1) * 32);
        //console.log("index " + tileIndex + " has coordinate (" + xCoordinate + "," + yCoordinate + ")");

        return {x:xCoordinate, y:yCoordinate};
    }
});