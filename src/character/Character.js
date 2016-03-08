var Character = cc.Node.extend({

    sprite: null,
    healthPoint: null,
    health: null,
    hitPoint: null,
    speed: null,
    inventory: null,
    inventoryCapacity: null,

    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (sprite, healthPoint, health, hitPoint, speed, inventory, inventoryCapacity) {
        this._super();
        this.sprite = sprite;
        this.healthPoint = healthPoint;
        this.health = health;
        this.hitPoint = hitPoint;
        this.speed = speed;
        this.inventory = inventory;
        this.inventoryCapacity = inventoryCapacity;
    },

    maximizeHealth: function() {

    },

    setHealth: function(h) {
        
    },

    setHitPoint: function(hp) {

    },

    dropAllItems: function() {

    },

    dropItem: function(itemName) {
    },

    moveRight: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(90);
        var actionTo = new cc.MoveBy(0.2, cc.p(10, 0));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveLeft: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(-90);
        var actionTo = new cc.MoveBy(0.2, cc.p(-10, 0));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveUp: function () {
        this.sprite.setRotation(0);
        var actionTo = new cc.MoveBy(0.2, cc.p(0, 10));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveDown: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(-180);
        var actionTo = new cc.MoveBy(0.2, cc.p(0, -10));
        this.sprite.runAction(new cc.Sequence(actionTo));
    },





});