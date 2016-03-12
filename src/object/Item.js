var Item = cc.Node.extend({
    collisionType: null,
    name: null,
    sprite: null,
    itemType: null,

    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (name, sprite, itemType) {
        this._super();
        this.name = name;
        this.sprite = sprite;
        this.itemType = itemType;
        this.collisionType = COLLISION_TYPE.item;
    }

});