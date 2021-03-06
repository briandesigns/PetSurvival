/**
 * playerlayer, contains logic for controls and player state
 */
var PlayerLayer = cc.Layer.extend({
    space: null,
    player: null,
    projectileList: null,
    playerList: null,
    isPaused: null,
    pauseMenuLayer: null,
    inMotion: null,

    /**
     * constructor
     * @param space
     * @param character
     */
    ctor: function (space, character) {
        this._super();
        this.space = space;
        this.isPaused = false;
        this.player = new Player(character);
        this.init();

        //this._debugNode = new cc.PhysicsDebugNode(this.space);
        //this._debugNode.setVisible(true);
        //this.addChild(this._debugNode, 10);

    },

    /**
     * post constructor initiation
     */
    init: function () {
        this._super();
        //create the hero sprite
        this.inMotion = false;
        this.playerList = [];
        this.projectileList = [];
        this.playerList.push(this.player);
        this.player.character.body.setPos(
            cc.p(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2));

        this.addChild(this.player.character.sprite);

        //keyboard key event listeners for control implementation
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
                        } else if (key.toString() === "65") { //A
                            this.throwProjectile();
                        } else if (key.toString() === "27") { //esc
                            this.showPauseMenu();
                        }
                    }.bind(this)
                },
                this
            );
        }
    },

    /**
     * find the player based on its sprite attribute
     * @param shape
     * @returns {*}
     */
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
    /**
     * find how much character is shifting, this is to center the player on the screen no matter
     * where it moves
     * @returns {number}
     */
    getEyeX: function () {
        return this.player.character.sprite.getPositionX() - (cc.director.getWinSize().width / 2);
    },

    /**
     * find how much character is shifting on y axis. this is to center the player on screen
     * @returns {number}
     */
    getEyeY: function () {
        return this.player.character.sprite.getPositionY() - (cc.director.getWinSize().height / 2);
    },

    /**
     * add item to players character
     * @param item
     */
    addItem: function (item) {
        cc.audioEngine.playEffect(res.sound_item_add);
        //cc.audioEngine.setEffectsVolume(1);
        this.player.character.addItem(item);
        var hudLayer = this.getParent().getParent().getChildByTag(TagOfLayer.Hud);
        hudLayer.updateInventory();
    },


    /**
     * remove item from player character
     * @param itemNumber
     */
    removeItem: function (itemNumber) {
        cc.audioEngine.playEffect(res.sound_item_remove);
        //cc.audioEngine.setEffectsVolume(1);
        if (this.player.character.removeItem(itemNumber)) {
            var hudLayer = this.getParent().getParent().getChildByTag(TagOfLayer.Hud);
            hudLayer.updateInventory();
        }
    },

    /**
     * find out all projectile of the player
     * @param shape
     * @returns {*}
     */
    getProjectileByShape: function (shape) {
        for (var i = 0; i < this.projectileList.length; i++) {
            if (this.projectileList[i].shape == shape) {
                return this.projectileList[i];
            }
        }
    },

    /**
     * throw a projectile in a direction
     */
    throwProjectile: function () {
        if (this.player.character.projectileCount > 0) {
            var proj = new PineConeProjectile(this.space);
            this.projectileList.push(proj);
            this.addChild(proj.sprite);
            cc.log("rotation" +this.player.character.sprite.getRotation());
            if (this.player.character.direction == "right") {
                proj.body.setPos(cc.p(
                    this.player.character.sprite.getPositionX() + 15,
                    this.player.character.sprite.getPositionY()));
                proj.moveRight();
            } else if (this.player.character.direction == "left") {
                proj.body.setPos(cc.p(
                    this.player.character.sprite.getPositionX() - 15,
                    this.player.character.sprite.getPositionY()));
                proj.moveLeft();
            } else if (this.player.character.direction == "up") {
                proj.body.setPos(cc.p(
                    this.player.character.sprite.getPositionX(),
                    this.player.character.sprite.getPositionY() + 15));
                proj.moveUp();
            } else if (this.player.character.direction == "down") {
                proj.body.setPos(cc.p(
                    this.player.character.sprite.getPositionX(),
                    this.player.character.sprite.getPositionY()-15));
                proj.moveDown();
            }
            this.player.character.projectileCount-=1;
        }
    },

    /**
     * display the pause menu based on key press
     */
    showPauseMenu: function () {
        if (this.isPaused == false) {
            cc.director.pause();
            this.isPaused = true;
            this.pauseMenuLayer = new PauseMenuLayer();
            this.pauseMenuLayer.init();
            this.getParent().getParent().addChild(this.pauseMenuLayer);
        } else {
            cc.director.resume();
            this.isPaused = false;
            this.getParent().getParent().removeChild(this.pauseMenuLayer);
        }
    }


});

