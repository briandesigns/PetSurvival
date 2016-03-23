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


    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (collisionType, sprite, healthPoint, health,
                    hitPoint, speed, speedDuration, inventoryCapacity, space) {
        this.spriteScale = 0.03;
        this.collisionType = collisionType;
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

    },

    maximizeHealth: function () {

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
        this.sprite.setRotation(0);
        this.sprite.setRotation(-90);
        var actionTo = new cc.MoveBy(this.speedDuration, cc.p(this.speed, 0));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveLeft: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(90);
        var actionTo = new cc.MoveBy(this.speedDuration, cc.p(this.speed*-1, 0));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveUp: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(180);
        var actionTo = new cc.MoveBy(this.speedDuration, cc.p(0, this.speed));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveDown: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(0);
        var actionTo = new cc.MoveBy(this.speedDuration, cc.p(0, this.speed*-1));
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
            this.projectileCount+=10;
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
                this.body.p.y+this.sprite.getContentSize().height*this.spriteScale*1.2));
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