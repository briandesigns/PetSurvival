var EnemySpawn = cc.Node.extend({

    collisionType: null,
    body: null,
    shape: null,
    sprite: null,
    healthPoint: null,
    health: null,
    capacity: null,
    enemyList: null,
    spriteScale: null,
    spawnType: null,
    space: null,


    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (sprite, health, capacity, spriteScale, spawnType, space) {
        this._super();
        this.collisionType = COLLISION_TYPE.enemySpawn;
        this.health = health;
        this.capacity = capacity;
        this.spriteScale = spriteScale;
        this.sprite = sprite;
        this.sprite.setScale(this.spriteScale);
        this.spawnType = spawnType;
        this.space = space;
        this.enemyList = [];

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

    },

    die: function () {
        //this.space.removeShape(this.shape);
        //this.shape = null;
        //this.sprite.removeFromParent();
        //this.sprite = null;
        //this.space.removeBody(this.body);
        //this.body = null;
        this.body.setPos(cc.p((cc.director.getWinSize().width * 10)  , (cc.director.getWinSize().height * 10))) ;

    },

    changeHealth: function (h) {
        if (h>0) {
            if (this.health < this.healthPoint) {
                var lostHealth = this.healthPoint - this.health;
                if (h <= lostHealth) {
                    this.health+=h;
                } else {
                    this.health+=lostHealth;
                }
                return true;
            } else {
                cc.log("food rejected, don't need it");
                return false;
            }
        } else {
            if (this.health < -1*h) {
                this.health = 0;
                return true;
            } else {
                this.health+=h;
                return true;
            }
        }
    }









});