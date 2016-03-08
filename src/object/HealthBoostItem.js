var HealthBoostItem = Item.extend({

    healthBoost: null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (name, sprite, healthBoost) {
        this._super(name, sprite, ITEM_TYPE.healthBoost);;
        this.healthBoost = healthBoost;
    }
});