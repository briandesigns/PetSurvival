var HealthBoostItem = Item.extend({

    healthBoost: null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(new cc.PhysicsSprite(res.object_food_png), ITEM_TYPE.healthBoost, space);
        this.healthBoost = ITEM_STATS.healthBoost;
    }
});