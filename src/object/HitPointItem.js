var HitPointItem = Item.extend({

    hitPointBenefit: null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (hitPointBenefit, space) {
        this._super(new cc.PhysicsSprite(res.object_hit_point_png), ITEM_TYPE.hitPoint, space);
        this.hitPointBenefit = hitPointBenefit;
    }
});