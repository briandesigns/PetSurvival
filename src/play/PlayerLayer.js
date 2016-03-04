/**
 * Created by brian on 2/13/16.
 */
var PlayerLayer = cc.Layer.extend({
    bunny: null,
    ctor: function () {
        this._super();
        this.init();
    },
    init: function () {
        this._super();

        //create the hero sprite
        this.bunny = new Player();
        this.bunny.sprite.attr({
            x: cc.director.getWinSize().width / 2,
            y: cc.director.getWinSize().height / 2
        });
        this.bunny.sprite.setScale(0.1);
        this.addChild(this.bunny.sprite);

        //set camera to follow hero sprite
        var followAction = cc.Follow.create(this.bunny.sprite);
        this.runAction(followAction);

        if (cc.sys.capabilities.hasOwnProperty("keyboard")) {
            cc.eventManager.addListener({
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed: function (key, event) {
                        cc.log("Key pressed: " + key.toString());
                        if (key.toString() === "65") { //a
                            cc.log("a pressed");
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
        this.bunny.sprite.setRotation(0);
        this.bunny.sprite.setRotation(90);
        var actionTo = new cc.MoveBy(0.2, cc.p(10, 0));
        this.bunny.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveLeft: function () {
        this.bunny.sprite.setRotation(0);
        this.bunny.sprite.setRotation(-90);
        var actionTo = new cc.MoveBy(0.2, cc.p(-10, 0));
        this.bunny.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveUp: function () {
        this.bunny.sprite.setRotation(0);
        var actionTo = new cc.MoveBy(0.2, cc.p(0, 10));
        this.bunny.sprite.runAction(new cc.Sequence(actionTo));
    },
    moveDown: function () {
        this.bunny.sprite.setRotation(0);
        this.bunny.sprite.setRotation(-180);
        var actionTo = new cc.MoveBy(0.2, cc.p(0, -10));
        this.bunny.sprite.runAction(new cc.Sequence(actionTo));
    },
    getEyeX: function () {
        console.log("getEyeX has been called");
        return this.bunny.sprite.getPositionX() - (cc.director.getWinSize().width / 2);
    }
});

