/**
 * Created by Joe on 2016-04-13.
 */

var PlayerLayerMulti = cc.Layer.extend({
    space: null,
    currentPlayerID: null,
    playerList: null,
    isPaused: null,
    inMotion: null,
    jsonData: null,
    hudLayer: null,

    ctor: function(space, character, _jsonData, hudLayer) {
        this.jsonData = _jsonData;
        //after successful login we want to take control of the messages coming from the server
        //so we attach this new callback function to the websocket onmessage
        ws.onmessage = this.ongamestatus.bind(this);
        ws.onclose = this.onclose.bind(this);
        ws.onerror = this.onerror.bind(this);

        this._super();
        this.space = space;
        this.hudLayer = hudLayer;
        this.isPaused = false;
        this.currentPlayerID = _jsonData.playerID;
        this.playerList = [];
        this.playerList[this.currentPlayerID] = new PlayerMulti(this.currentPlayerID, character);
        //var position = this.jsonData.position
        this.init();
    },
    init: function() {
        this._super();

        //multiplayer stuff;
        this.eventHandler(this.jsonData.event);

        // Create the current player's sprite and position it in the center of the screen
        this.inMotion = false;
        console.log("Setting current player position to " + this.jsonData.x + ", " + this.jsonData.y);
        var newPlayerCoordinates = CoordinatesAtTile(this.jsonData.x, this.jsonData.y);
        var newPlayerPoint = cc.p(newPlayerCoordinates.xCoordinate, newPlayerCoordinates.yCoordinate);
        this.playerList[this.currentPlayerID].character.sprite.setPosition(newPlayerPoint);
        this.addChild(this.playerList[this.currentPlayerID].character.sprite);

        // Setup event listeners for keyboard events
        if (cc.sys.capabilities.hasOwnProperty("keyboard")) {
            cc.eventManager.addListener({
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed: function (key, event) {
                        /*var tiles = TileAtCoordinates(this.playerList[this.currentPlayerID].character.sprite.getPositionX(), this.playerList[this.currentPlayerID].character.sprite.getPositionY());
                        var xTile = tiles.xTile;
                        var yTile = tiles.yTile;
                        console.log(xTile + ", " + yTile);*/

                        if (key.toString() === "37") { //left
                            this.requestMove("left");
                        } else if (key.toString() === "38") { //up
                            this.requestMove("up");
                        } else if (key.toString() === "40") { //down
                            this.requestMove("down");
                        } else if (key.toString() === "39") { //right
                            this.requestMove("right");
                        } else if (key.toString() === "32") { //space
                            this.requestMove("attack");
                        } /*else if (key.toString() === "49") { //1
                            this.removeItem(1);
                        } else if (key.toString() === "50") { //2
                            this.removeItem(2);
                        } else if (key.toString() === "51") { //3
                            this.removeItem(3);
                        } else if (key.toString() === "52") { //4
                            this.removeItem(4);
                        } else if (key.toString() === "53") { //5
                            this.removeItem(5);
                        }*/ else if (key.toString() === "27") { //esc
                            this.showPauseMenu();
                        }
                    }.bind(this)
                },
                this
            );
        }

        var config = {
            event: Events.LOADING_DONE,
            playerID: this.currentPlayerID
        };
        var message = Encode(config);
        console.log("Sending message to server: " + message);
        ws.send(message);
    },

    requestMove: function (move) {
        var config = {
            event: Events.PLAY,
            playerID: this.currentPlayerID,
            move: move
        };
        var message = Encode(config);
        console.log("Sending message to server: " + message);
        ws.send(message);
    },

    getPlayerByShape: function (shape) {
        for (var i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].character.shape == shape) {
                return this.playerList[i];
            }
        }
        return null;
    },

    moveRight: function (id) {
        if (this.inMotion == false) {
            this.inMotion = true;
            this.playerList[id].character.moveRight();
            this.inMotion = false;
        }
    },
    
    moveLeft: function (id) {
        if (this.inMotion == false) {
            this.inMotion = true;
            this.playerList[id].character.moveLeft();
            this.inMotion = false;
        }
    },

    moveUp: function (id) {
        if (this.inMotion == false) {
            this.inMotion = true;
            this.playerList[id].character.moveUp();
            this.inMotion = false;
        }
    },

    moveDown: function (id) {
        if (this.inMotion == false) {
            this.inMotion = true;
            this.playerList[id].character.moveDown();
            this.inMotion = false;
        }
    },

    attackAction: function (id) {
        if (this.inMotion == false) {
            this.playerList[id].character.attackEnemies();
        }
    },

    changeHealth: function (id, newHealth) {
        console.log("Changing health of player " + id + " to " + newHealth);
        this.playerList[id].character.health = newHealth;
        this.hudLayer.updateHealth();
    },

    getEyeX: function () {
        return this.playerList[this.currentPlayerID].character.sprite.getPositionX() - (cc.director.getWinSize().width / 2);
    },

    getEyeY: function () {
        return this.playerList[this.currentPlayerID].character.sprite.getPositionY() - (cc.director.getWinSize().height / 2);
    },

    addItem: function (item) {
        cc.audioEngine.playEffect(res.sound_item_add);
        //cc.audioEngine.setEffectsVolume(1);
        this.playerList[this.currentPlayerID].character.addItem(item);
        var hudLayer = this.getParent().getParent().getChildByTag(TagOfLayer.Hud);
        hudLayer.updateInventory();
    },

    removeItem: function (itemNumber) {
        cc.audioEngine.playEffect(res.sound_item_remove);
        //cc.audioEngine.setEffectsVolume(1);
        if (this.playerList[this.currentPlayerID].character.removeItem(itemNumber)) {
            var hudLayer = this.getParent().getParent().getChildByTag(TagOfLayer.Hud);
            hudLayer.updateInventory();
        }
    },

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
    },

    characterModelFromID: function(id) {
        console.log("Given id " + id + " returning model " + id%4);
        switch (id%4) {
            case 0:
                return new PigMulti(null);
                break;
            case 1:
                return new DogMulti(null);
                break;
            case 2:
                return new CatMulti(null);
                break;
            case 3:
                return new RabbitMulti(null);
                break;
        }
    },

    // Multiplayer functions
    eventHandler:function(jsonData) {
        switch (jsonData.event) {
            case Events.SET_POSITION:
                console.log("Events: SET_POSITION");
                this.playerList[jsonData.playerID] = new PlayerMulti(jsonData.playerID, this.characterModelFromID(jsonData.playerID));
                var newPlayerCoordinates = CoordinatesAtTile(jsonData.x, jsonData.y);
                var newPlayerPoint = cc.p(newPlayerCoordinates.xCoordinate, newPlayerCoordinates.yCoordinate);
                console.log("Setting new player position to " + jsonData.x + ", " + jsonData.y);
                this.playerList[jsonData.playerID].character.sprite.setPosition(newPlayerPoint);
                this.addChild(this.playerList[jsonData.playerID].character.sprite);
                break;
            case Events.PLAY_DONE:
                console.log("EVENTS: PLAY_DONE");
                switch (jsonData.move) {
                    case "up":
                        this.moveUp(jsonData.playerID);
                        break;
                    case "right":
                        this.moveRight(jsonData.playerID);
                        break;
                    case "down":
                        this.moveDown(jsonData.playerID);
                        break;
                    case "left":
                        this.moveLeft(jsonData.playerID);
                        break;
                    case "attack":
                        this.attackAction(jsonData.playerID);
                        break;
                    case "health":
                        this.changeHealth(jsonData.playerID, jsonData.health);
                        break;
                }
                break;

        }
        console.log("Set turn message.");
        //this.setTurnMassage();
    },

    // Websocket functions
    ongamestatus:function(e) {
        console.log("Message from server: " + e.data);
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