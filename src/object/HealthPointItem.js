var HealthPointItem = Item.extend({
    healthPointBenefit: null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (name, sprite, healthBenefit) {
        this._super(name, sprite);;
        this.healthBenefit = healthBenefit;
    },
})