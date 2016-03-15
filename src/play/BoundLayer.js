
var BoundLayer = cc.Layer.extend({
    space: null,
    obstacleList:null,
    mapLayer:null,
    unusedCollisionArrayTiles:[],

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

        this.unusedCollisionArrayTiles = this.mapLayer.collisionArray.slice();

        for (var i = 0 ; i < this.unusedCollisionArrayTiles.length; i++) {
            var tile = this.unusedCollisionArrayTiles[i];
            if (tile == 1) {
                this.checkForBiggerSquare(i, 1, 1);

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

    },
    checkForBiggerSquare: function(index, width, height){
        var expandRight = true;
        var expandDown = true;
        var fullMapWidth = this.mapLayer.fullMapWidth;

        //console.log("Checking index " + index + " with width: " + width + " and height: " + height);
        //check if we can expand our rectangle to the right
        for (var i=0; i<height*fullMapWidth; i+=fullMapWidth) {
            console.log();
            if (this.tileRightOf(index+i+(width-1)) == 0){
                //console.log("tile right of " + (index+i+(width-1)) + " is 0");
                expandRight = false;
                break;
            }
        }
        if (expandRight) {
            //console.log("expand right");
            this.checkForBiggerSquare(index, width+1, height);
        } else {
            //check if we can expand our rectangle down
            for(i=0; i<width; i++) {
                if (this.tileBelow(index+i+(height-1)*fullMapWidth) == 0) {
                    //console.log("tile below " + (index+i+(height-1)*fullMapWidth) + " is 0");
                    expandDown = false;
                    console.log("draw sprite from (" + index%fullMapWidth + "," + parseInt(index/fullMapWidth) + ") to (" + (index%fullMapWidth+width-1) + "," + (parseInt(index/fullMapWidth) + height-1) + ") of size " + (height*width));
                    this.removeUsedCollisionArrayTiles(index, width, height);
                    break;
                }
            }
            if (expandDown) {
                //console.log("expand down");
                this.checkForBiggerSquare(index, width, height+1);
            }
        }
        //console.log("removing (" + (index%fullMapWidth+width-1) + "," + (parseInt(index/fullMapWidth) + height-1) + ")");

        //console.log(parseInt((index+width-1+(height-1)*fullMapWidth)/fullMapWidth));

        //console.log("actually removing (" + (this.mapLayer.coordinateAtTileIndex((index + (width-1) + (height-1)*fullMapWidth)).x/ 32) + "," + (fullMapWidth - this.mapLayer.coordinateAtTileIndex((index + (width-1) + (height-1)*fullMapWidth)).y / 32) + ")");
        //this.unusedCollisionArrayTiles[(index+width-1+(height-1)*fullMapWidth)] = 0;
    },

    removeUsedCollisionArrayTiles: function(index, width, height) {
        var fullMapWidth = this.mapLayer.fullMapWidth;

        for (var i=0; i<width; i++) {
            for (var j=0; j<height; j++) {
                //console.log("removing (" + (index%fullMapWidth+i) + "," + (parseInt(index/fullMapWidth)+j) + ")");
                this.unusedCollisionArrayTiles[(index+i+j*fullMapWidth)] = 0;
            }
        }
    },

    tileRightOf: function (index) {
        if ((index + 1) % this.mapLayer.fullMapWidth != 0) {
            return this.mapLayer.collisionArray[index + 1];
        } else {
            return 0;
        }
    },

    tileBelow: function (index) {
        if (index + this.mapLayer.fullMapWidth < this.mapLayer.fullMapTileCount) {
            return this.mapLayer.collisionArray[index + this.mapLayer.fullMapWidth];
        } else {
            return 0;
        }
    }
});

