var Projectile = cc.Class.extend({

    /**
     * base class for all range weapons
     */
    collisionType: null,
    body: null,
    shape: null,
    sprite: null,
    health: null,
    hitPoint: null,
    speed: null,
    collisionList: null,
    space: null,
    spriteScale: null,
    speedDuration: null,


    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (collisionType, sprite, health,
                    hitPoint, speed, speedDuration, space) {
        this.spriteScale = 0.1;
        this.collisionType = collisionType;
        this.sprite = sprite;
        this.sprite.setScale(this.spriteScale);
        this.health = health;
        this.hitPoint = hitPoint;
        this.speed = speed;
        this.collisionList = [];
        this.speedDuration = speedDuration;
        this.space = space;
        var contentSize = this.sprite.getContentSize();
        this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width * this.spriteScale,
            contentSize.height * this.spriteScale));
        this.shape = new cp.BoxShape(this.body, contentSize.width * this.spriteScale,
            contentSize.height * this.spriteScale);
        this.sprite.setBody(this.body);
        this.shape.setCollisionType(this.collisionType);
        this.shape.setSensor(false);
        this.space.addBody(this.body);
        this.space.addShape(this.shape);

    },

    moveRight: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(-90);
        var actionTo = new cc.MoveBy(this.speedDuration, cc.p(this.speed, 0));
        var actionDie = new cc.MoveTo(0, cc.p((cc.director.getWinSize().width * 10),
            (cc.director.getWinSize().height * 10)));
        this.sprite.runAction(new cc.Sequence(actionTo, actionDie));
    },
    moveLeft: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(90);
        var actionTo = new cc.MoveBy(this.speedDuration, cc.p(this.speed * -1, 0));
        var actionDie = new cc.MoveTo(0, cc.p((cc.director.getWinSize().width * 10),
            (cc.director.getWinSize().height * 10)));
        this.sprite.runAction(new cc.Sequence(actionTo, actionDie));
    },
    moveUp: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(180);
        var actionTo = new cc.MoveBy(this.speedDuration, cc.p(0, this.speed));
        var actionDie = new cc.MoveTo(0, cc.p((cc.director.getWinSize().width * 10),
            (cc.director.getWinSize().height * 10)));
        this.sprite.runAction(new cc.Sequence(actionTo, actionDie));
    },
    moveDown: function () {
        this.sprite.setRotation(0);
        this.sprite.setRotation(0);
        var actionTo = new cc.MoveBy(this.speedDuration, cc.p(0, this.speed * -1));
        var actionDie = new cc.MoveTo(0, cc.p((cc.director.getWinSize().width * 10),
            (cc.director.getWinSize().height * 10)));
        this.sprite.runAction(new cc.Sequence(actionTo, actionDie));
    },

    die: function () {
        this.body.setPos(cc.p((cc.director.getWinSize().width * 10),
            (cc.director.getWinSize().height * 10)));
        this.sprite.removeFromParent();
    },

    removeCollisionByChar: function (char) {
        for (var i = 0; i < this.collisionList.length; i++) {
            if (this.collisionList[i] == char) {
                this.collisionList.splice(i, 1);
                cc.log("collision element removed");
            }
        }
    },

    attackEnemies: function () {
        for (var i = 0; i < this.collisionList.length; i++) {
            this.collisionList[i].changeHealth(-1 * this.hitPoint);
            cc.log("enemy health is now: " + this.collisionList[i].health);
        }
    },

    distanceFromChar: function (char) {
        var charX = char.body.p.x;
        var charY = char.body.p.y;
        return Math.sqrt(Math.pow(this.body.p.x - charX, 2) + Math.pow(this.body.p.y - charY, 2));
    }


});