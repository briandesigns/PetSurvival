var Character = cc.Node.extend({

    collisionType: null,
    body: null,
    shape: null,
    sprite: null,
    healthPoint: null,
    health: null,
    hitPoint: null,
    speed: null,
    inventory: null,
    inventoryCapacity: null,
    collisionList: null,
    space: null,
    /***/
    plist : null,
    png : null,
    spriteSheet:null,
    upAction:null,
    downAction:null,
    leftAction:null,
    rightAction:null,
    animMoveUp: null,
    animMoveLeft: null,
    animMoveRight: null,
    animMoveDown: null,
  //  name : null,
    /***/


    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
   //ctor: function (collisionType, sprite, healthPoint, health, hitPoint, speed, inventory, inventoryCapacity, space) {
     ctor: function (collisionType, sprite, healthPoint, health, hitPoint, speed, inventory, inventoryCapacity, space, plist, png, name ) {
        this._super();
        this.collisionType = collisionType;

    /***/



        this.plist = plist;
        this.png = png;

      // this.name = name;


        cc.spriteFrameCache.addSpriteFrames(this.plist);
        this.spriteSheet = new cc.SpriteBatchNode(this.png);
        this.addChild(this.spriteSheet);
      //  var str= "#"+ this.name + "-down-normal.png";
      //  this.sprite = new cc.PhysicsSprite(str);       //create the sprite




    /***/



        this.sprite = sprite;
       //this.sprite = new cc.PhysicsSprite("#dog-down-normal.png");



        this.sprite.setScale(0.1);
        this.healthPoint = healthPoint;
        this.health = health;
        this.hitPoint = hitPoint;
        this.speed = speed;
        this.inventory = inventory;
        this.inventoryCapacity = inventoryCapacity;
        this.collisionList = [];
        this.space = space;

        var contentSize = this.sprite.getContentSize();
        this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width * 0.1, contentSize.height * 0.1));
        this.shape = new cp.BoxShape(this.body, contentSize.width * 0.1, contentSize.height * 0.1);
        this.sprite.setBody(this.body);
        this.shape.setCollisionType(this.collisionType);
        this.shape.setSensor(false);
        this.space.addBody(this.body);
        this.space.addShape(this.shape);

    // moving up animation
        this.animMoveUp = [];
        str = name + "-up-normal.png" ;
        var frameUp = cc.spriteFrameCache.getSpriteFrame(str);
        this.animMoveUp.push(frameUp);
        str= name + "-up-move.png"
        var frameMoveUp = cc.spriteFrameCache.getSpriteFrame(str);
        this.animMoveUp.push(frameMoveUp);
        var animationMoveUp = new cc.Animation(this.animMoveUp, 0.2);
        this.upAction = new cc.Sequence(new cc.Animate(animationMoveUp));


    //moving down animation
        this.animMoveDown = [];
        str = name + "-down-normal.png" ;
        var frameDown = cc.spriteFrameCache.getSpriteFrame(str);
        this.animMoveDown.push(frameDown);
        str = name + "-down-move.png" ;
        var frameDownMove = cc.spriteFrameCache.getSpriteFrame(str);
        this.animMoveDown.push(frameDownMove);
        var animationMoveDown = new cc.Animation(this.animMoveDown, 0.2);
        this.downAction = new cc.Sequence(new cc.Animate(animationMoveDown));


    //moving left animation
        this.animMoveLeft = [];
        str = name + "-left-normal.png" ;
        var frameLeft = cc.spriteFrameCache.getSpriteFrame(str);
        this.animMoveLeft.push(frameLeft);
        str = name + "-left-move.png" ;
        var frameMoveLeft = cc.spriteFrameCache.getSpriteFrame(str);
        this.animMoveLeft.push(frameMoveLeft);
        var animationMoveLeft = new cc.Animation(this.animMoveLeft, 0.2);
        this.leftAction = new cc.Sequence(new cc.Animate(animationMoveLeft));


    //moving right animation
        this.animMoveRight = [];
        str = name + "-right-normal.png" ;
        var frameRight = cc.spriteFrameCache.getSpriteFrame(str);
        this.animMoveRight.push(frameRight);
        str = name + "-right-move.png" ;
        var frameMoveRight = cc.spriteFrameCache.getSpriteFrame(str);
        this.animMoveRight.push(frameMoveRight);
        var animationMoveRight = new cc.Animation(this.animMoveRight, 0.2);
        this.rightAction = new cc.Sequence(new cc.Animate(animationMoveRight));

    },

    maximizeHealth: function () {

    },

    setHealth: function (h) {

    },

    setHitPoint: function (hp) {

    },

    dropAllItems: function () {

    },

    dropItem: function (itemName) {
    },

    moveRight: function () {
       // this.sprite.setRotation(0);
       // this.sprite.setRotation(-90);
        var actionTo = new cc.MoveBy(0.5, cc.p(10, 0));
        this.sprite.runAction(this.rightAction);
        this.sprite.runAction(new cc.Sequence(actionTo));


    },
    moveLeft: function () {
       //this.sprite.setRotation(0);
       // this.sprite.setRotation(90);
        var actionTo = new cc.MoveBy(0.5, cc.p(-10, 0));
       this.sprite.runAction(this.leftAction);
        this.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveUp: function () {
      //  this.sprite.setRotation(0);
     //  this.sprite.setRotation(180);
        var actionTo = new cc.MoveBy(0.5, cc.p(0, 10));
       this.sprite.runAction(this.upAction);
        this.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveDown: function () {
      //  this.sprite.setRotation(0);
      //  this.sprite.setRotation(0);
        var actionTo = new cc.MoveBy(0.5, cc.p(0, -10));
        this.sprite.runAction(this.downAction);
        this.sprite.runAction(new cc.Sequence(actionTo));
    },

    die: function () {
        //this.space.removeShape(this.shape);
        //this.shape = null;
        //this.sprite.removeFromParent();
        //this.sprite = null;
        this.body.setPos(cc.p((cc.director.getWinSize().width * 10)  , (cc.director.getWinSize().height * 10))) ;

    },

    removeCollisionByChar: function(char) {
        for (var i = 0; i < this.collisionList.length; i++) {
            if (this.collisionList[i] == char) {
                this.collisionList.splice(i, 1);
                cc.log("collision element removed");
            }
        }
    },

    attackEnemies: function() {
        for (var i =0; i < this.collisionList.length; i++) {
            this.collisionList[i].health-=this.hitPoint;
        }
    }


});