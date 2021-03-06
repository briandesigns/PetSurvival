var Location = cc.Class.extend({

    /**
     * base class for end and starting points
     */
    collisionType: null,
    body: null,
    shape: null,
    sprite: null,
    spriteScale: null,
    space: null,

    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (collisionType, sprite, spriteScale, space) {
        this.collisionType = collisionType;
        this.spriteScale = spriteScale;
        this.sprite = sprite;
        if (sprite != null) {
            this.sprite.setScale(this.spriteScale);
            this.space = space;
            var contentSize = this.sprite.getContentSize();
            this.body = new cp.Body(MAX_INT, cp.momentForBox(1, contentSize.width*(this.spriteScale), contentSize.height*(this.spriteScale)));
            this.body.setAngVel(0);
            this.body.setMoment(MAX_INT);
            this.shape = new cp.BoxShape(this.body, contentSize.width*(this.spriteScale), contentSize.height*(this.spriteScale));
            this.sprite.setBody(this.body);
            this.shape.setCollisionType(this.collisionType);
            this.shape.setSensor(false);
            this.space.addBody(this.body);
            this.space.addShape(this.shape);
        } else {
            this.sprite = new cc.Sprite();
        }

    }

});