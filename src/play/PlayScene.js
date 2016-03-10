/**
 * Created by brian on 2/13/16.
 */

var PlayScene = cc.Scene.extend({
    space: null,

    initPhysics:function() {
        //1. new space object
        this.space = new cp.Space();
        //2. setup the  Gravity
        this.space.gravity = cp.v(0, 0);

        //// 3. set up Walls
        //var wallBottom = new cp.SegmentShape(this.space.staticBody,
        //    cp.v(0, g_groundHeight),// start point
        //    cp.v(4294967295, g_groundHeight),// MAX INT:4294967295
        //    0);// thickness of wall
        //this.space.addStaticShape(wallBottom);


    },

    onEnter: function () {
        this._super();
        this.initPhysics();
        this.gameLayer = new cc.Layer();

        this.gameLayer.addChild(new MapLayer(this.space), 0, TagOfLayer.Map);
        this.gameLayer.addChild(new PlayerLayer(this.space), 0, TagOfLayer.Player);
        this.gameLayer.addChild(new EnemyLayer(this.space), 0, TagOfLayer.Enemy);
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
        this.gameLayer.setPosition(cc.p(-eyeX,-eyeY));
    }
});