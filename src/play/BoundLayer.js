
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

        var leftWall = new cp.Body(MAX_INT, cp.momentForBox(1, 0, 32*65));
        leftWall.setAngVel(0);
        leftWall.setMoment(MAX_INT);
        var shape = new cp.BoxShape(leftWall, 0, 32*65);
        shape.setCollisionType(COLLISION_TYPE.bounds);
        shape.setSensor(false);
        this.space.addBody(leftWall);
        this.space.addShape(shape);
        leftWall.setPos(cc.p(-1, 65*32/2));

        var rightWall = new cp.Body(MAX_INT, cp.momentForBox(1, 0, 32*65));
        rightWall.setAngVel(0);
        rightWall.setMoment(MAX_INT);
        var shape2 = new cp.BoxShape(rightWall, 0, 32*65);
        shape2.setCollisionType(COLLISION_TYPE.bounds);
        shape2.setSensor(false);
        this.space.addBody(rightWall);
        this.space.addShape(shape2);
        rightWall.setPos(cc.p(65*32+1, 65*32/2));

        var topWall = new cp.Body(MAX_INT, cp.momentForBox(1, 32*65, 1));
        topWall.setAngVel(0);
        topWall.setMoment(MAX_INT);
        var shape3 = new cp.BoxShape(topWall, 32*65, 1);
        shape3.setCollisionType(COLLISION_TYPE.bounds);
        shape3.setSensor(false);
        this.space.addBody(topWall);
        this.space.addShape(shape3);
        topWall.setPos(cc.p(65*32/2, 65*32+1));

        var bottomWall = new cp.Body(MAX_INT, cp.momentForBox(1, 32*65, 1));
        bottomWall.setAngVel(0);
        bottomWall.setMoment(MAX_INT);
        var shape4 = new cp.BoxShape(bottomWall, 32*65, 1);
        shape4.setCollisionType(COLLISION_TYPE.bounds);
        shape4.setSensor(false);
        this.space.addBody(bottomWall);
        this.space.addShape(shape4);
        bottomWall.setPos(cc.p(65*32/2, 0-1));

        var checkwall = new cp.Body(MAX_INT, cp.momentForBox(1, 32, 32));
        checkwall.setAngVel(0);
        checkwall.setMoment(MAX_INT);
        var shape5 = new cp.BoxShape(checkwall, 32, 32);
        shape5.setCollisionType(COLLISION_TYPE.bounds);
        shape5.setSensor(false);
        this.space.addBody(checkwall);
        this.space.addShape(shape5);
        checkwall.setPos(cc.p(this.mapLayer.coordinateAtTileIndex(0).x+16, this.mapLayer.coordinateAtTileIndex(0).y+16));

        //for (this.mapLayer.collisionArray)

    }
});

