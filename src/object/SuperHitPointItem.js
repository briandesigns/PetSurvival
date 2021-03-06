var SuperHitPointItem = Item.extend({

    /**
     * super hit point item could only be obtained through boss fights
     */
    hitPointBenefit: null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(new cc.PhysicsSprite(res.object_super_hit_png), ITEM_TYPE.hitPoint, space);
        this.hitPointBenefit = ITEM_STATS.hitPointBenefit*4;
        this.isSuper = true;
    }
});