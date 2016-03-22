var LocationLayer = cc.Layer.extend({
    space: null,
    mapLayer: null,
    start: null,
    end: null,

    ctor: function (space, mapLayer,start,end) {
        this._super();
        this.space = space;
        this.mapLayer = mapLayer;
        this.start = start;
        this.end = end;
        this.init();
    },

    init: function () {
        if (this.start == null && this.end == null) {
            this.start = new StartPoint(this.space);
            this.start.body.setPos(cc.p(this.mapLayer.coordinateAtTileIndex(135).x, this.mapLayer.coordinateAtTileIndex(135).y));
            this.addChild(this.start.sprite);
            this.end = new EndPoint(this.space);
            this.end.body.setPos(cc.p(this.mapLayer.coordinateAtTileIndex(4150).x , this.mapLayer.coordinateAtTileIndex(4150).y));
            this.addChild(this.end.sprite);
        }
    }
});

