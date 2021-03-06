var Item = cc.Class.extend({
    /**
     * base class for all item that could be picked up
     */
    itemID: null,
    collisionType: null,
    name: null,
    sprite: null,
    itemType: null,
    body: null,
    space: null,

    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (sprite, itemType, space) {
        this.itemType = itemType;
        this.space = space;
        var spriteScale = 0.05;
        if (this.itemType == ITEM_TYPE.pineCone) {
            spriteScale = 0.15;
        }
        this.sprite = sprite;
        this.sprite.setScale(spriteScale);
        this.collisionType = COLLISION_TYPE.item;

        var contentSize = this.sprite.getContentSize();
        this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width * spriteScale, contentSize.height * spriteScale));
        this.body.setAngVel(0);
        this.body.setMoment(MAX_INT);
        this.shape = new cp.BoxShape(this.body, contentSize.width * spriteScale, contentSize.height * spriteScale);
        this.sprite.setBody(this.body);
        this.shape.setCollisionType(this.collisionType);
        this.shape.setSensor(false);
        this.space.addBody(this.body);
        this.space.addShape(this.shape);
    }
});