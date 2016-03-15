var HealthBoostItem = Item.extend({

    healthBoost: null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (healthBoost, space) {
        this._super(new cc.PhysicsSprite(res.object_food_png), ITEM_TYPE.healthBoost, space);
        this.healthBoost = healthBoost;
    }
});