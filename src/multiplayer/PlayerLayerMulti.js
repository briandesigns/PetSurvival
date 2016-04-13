/**
 * Created by Joe on 2016-04-13.
 */

var PlayerLayerMulti = cc.Layer.extend({
    space: null,
    player: null,
    playerList: null,
    inMotion: null,
    jsonData: null,

    ctor: function(space, character, _jsonData) {
        this.jsonData = _jsonData;
        //after successful login we want to take control of the messages coming from the server
        //so we attach this new callback function to the websocket onmessage
        ws.onmessage = this.ongamestatus.bind(this);
        ws.onclose = this.onclose.bind(this);
        ws.onerror = this.onerror.bind(this);

        this._super();
        this.space = space;
        this.player = new Player(character);
        //var position = this.jsonData.position
        this.init();
    },
    init: function() {
        this._super();

        //multiplayer stuff
        var userName = this.jsonData.username;
        console.log("Welcome user: " + userName);
        this.eventHandler(this.jsonData.event);

        // Create the hero sprite and position it in the center of the screen
        this.inMotion = false;
        this.playerList = [];
        this.playerList.push(this.player);
        this.player.character.body.setPos(cc.p(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2));
        this.addChild(this.player.character.sprite);

        // Setup event listeners for keyboard events
        if (cc.sys.capabilities.hasOwnProperty("keyboard")) {
            cc.eventManager.addListener({
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed: function (key, event) {
                        //console.log(this.player.character.sprite.getPositionX() + "," + this.player.character.sprite.getPositionY());
                        var tiles = TileAtCoordinates(this.player.character.sprite.getPositionX(), this.player.character.sprite.getPositionY());
                        var xTile = tiles.xTile;
                        var yTile = tiles.yTile;
                        console.log(xTile + ", " + yTile);

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

    // Multiplayer functions
    eventHandler:function(jsonData) {
        switch (jsonData.event) {
            case Events.LOGIN_DONE:
                console.log("Events: LOGIN_DONE");
                //this.setupCurrentPlayer();
                break;
            case Events.NEW_USER_LOGIN_DONE:
                console.log("Events: NEW_USER_LOGIN_DONE");
                //this.setupOtherPlayerS();
                break;
            case Events.PLAY_DONE:
                console.log("EVENTS: PLAY_DONE");

                switch (jsonData.move) {
                    case "up":
                        this.moveUp();
                        break;
                    case "right":
                        this.moveRight();
                        break;
                    case "down":
                        this.moveDown();
                        break;
                    case "left":
                        this.moveLeft();
                        break;
                    case "attack":
                        console.log("Attack");
                        break;
                }

                break;
        }
        console.log("Set turn message.");
        //this.setTurnMassage();
    },

    // Websocket functions
    ongamestatus:function(e) {
        console.log("Message from server (in player layer): "+e.data);
        if(e.data!==null || e.data !== 'undefined') {
            this.jsonData = Decode(e.data);
            this.eventHandler(this.jsonData);
        }
    },

    onclose:function (e) {
        cc.director.runScene(new MainMenuScene());
    },

    onerror:function (e) {
        cc.director.runScene(new MainMenuScene());
    }
});