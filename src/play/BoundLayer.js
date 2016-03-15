
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
            }
        }

    },

    //recursive function that checks if we can include the tiles to the right or below in the area we give as parameters
    checkForBiggerSquare: function(index, width, height){
        var expandRight = true;
        var expandDown = true;
        var fullMapWidth = this.mapLayer.fullMapWidth;

        //check if we can expand our rectangle to the right
        for (var i=0; i<height*fullMapWidth; i+=fullMapWidth) {
            if (this.tileRightOf(index+i+(width-1)) == 0){
                expandRight = false;
                break;
            }
        }
        if (expandRight) {
            this.checkForBiggerSquare(index, width+1, height);
        } else {
            //check if we can expand our rectangle down
            for(i=0; i<width; i++) {
                if (this.tileBelow(index+i+(height-1)*fullMapWidth) == 0) {
                    expandDown = false;

                    //we can't expand any farther. draw our sprite at index with width and height
                    this.drawCollisionSprite(index, width, height);
                    this.removeUsedCollisionArrayTiles(index, width, height);
                    break;
                }
            }
            if (expandDown) {
                this.checkForBiggerSquare(index, width, height+1);
            }
        }
    },

    //draw a collision sprite at the given index for the specified width and height
    drawCollisionSprite: function(index, width, height) {
        //console.log("draw sprite from (" + index%fullMapWidth + "," + parseInt(index/fullMapWidth) + ") to (" + (index%fullMapWidth+width-1) + "," + (parseInt(index/fullMapWidth) + height-1) + ") of size " + (height*width));
        var block = new cp.Body(MAX_INT, cp.momentForBox(1, 32*width, 32*height));
        block.setAngVel(0);
        block.setMoment(MAX_INT);
        var blockShape = new cp.BoxShape(block, 32*width, 32*height);
        blockShape.setCollisionType(COLLISION_TYPE.bounds);
        blockShape.setSensor(false);
        this.space.addBody(block);
        this.space.addShape(blockShape);
        block.setPos(cc.p(this.mapLayer.coordinateAtTileIndex(index).x+width*16, this.mapLayer.coordinateAtTileIndex(index).y+height*16-(height-1)*32));
    },

    //remove tiles from our array when we have drawn a collision sprite over them already
    removeUsedCollisionArrayTiles: function(index, width, height) {
        var fullMapWidth = this.mapLayer.fullMapWidth;

        for (var i=0; i<width; i++) {
            for (var j=0; j<height; j++) {
                if (this.unusedCollisionArrayTiles[index+i+j*fullMapWidth] != 0) {
                    this.unusedCollisionArrayTiles[(index+i+j*fullMapWidth)] = 0;
                }
            }
        }
    },

    //safely returns the tile to the right of the given index
    tileRightOf: function (index) {
        if ((index + 1) % this.mapLayer.fullMapWidth != 0) {
            return this.unusedCollisionArrayTiles[index + 1];
        } else {
            return 0;
        }
    },

    //safely returns the tile below the given index
    tileBelow: function (index) {
        if (index + this.mapLayer.fullMapWidth < this.mapLayer.fullMapTileCount) {
            return this.unusedCollisionArrayTiles[index + this.mapLayer.fullMapWidth];
        } else {
            return 0;
        }
    }
});

