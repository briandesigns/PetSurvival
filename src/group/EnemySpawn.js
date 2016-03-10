var EnemySpawn = cc.Node.extend({

    collisionType: null,
    body: null,
    shape: null,
    sprite: null,
    healthPoint: null,
    health: null,
    capacity: null,
    enemyList: [],
    spriteScale: null,


    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (collisionType, sprite, healthPoint, health, capacity, spriteScale) {
        this._super();
        this.collisionType = COLLISION_TYPE.enemySpawn;
        this.healthPoint = healthPoint;
        this.health = health;
        this.capacity = capacity;
        this.spriteScale = spriteScale;
        this.sprite = sprite;
        this.sprite.setScale(this.spriteScale);

        var contentSize = this.sprite.getContentSize();
        this.body = new cp.Body(MAX_INT, cp.momentForBox(1, contentSize.width*(this.spriteScale), contentSize.height*(this.spriteScale)));
        this.body.setAngVel(0);
        this.body.setMoment(MAX_INT);
        this.shape = new cp.BoxShape(this.body, contentSize.width*(this.spriteScale), contentSize.height*(this.spriteScale));
        this.sprite.setBody(this.body);
        this.shape.setCollisionType(this.collisionType);
        this.shape.setSensor(false);

    },





});