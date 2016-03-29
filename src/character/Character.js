var Character = cc.Class.extend({

    collisionType: null,
    body: null,
    shape: null,
    sprite: null,
    healthPoint: null,
    health: null,
    hitPoint: null,
    speed: null,
    inventory: null,
    projectileCount: null,
    inventoryCapacity: null,
    collisionList: null,
    space: null,
    spriteScale: null,
    characterType: null,
    speedDuration: null,
    score: null,

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


    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (collisionType, sprite, healthPoint, health,
                    hitPoint, speed, speedDuration, inventoryCapacity, space, plist, png, name) {
        this.spriteScale = 0.03;
        if (this.characterType == CHAR_TYPE.boss) {
            this.spriteScale = 0.01;
        }
        this.collisionType = collisionType;
        this.plist = plist;
        this.png = png;
        cc.spriteFrameCache.addSpriteFrames(this.plist);
        this.spriteSheet = new cc.SpriteBatchNode(this.png);
        //this.addChild(this.spriteSheet);
        this.sprite = sprite;
        this.sprite.setScale(this.spriteScale);
        this.healthPoint = healthPoint;
        this.projectileCount = 0;
        this.health = health;
        this.hitPoint = hitPoint;
        this.speed = speed;
        this.inventory = [];
        this.score = 0;
        this.inventoryCapacity = inventoryCapacity;
        this.collisionList = [];
        this.speedDuration = speedDuration;
        this.space = space;
        var contentSize = this.sprite.getContentSize();
        this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width * this.spriteScale,
            contentSize.height * this.spriteScale));
        this.shape = new cp.BoxShape(this.body, contentSize.width * this.spriteScale,
            contentSize.height * this.spriteScale);
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
        var animationMoveUp = new cc.Animation(animframes, this.speedDuration);
        this.upAction = new cc.Sequence(new cc.Animate(animationMoveUp));


    //moving down animation
        animframes = [];
        str = name + "-down-normal.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        str = name + "-down-move.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        var animationMoveDown = new cc.Animation(animframes, this.speedDuration);
        this.downAction = new cc.Sequence(new cc.Animate(animationMoveDown));


    //moving left animation
        animframes = [];
        str = name + "-left-normal.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        str = name + "-left-move.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        var animationMoveLeft = new cc.Animation(animframes, this.speedDuration);
        this.leftAction = new cc.Sequence(new cc.Animate(animationMoveLeft));


    //moving right animation
        animframes = [];
        str = name + "-right-normal.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        str = name + "-right-move.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        var animationMoveRight = new cc.Animation(animframes, this.speedDuration);
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
        var attack = new cc.Animation(animframes, this.speedDuration);
        this.upAttack = new cc.Sequence(new cc.Animate(attack));

        animframes = [];
        str = name + "-down-move.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        str = name + "-down-attack.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        attack = new cc.Animation(animframes, this.speedDuration);
        this.downAttack = new cc.Sequence(new cc.Animate(attack));

        animframes = [];
        str = name + "-left-move.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        str = name + "-left-attack.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        attack = new cc.Animation(animframes, this.speedDuration);
        this.leftAttack = new cc.Sequence(new cc.Animate(attack));

        animframes = [];
        str = name + "-right-move.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        str = name + "-right-attack.png" ;
        frame = cc.spriteFrameCache.getSpriteFrame(str);
        animframes.push(frame);
        attack = new cc.Animation(animframes, this.speedDuration);
        this.rightAttack = new cc.Sequence(new cc.Animate(attack));

    },

    changeHealth: function (h) {
        if (h>0) {
            if (this.health < this.healthPoint) {
                var lostHealth = this.healthPoint - this.health;
                if (h <= lostHealth) {
                    this.health+=h;
                } else {
                    this.health+=lostHealth;
                }
                return true;
            } else {
                return false;
            }
        } else {
            if (this.health < -1*h) {
                this.health = 0;
                return true;
            } else {
                this.health+=h;
                return true;
            }
        }
    },

    moveRight: function () {
        this.direction = "right";
        this.sprite.setRotation(0);
        //this.sprite.setRotation(-90);
        var actionTo = new cc.MoveBy(this.speedDuration, cc.p(this.speed, 0));
        this.sprite.runAction(this.rightAction);
        this.sprite.runAction(new cc.Sequence(actionTo));
    },

    moveLeft: function () {
        this.direction = "left";
        this.sprite.setRotation(0);
        //this.sprite.setRotation(90);
        var actionTo = new cc.MoveBy(this.speedDuration, cc.p(this.speed*-1, 0));
        this.sprite.runAction(this.leftAction);
        this.sprite.runAction(new cc.Sequence(actionTo));
    },

    moveUp: function () {
        this.direction = "up";
        this.sprite.setRotation(0);
        //this.sprite.setRotation(180);
        var actionTo = new cc.MoveBy(this.speedDuration, cc.p(0, this.speed));
        this.sprite.runAction(this.upAction);
        this.sprite.runAction(new cc.Sequence(actionTo));
    },

    moveDown: function () {
        this.direction = "down";
        this.sprite.setRotation(0);
        var actionTo = new cc.MoveBy(this.speedDuration, cc.p(0, this.speed*-1));
        this.sprite.runAction(this.downAction);
        this.sprite.runAction(new cc.Sequence(actionTo));
    },

    die: function () {
        for(var i=0; i<this.inventory.length;i++) {
            this.removeItem(i+1);
        }
        this.inventoryCapacity = 0;
        this.health = NaN;
        this.body.setPos(cc.p((cc.director.getWinSize().width * 10)  ,
            (cc.director.getWinSize().height * 10))) ;
        this.sprite.removeFromParent();
    },


    addItem: function(item) {
        if(this.inventoryCapacity > this.inventory.length &&
            (item.itemType !== ITEM_TYPE.healthBoost && item.itemType !== ITEM_TYPE.pineCone)) {
            this.inventory.push(item);
            item.body.setPos(cc.p((cc.director.getWinSize().width * 10)  ,
                (cc.director.getWinSize().height * 10))) ;
            switch(item.itemType) {
                case ITEM_TYPE.healthPoint:
                    this.healthPoint+= item.healthPointBenefit;
                    break;
                case ITEM_TYPE.hitPoint:
                    this.hitPoint+= item.hitPointBenefit;
                    break;
                case ITEM_TYPE.speed:
                    this.speed+= item.speedBoost;
                    break;
            }
        } else if (item.itemType === ITEM_TYPE.healthBoost){
            if(this.changeHealth(item.healthBoost)) {
                item.body.setPos(cc.p((cc.director.getWinSize().width * 10)  ,
                    (cc.director.getWinSize().height * 10))) ;
            }
        } else if (item.itemType === ITEM_TYPE.pineCone){
            this.projectileCount+=20;
            item.body.setPos(cc.p((cc.director.getWinSize().width * 10),
                (cc.director.getWinSize().height * 10)));
        } else {
        }
    },

    removeItem: function(itemNumber) {
        if(this.inventory[itemNumber-1] != null) {
            var item = this.inventory[itemNumber-1];
            switch(item.itemType) {
                case ITEM_TYPE.healthPoint:
                    this.healthPoint-= item.healthPointBenefit;
                    if (this.healthPoint < this.health) {
                        this.changeHealth(this.healthPoint-this.health);
                    }
                    break;
                case ITEM_TYPE.hitPoint:
                    this.hitPoint-= item.hitPointBenefit;
                    break;
                case ITEM_TYPE.speed:
                    this.speed-= item.speedBoost;
                    break;
            }
            this.inventory.splice(itemNumber-1,1);
            item.body.setPos(cc.p(this.body.p.x ,
                this.body.p.y+this.sprite.getContentSize().height*this.spriteScale*1.3));
            return true;
        }
        else {
            return false;
        }
    },

    removeCollisionByChar: function(char) {
        for (var i = 0; i < this.collisionList.length; i++) {
            if (this.collisionList[i] == char) {
                this.collisionList.splice(i, 1);
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
            this.collisionList[i].changeHealth(-1*this.hitPoint);
        }
    },

    distanceFromChar: function(char) {
        var charX = char.body.p.x;
        var charY = char.body.p.y;
        return Math.sqrt(Math.pow(this.body.p.x-charX, 2) + Math.pow(this.body.p.y-charY,2));
    }


});