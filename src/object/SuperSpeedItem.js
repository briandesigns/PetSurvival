var SuperSpeedItem = Item.extend({
    speedBoost: null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(new cc.PhysicsSprite(res.object_super_speed_png), ITEM_TYPE.speed, space);
        this.speedBoost = ITEM_STATS.speedBoost*4;
        this.isSuper = true;

    }
});