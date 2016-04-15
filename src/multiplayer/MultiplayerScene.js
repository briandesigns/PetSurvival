/**
 * Created by Joe on 2016-04-13.
 */

var MultiplayerScene = cc.Scene.extend({
    space: null,
    gameLayer: null, // need multiplayer version of this?
    playerLayer: null,
    mapLayer: null,
    hudLayer: null,
    trash: null,
    jsonData: null,

    ctor: function(_jsonData) {
        this.jsonData = _jsonData;
        this._super();
        this.space = new cp.Space();
        this.trash = [];
    },

    onEnter: function() {
        this._super();
        this.gameLayer = new cc.Layer();
        this.hudLayer = new HudLayerMulti();

        this.mapLayer = new CaveMapLayer(this.space);

        var chosenChar;
        switch (this.jsonData.playerID%4) {
            case 0:
                chosenChar = new PigMulti(null);
                break;
            case 1:
                chosenChar = new DogMulti(null);
                break;
            case 2:
                chosenChar = new CatMulti(null);
                break;
            case 3:
                chosenChar = new RabbitMulti(null);
                break;
        }

        this.playerLayer = new PlayerLayerMulti(this.space, chosenChar, this.jsonData, this.hudLayer);

        this.gameLayer.addChild(this.mapLayer, 0, TagOfLayer.Map);
        this.gameLayer.addChild(this.playerLayer, 0, TagOfLayer.Player);

        this.addChild(this.gameLayer);
        this.addChild(this.hudLayer, 0, TagOfLayer.Hud);
        this.scheduleUpdate();//execute main method every frame
        this.scheduleOnce(this.positionPlayer); //execute position player to spawn point at first

        cc.audioEngine.playMusic(res.music_boss, true);
    },

    /**
     * Zoom into the player and init hud
     * @param dt time frame(unused)
     */
    positionPlayer: function (dt) {
        var zoomAction = new cc.scaleBy(1, 1.5, 1.5);
        this.gameLayer.runAction(new cc.Sequence(zoomAction));
        this.hudLayer.updateHealth();
        this.hudLayer.updateInventory();
        this.hudLayer.updateScore();
    },

    onExit: function () {
        this._super();
    },

    /**
     * Main method, executed at every frame
     * @param dt time interval
     */
    update: function (dt) {
        this.space.step(dt); //drive the chipmunk physics engine at every frame
        var playerLayer = this.gameLayer.getChildByTag(TagOfLayer.Player);
        //keep player centered on the screen and move everything else relative to it at every frame
        var eyeX = playerLayer.getEyeX() * 2.25;
        var eyeY = playerLayer.getEyeY() * 2.25;
        this.gameLayer.setPosition(cc.p(-eyeX, -eyeY));
    }
});