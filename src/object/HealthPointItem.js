var HealthPointItem = Item.extend({
    healthPointBenefit: null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function ( healthBenefit, space) {
        this._super( new cc.PhysicsSprite(res.object_health_point_png), ITEM_TYPE.healthPoint, space);
        this.healthPointBenefit = healthBenefit;
    }
});