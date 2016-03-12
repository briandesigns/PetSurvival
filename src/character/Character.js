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


    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (collisionType, sprite, healthPoint, health, hitPoint, speed, inventory, inventoryCapacity, space) {
        this._super();
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
        var actionTo = new cc.MoveBy(0.2, cc.p(10, 0));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveLeft: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(90);
        var actionTo = new cc.MoveBy(0.2, cc.p(-10, 0));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveUp: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(180);
        var actionTo = new cc.MoveBy(0.2, cc.p(0, 10));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveDown: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(0);
        var actionTo = new cc.MoveBy(0.2, cc.p(0, -10));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },

    die: function () {
        //this.space.removeShape(this.shape);
        //this.shape = null;
        this.sprite.removeFromParent();
        //this.sprite = null;
        this.body.setPos(cc.p((cc.director.getWinSize().width * 10)  , (cc.director.getWinSize().height * 10))) ;

    },


});