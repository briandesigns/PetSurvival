var HitPointItem = Item.extend({

    hitPointBenefit: null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (name, sprite, hitPointBenefit) {
        this._super(name, sprite, ITEM_TYPE.hitPoint);
        this.hitPointBenefit = hitPointBenefit;
    }
});