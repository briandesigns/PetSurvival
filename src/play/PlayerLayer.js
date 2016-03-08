/**
 * Created by brian on 2/13/16.
 */
var PlayerLayer = cc.Layer.extend({
    player: null,
    ctor: function () {
        this._super();
        this.init();
    },
    init: function () {
        this._super();

        //create the hero sprite
        this.player = new Player(new Dog());
        this.player.character.sprite.attr({
            x: cc.director.getWinSize().width / 2,
            y: cc.director.getWinSize().height / 2
        });
        this.player.character.sprite.setScale(0.1);
        this.addChild(this.player.character.sprite);

        if (cc.sys.capabilities.hasOwnProperty("keyboard")) {
            cc.eventManager.addListener({
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed: function (key, event) {
                        //cc.log("Key pressed: " + key.toString());
                        if (key.toString() === "65") { //a
                            this.moveLeft();
                        } else if (key.toString() === "87") { //w
                            this.moveUp();
                        } else if (key.toString() === "83") { //s
                            this.moveDown();
                        } else if (key.toString() === "68") { //d
                            this.moveRight();
                        }
                    }.bind(this)
                },
                this
            );
        }
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
    }
});

