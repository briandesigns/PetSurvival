var SpeedItem = Item.extend({

    /**
     * item that boosts ur speed
     */
    speedBoost: null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(new cc.PhysicsSprite(res.object_speed_point_png), ITEM_TYPE.speed, space);
        this.speedBoost = ITEM_STATS.speedBoost;

    }
});