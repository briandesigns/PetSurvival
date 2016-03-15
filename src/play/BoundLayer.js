
var BoundLayer = cc.Layer.extend({
    space: null,
    obstacleList:null,
    mapLayer:null,

    ctor: function (space, mapLayer) {
        this._super();
        this.space = space;
        this.obstacleList = [];
        this.mapLayer = mapLayer;
        this.init();
           },
    init: function () {
        this._super();

        var leftWall = new cp.Body(MAX_INT, cp.momentForBox(1, 64, 32*65));
        leftWall.setAngVel(0);
        leftWall.setMoment(MAX_INT);
        var shape = new cp.BoxShape(leftWall, 64, 32*65);
        shape.setCollisionType(COLLISION_TYPE.bounds);
        shape.setSensor(false);
        this.space.addBody(leftWall);
        this.space.addShape(shape);
        leftWall.setPos(cc.p(-32, 65*32/2));

        var rightWall = new cp.Body(MAX_INT, cp.momentForBox(1, 64, 32*65));
        rightWall.setAngVel(0);
        rightWall.setMoment(MAX_INT);
        var shape2 = new cp.BoxShape(rightWall, 64, 32*65);
        shape2.setCollisionType(COLLISION_TYPE.bounds);
        shape2.setSensor(false);
        this.space.addBody(rightWall);
        this.space.addShape(shape2);
        rightWall.setPos(cc.p(65*32+32, 65*32/2));

        var topWall = new cp.Body(MAX_INT, cp.momentForBox(1, 32*65+128, 64));
        topWall.setAngVel(0);
        topWall.setMoment(MAX_INT);
        var shape3 = new cp.BoxShape(topWall, 32*65+128, 64);
        shape3.setCollisionType(COLLISION_TYPE.bounds);
        shape3.setSensor(false);
        this.space.addBody(topWall);
        this.space.addShape(shape3);
        topWall.setPos(cc.p(65*32/2, 65*32+32));

        var bottomWall = new cp.Body(MAX_INT, cp.momentForBox(1, 32*65+128, 64));
        bottomWall.setAngVel(0);
        bottomWall.setMoment(MAX_INT);
        var shape4 = new cp.BoxShape(bottomWall, 32*65+128, 64);
        shape4.setCollisionType(COLLISION_TYPE.bounds);
        shape4.setSensor(false);
        this.space.addBody(bottomWall);
        this.space.addShape(shape4);
        bottomWall.setPos(cc.p(65*32/2, -32));

        //var checkwall = new cp.Body(MAX_INT, cp.momentForBox(1, 32, 32));
        //checkwall.setAngVel(0);
        //checkwall.setMoment(MAX_INT);
        //var shape5 = new cp.BoxShape(checkwall, 32, 32);
        //shape5.setCollisionType(COLLISION_TYPE.bounds);
        //shape5.setSensor(false);
        //this.space.addBody(checkwall);
        //this.space.addShape(shape5);
        //checkwall.setPos(cc.p(this.mapLayer.coordinateAtTileIndex(0).x+16, this.mapLayer.coordinateAtTileIndex(0).y+16));

        for (var i = 0 ; i < this.mapLayer.collisionArray.length; i++) {
            var tile = this.mapLayer.collisionArray[i];
            if (tile == 1) {
                var block = new cp.Body(MAX_INT, cp.momentForBox(1, 32, 32));
                block.setAngVel(0);
                block.setMoment(MAX_INT);
                var blockShape = new cp.BoxShape(block, 32, 32);
                blockShape.setCollisionType(COLLISION_TYPE.bounds);
                blockShape.setSensor(false);
                this.space.addBody(block);
                this.space.addShape(blockShape);
                block.setPos(cc.p(this.mapLayer.coordinateAtTileIndex(i).x+16, this.mapLayer.coordinateAtTileIndex(i).y+16));
            }
        }

    }
});

