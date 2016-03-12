
var BoundLayer = cc.Layer.extend({
    space: null,
    obstacleList:null,
    mapLayer:null,

    ctor: function (space, mapLayer) {
        this._super();
        this.init();
        this.space = space;
        this.obstacleList = [];
        this.mapLayer = mapLayer;
        var wallLeft = new cp.SegmentShape(
            this.space.staticBody,
            cp.v(0, 0),
            cp.v(0, 2080),
            0);
        var wallRight = new cp.SegmentShape(
            this.space.staticBody,
            cp.v(2080, 0),
            cp.v(2080, 2080),
            0);
        var wallTop = new cp.SegmentShape(
            this.space.staticBody,
            cp.v(0, 2080),
            cp.v(2080, 2080),
            0);
        var wallBottom = new cp.SegmentShape(
            this.space.staticBody,
            cp.v(0, 0),
            cp.v(2080, 0),
            0);
        this.space.addStaticShape(wallLeft);
        this.space.addStaticShape(wallRight);
        this.space.addStaticShape(wallTop);
        this.space.addStaticShape(wallBottom);

    },
    init: function () {
        this._super();
    }
});

