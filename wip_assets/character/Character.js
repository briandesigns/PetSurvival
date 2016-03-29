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
    /***/ //added stuffs
    plist : null,
    png : null,
    spriteSheet:null,
    upAction:null,
    downAction:null,
    leftAction:null,
    rightAction:null,
    upAttack: null,
    downAttack: null,
    leftAttack: null,
    rightAttack: null,
    direction: null,
    /***/

    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
     ctor: function (collisionType, sprite, healthPoint, health, hitPoint, speed, inventory, inventoryCapacity, space, plist, png, name ) {
        this._super();
    /***/
        this.plist = plist;
        this.png = png;

        cc.spriteFrameCache.addSpriteFrames(this.plist);
        this.spriteSheet = new cc.SpriteBatchNode(this.png);
        this.addChild(this.spriteSheet);
      //  var str= "#"+ name + "-down-normal.png";
      //  this.sprite = new cc.PhysicsSprite(str);  //alternative way of creating the sprite (from spritesheet)
    /***/
        this.collisionType = collisionType;
        this.sprite = sprite;

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

        this.direction = "down";    // as reference for attack direction

    // moving up animation
        var animframes = [];
        var str = name + "-up-normal.png" ;
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        str= name + "-up-move.png"
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        var animationMoveUp = new cc.Animation(animframes, 0.2);
        this.upAction = new cc.Sequence(new cc.Animate(animationMoveUp));


    //moving down animation
        animframes = [];
        str = name + "-down-normal.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        str = name + "-down-move.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        var animationMoveDown = new cc.Animation(animframes, 0.2);
        this.downAction = new cc.Sequence(new cc.Animate(animationMoveDown));


    //moving left animation
        animframes = [];
        str = name + "-left-normal.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        str = name + "-left-move.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        var animationMoveLeft = new cc.Animation(animframes, 0.2);
        this.leftAction = new cc.Sequence(new cc.Animate(animationMoveLeft));


    //moving right animation
        animframes = [];
        str = name + "-right-normal.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        str = name + "-right-move.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        var animationMoveRight = new cc.Animation(animframes, 0.2);
        this.rightAction = new cc.Sequence(new cc.Animate(animationMoveRight));

        //to do: attacking animation
        //attacking animation

        animframes = [];
        str = name + "-up-move.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        str = name + "-up-attack.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        var attack = new cc.Animation(animframes, 0.2);
        this.upAttack = new cc.Sequence(new cc.Animate(attack));

        animframes = [];
        str = name + "-down-move.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        str = name + "-down-attack.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        attack = new cc.Animation(animframes, 0.2);
        this.downAttack = new cc.Sequence(new cc.Animate(attack));

        animframes = [];
        str = name + "-left-move.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        str = name + "-left-attack.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        attack = new cc.Animation(animframes, 0.2);
        this.leftAttack = new cc.Sequence(new cc.Animate(attack));

        animframes = [];
        str = name + "-right-move.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        str = name + "-right-attack.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        attack = new cc.Animation(animframes, 0.2);
        this.rightAttack = new cc.Sequence(new cc.Animate(attack));

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

    moveRight: function () {  //rotation removed
        this.direction = "right";
        var actionTo = new cc.MoveBy(0.5, cc.p(10, 0));
        this.sprite.runAction(this.rightAction);
        this.sprite.runAction(new cc.Sequence(actionTo));
    },

    moveLeft: function () {
        this.direction = "left";
        var actionTo = new cc.MoveBy(0.5, cc.p(-10, 0));
       this.sprite.runAction(this.leftAction);
        this.sprite.runAction(new cc.Sequence(actionTo));
    },

    moveUp: function () {
        this.direction = "up";
        var actionTo = new cc.MoveBy(0.5, cc.p(0, 10));
       this.sprite.runAction(this.upAction);
        this.sprite.runAction(new cc.Sequence(actionTo));
    },

    moveDown: function () {
        this.direction ="down";
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
        if(this.direction == "up") {
            this.sprite.runAction(this.upAttack);
        }
        else if(this.direction == "left") {
            this.sprite.runAction(this.leftAttack);
        }
        else if(this.direction == "right") {
            this.sprite.runAction(this.rightAttack);
        }
        else {
            this.sprite.runAction(this.downAttack);
        }
        for (var i =0; i < this.collisionList.length; i++) {
            this.collisionList[i].health-=this.hitPoint;
        }
    }


});