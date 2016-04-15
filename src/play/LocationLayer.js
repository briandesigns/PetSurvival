var LocationLayer = cc.Layer.extend({
    space: null,
    mapLayer: null,
    start: null,
    end: null,
    funChecker: null,

    ctor: function (space, mapLayer, locations, funChecker) {
        this._super();
        this.space = space;
        this.mapLayer = mapLayer;
        if (locations != null) {
            this.start = locations.start;
            cc.log("Start position:" +this.start);
            this.end = locations.end;
            cc.log("End position:" + this.end);
        }
        this.funChecker = funChecker;
        this.init();
    },

    init: function () {
        if (this.start == null && this.end == null) {
            var startAndEnd = this.funChecker;
            
            this.start = new StartPoint(this.space);
            this.start.sprite.setPosition(cc.p(this.mapLayer.coordinateAtTileIndex(startAndEnd.start).x+16, this.mapLayer.coordinateAtTileIndex(startAndEnd.start).y+16));
            this.end = new EndPoint(this.space);
            this.end.body.setPos(cc.p(this.mapLayer.coordinateAtTileIndex(startAndEnd.end).x+16, this.mapLayer.coordinateAtTileIndex(startAndEnd.end).y+16));
        }
        this.addChild(this.end.sprite);
        this.addChild(this.start.sprite);
    }
});

