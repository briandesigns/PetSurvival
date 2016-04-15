var HealthPointItem = Item.extend({

    /**
     * an item that allows u a greater health point capacity
     */
    healthPointBenefit: null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super( new cc.PhysicsSprite(res.object_health_point_png), ITEM_TYPE.healthPoint, space);
        this.healthPointBenefit = ITEM_STATS.healthPointBenefit;
    }
});