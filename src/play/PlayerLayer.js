/**
 * Created by brian on 2/13/16.
 */
var PlayerLayer = cc.Layer.extend({
    space: null,
    player: null,
    playerList: null,
    ctor: function (space) {
        this._super();
        this.space = space;
        this.init();

        //this._debugNode = new cc.PhysicsDebugNode(this.space);
        //this._debugNode.setVisible(true);
        //this.addChild(this._debugNode, 10);
    },
    init: function () {
        this._super();

        //create the hero sprite
        this.player = new Player(new Dog(this.space));
        this.playerList = [];
        this.playerList.push(this.player);
        this.player.character.body.setPos(cc.p(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2));

        this.addChild(this.player.character.sprite);

        if (cc.sys.capabilities.hasOwnProperty("keyboard")) {
            cc.eventManager.addListener({
                    event: cc.EventListener.KEYBOARD,
                    onKeyReleased: function (key, event) {
                        this.getParent().getChildByTag(TagOfLayer.Map).tileAtCoordinate(this.player.character.sprite.getPositionX(), this.player.character.sprite.getPositionY());
                        if (key.toString() === "37") { //left
                            this.player.character.sprite.stopAllActions();
                        } else if (key.toString() === "38") { //up
                            this.player.character.sprite.stopAllActions();
                        } else if (key.toString() === "40") { //down
                            this.player.character.sprite.stopAllActions();
                        } else if (key.toString() === "39") { //right
                            this.player.character.sprite.stopAllActions();
                        } else {
                        }
                    }.bind(this),
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

        this.player.character.moveRight();
    },
    moveLeft: function () {
        this.player.character.moveLeft();

    },
    moveUp: function () {
        this.player.character.moveUp();

    },
    moveDown: function () {
        this.player.character.moveDown();

    },
    getEyeX: function () {
        return this.player.character.sprite.getPositionX() - (cc.director.getWinSize().width / 2);
    },
    getEyeY: function () {
        return this.player.character.sprite.getPositionY() - (cc.director.getWinSize().height / 2);
    },

    addItem: function (item) {
        this.player.character.addItem(item);
        var hudLayer = this.getParent().getParent().getChildByTag(TagOfLayer.Hud);
        hudLayer.updateInventory();
    },

    removeItem: function (itemNumber) {
        if(this.player.character.removeItem(itemNumber)) {
            var hudLayer = this.getParent().getParent().getChildByTag(TagOfLayer.Hud);
            hudLayer.updateInventory();
        }
    }


});

