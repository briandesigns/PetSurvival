var PineConeItem = Item.extend({

    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(new cc.PhysicsSprite(res.object_pine_cone_png), ITEM_TYPE.pineCone, space);
    }
});