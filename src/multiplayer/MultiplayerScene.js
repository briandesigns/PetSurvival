/**
 * Created by Joe on 2016-04-13.
 */

var MultiplayerScene = cc.Scene.extend({
    space: null,
    gameLayer: null, // need multiplayer version of this?
    playerLayer: null,
    mapLayer: null,
    itemLayer: null,
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
        this.itemLayer = new ItemLayer(this.space, this.mapLayer, null, true, null);

        var chosenChar;
        switch (playerType) {
            case CHAR_TYPE.cat:
                chosenChar = new Cat(this.space);
                break;
            case CHAR_TYPE.dog:
                chosenChar = new Dog(this.space);
                break;
            case CHAR_TYPE.rabbit:
                chosenChar = new Rabbit(this.space);
                break;
            case CHAR_TYPE.pig:
                chosenChar = new Pig(this.space);
                break;
        }

        this.playerLayer = new PlayerLayerMulti(this.space, chosenChar, this.jsonData);

        this.gameLayer.addChild(this.mapLayer, 0, TagOfLayer.Map);
        this.gameLayer.addChild(this.playerLayer, 0, TagOfLayer.Player);
        this.gameLayer.addChild(this.itemLayer, 0, TagOfLayer.Item);

        this.addChild(this.gameLayer);
        this.addChild(this.hudLayer, 0, TagOfLayer.Hud);
        this.scheduleUpdate();//execute main method every frame
        this.scheduleOnce(this.positionPlayer); //execute position player to spawn point at first

        cc.audioEngine.playMusic(res.music_boss, true);
    },

    /**
     * Move player to Spawn point and zoom into the player and init hud
     * @param dt time frame(unused)
     */
    positionPlayer: function (dt) {
        var spawnPoint = SpawnPointCoordinates(this.jsonData.playerID);
            this.playerLayer.playerList[this.playerLayer.currentPlayerID].character.sprite.setPosition(
                cc.p(spawnPoint.xCoordinate, spawnPoint.yCoordinate));

        var zoomAction = new cc.scaleBy(1, 1.5, 1.5);
        this.gameLayer.runAction(new cc.Sequence(zoomAction));
        this.hudLayer.updateHealth();
        this.hudLayer.updateInventory();
        this.hudLayer.updateScore();
    },

    /**
     * Method that checks if an element has died on the map, then puts them into the trash to be
     * destroyed
     */
    trashDeadThings: function () {
        if (this.playerLayer.playerList[this.playerLayer.currentPlayerID].character.health <= 0) {
            this.showGameOverMenu("LOST");
        }
    },

    /**
     * Destroy dead elements
     */
    emptyTrash: function () {
        for (var i = 0; i < this.trash.length; i ++) {
            cc.log("score added: " + this.trash[i].healthPoint);
            this.playerLayer.playerList[this.playerLayer.currentPlayerID].character.score += this.trash[i].healthPoint;
            this.hudLayer.updateScore();
            this.trash[i].die();
            this.trash = [];
            this.removeAllChildren(true);
            cc.director.runScene(new MainMenuScene());
        }
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
        this.trashDeadThings();//put things that died in trash
        this.emptyTrash(); //remove dead things
    }
});