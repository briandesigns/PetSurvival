var Item = cc.Class.extend({

    name: null,
    sprite: null,
    healthBenefit: null,
    hitPointBenefit: null,
    speedBenefit: null,
    healthBoost: null,

    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (name, sprite) {
        this._super();
        this.name = name;
        this.sprite = sprite;
        this.healthBenefit = healthBenefit;
        this.hitPointBenefit = hitPointBenefit;
    },

    getHealthBenefit: function () {
        return this.healthBenefit;
    },

    getHitPointBenefit: function () {
        return this.hitPointBenefit;
    }


});