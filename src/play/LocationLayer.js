var LocationLayer = cc.Layer.extend({
    space: null,
    mapLayer: null,
    start: null,
    end: null,

    ctor: function (space, mapLayer,locations) {
        this._super();
        this.space = space;
        this.mapLayer = mapLayer;
        if (locations != null) {
            this.start = locations.start;
            this.end = locations.end;
        }
        this.init();
    },

    init: function () {
        if (this.start == null && this.end == null) {
            this.start = new StartPoint(this.space);
            this.start.body.setPos(cc.p(this.mapLayer.coordinateAtTileIndex(150).x, this.mapLayer.coordinateAtTileIndex(150).y));
            this.addChild(this.start.sprite);
            this.end = new EndPoint(this.space);
            this.end.body.setPos(cc.p(this.mapLayer.coordinateAtTileIndex(151).x , this.mapLayer.coordinateAtTileIndex(151).y));
            this.addChild(this.end.sprite);
        }
    }
});

