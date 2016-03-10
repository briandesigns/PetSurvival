/**
 * Created by brian on 2/13/16.
 */

var PlayScene = cc.Scene.extend({
    space: null,

    initPhysics: function () {
        //1. new space object
        this.space = new cp.Space();
        //2. setup the  Gravity
        this.space.gravity = cp.v(0, 0);




    },

    initCollisions: function() {
        this.space.addCollisionHandler(COLLISION_TYPE.player, COLLISION_TYPE.enemy,
            this.collisionPlayerEnemyBegin.bind(this), null, null, null);
    },

    collisionPlayerEnemyBegin: function (arbiter, space) {
        var playerLayer = this.gameLayer.getChildByTag(TagOfLayer.Player);
        var player = playerLayer.player;
        player.character.isCollideEnemy = true;
        player.character.sprite.setScale(0.5);
    },

    onEnter: function () {
        this._super();
        this.initPhysics();
        this.gameLayer = new cc.Layer();

        this.gameLayer.addChild(new MapLayer(this.space), 0, TagOfLayer.Map);
        this.gameLayer.addChild(new PlayerLayer(this.space), 0, TagOfLayer.Player);
        this.gameLayer.addChild(new EnemyLayer(this.space), 0, TagOfLayer.Enemy);
        this.initCollisions();
        this.addChild(this.gameLayer);

        this.scheduleUpdate();
    },
    update: function (dt) {
        // chipmunk step, tells cocos to start chipmunk
        this.space.step(dt);
        //moves the map in the opposite direction of player movement
        var playerLayer = this.gameLayer.getChildByTag(TagOfLayer.Player);
        var eyeX = playerLayer.getEyeX();
        var eyeY = playerLayer.getEyeY();
        this.gameLayer.setPosition(cc.p(-eyeX, -eyeY));
    }
});