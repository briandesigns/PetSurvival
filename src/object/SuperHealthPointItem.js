var SuperHealthPointItem = Item.extend({

    /**
     * super health point item could only be obtaied through boss fights
     */
    healthPointBenefit: null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super( new cc.PhysicsSprite(res.object_super_health_png), ITEM_TYPE.healthPoint, space);
        this.healthPointBenefit = ITEM_STATS.healthPointBenefit*4;
        this.isSuper = true;
    }
});