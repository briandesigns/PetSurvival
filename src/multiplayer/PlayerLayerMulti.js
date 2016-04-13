/**
 * Created by Joe on 2016-04-13.
 */

var PlayerLayerMulti = cc.Layer.Extend({
    space: null,
    player: null,
    playerList: null,
    inMotion: null,
    ctor: function(space, character) {
        this._super();
        this.space = space;
        this.player = new Player(character);
        this.init();
    },
    init: function() {
        this._super();
        // Create the hero sprite and position it in the center of the screen
        this.inMotion = false;
        this.playerList = [];
        this.playerList.push(this.player);
        this.player.character.setPos(cc.p(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2));
        this.addChild(this.player.character.sprite);

        // Setup event listeners for keyboard events
        if (cc.sys.capabilities.hasOwnProperty("keyboard")) {
            cc.eventManager.addListener({
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed: function (key, event) {
                        if (key.toString() === "37") { //left
                            this.moveLeft();
                        } else if (key.toString() === "38") { //up
                            this.moveUp();
                        } else if (key.toString() === "40") { //down
                            this.moveDown();
                        } else if (key.toString() === "39") { //right
                            this.moveRight();
                        } else if (key.toString() === "32") { //space
                            this.player.character.attackEnemies();
                        } else if (key.toString() === "49") { //1
                            this.removeItem(1);
                        } else if (key.toString() === "50") { //2
                            this.removeItem(2);
                        } else if (key.toString() === "51") { //3
                            this.removeItem(3);
                        } else if (key.toString() === "52") { //4
                            this.removeItem(4);
                        } else if (key.toString() === "53") { //5
                            this.removeItem(5);
                        } else if (key.toString() === "27") { //esc
                            this.showPauseMenu();
                        }
                    }.bind(this)
                },
                this
            );
        }
    },

    getPlayerByShape: function (shape) {
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].character.shape == shape) {
                return this.playerList[i];
            }
        }
        return null;
    },

    moveRight: function () {
        if (this.inMotion == false) {
            this.inMotion = true;
            this.player.character.moveRight();
            this.inMotion = false;
        }
    },
    
    moveLeft: function () {
        if (this.inMotion == false) {
            this.inMotion = true;
            this.player.character.moveLeft();
            this.inMotion = false;
        }
    },

    moveUp: function () {
        if (this.inMotion == false) {
            this.inMotion = true;
            this.player.character.moveUp();
            this.inMotion = false;
        }


    },

    moveDown: function () {
        if (this.inMotion == false) {
            this.inMotion = true;
            this.player.character.moveDown();
            this.inMotion = false;
        }
    },

    getEyeX: function () {
        return this.player.character.sprite.getPositionX() - (cc.director.getWinSize().width / 2);
    },

    getEyeY: function () {
        return this.player.character.sprite.getPositionY() - (cc.director.getWinSize().height / 2);
    },

    addItem: function (item) {
        cc.audioEngine.playEffect(res.sound_item_add);
        //cc.audioEngine.setEffectsVolume(1);
        this.player.character.addItem(item);
        var hudLayer = this.getParent().getParent().getChildByTag(TagOfLayer.Hud);
        hudLayer.updateInventory();
    },

    removeItem: function (itemNumber) {
        cc.audioEngine.playEffect(res.sound_item_remove);
        //cc.audioEngine.setEffectsVolume(1);
        if (this.player.character.removeItem(itemNumber)) {
            var hudLayer = this.getParent().getParent().getChildByTag(TagOfLayer.Hud);
            hudLayer.updateInventory();
        }
    },
});