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
    spriteScale: null,


    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (collisionType, sprite, healthPoint, health, hitPoint, speed, inventoryCapacity, space) {
        this._super();
        this.spriteScale = 0.03;
        this.collisionType = collisionType;
        this.sprite = sprite;
        this.sprite.setScale(this.spriteScale);
        this.healthPoint = healthPoint;
        this.health = health;
        this.hitPoint = hitPoint;
        this.speed = speed;
        this.inventory = [];
        this.inventoryCapacity = inventoryCapacity;
        this.collisionList = [];
        this.space = space;


        var contentSize = this.sprite.getContentSize();
        this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width * this.spriteScale, contentSize.height * this.spriteScale));
        this.shape = new cp.BoxShape(this.body, contentSize.width * this.spriteScale, contentSize.height * this.spriteScale);
        this.sprite.setBody(this.body);
        this.shape.setCollisionType(this.collisionType);
        this.shape.setSensor(false);
        this.space.addBody(this.body);
        this.space.addShape(this.shape);

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
        this.sprite.setRotation(0);
        this.sprite.setRotation(-90);
        var actionTo = new cc.MoveBy(0.5, cc.p(this.speed, 0));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveLeft: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(90);
        var actionTo = new cc.MoveBy(0.5, cc.p(this.speed*-1, 0));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveUp: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(180);
        var actionTo = new cc.MoveBy(0.5, cc.p(0, this.speed));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveDown: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(0);
        var actionTo = new cc.MoveBy(0.5, cc.p(0, this.speed*-1));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },

    die: function () {
        //this.space.removeShape(this.shape);
        //this.shape = null;
        //this.sprite.removeFromParent();
        //this.sprite = null;
        this.body.setPos(cc.p((cc.director.getWinSize().width * 10)  , (cc.director.getWinSize().height * 10))) ;

    },

    addItem: function(item) {
        if(this.inventoryCapacity > this.inventory.length) {
            this.inventory.push(item);
            item.body.setPos(cc.p((cc.director.getWinSize().width * 10)  , (cc.director.getWinSize().height * 10))) ;
            cc.log("item taken");
            //todo: process the benefits
        } else {
            cc.log("item rejected");
        }
    },

    removeItem: function(itemNumber) {
        if(this.inventory[itemNumber] != null) {
            var item = this.inventory[itemNumber];
            this.inventory.splice(itemNumber,1);
            item.body.setPos(cc.p(this.body.p.x , this.body.p.y+this.sprite.getContentSize().height*this.spriteScale*1.2));
        }
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