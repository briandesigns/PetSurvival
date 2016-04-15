var HitPointItem = Item.extend({

    /**
     * item that boosts ur hitpoints
     */
    hitPointBenefit: null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(new cc.PhysicsSprite(res.object_hit_point_png), ITEM_TYPE.hitPoint, space);
        this.hitPointBenefit = ITEM_STATS.hitPointBenefit;
    }
});