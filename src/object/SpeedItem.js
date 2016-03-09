var SpeedItem = Item.extend({
    speedBoost: null,
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (name, sprite, speedBoost) {
        this._super(name, sprite, ITEM_TYPE.speed);
        this.speedBoost = speedBoost;
    },
})