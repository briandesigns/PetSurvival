/**
 * Created by Joe on 2016-04-13.
 */

var HudLayerMulti = cc.Layer.extend({
    labelHealth:null,
    labelHealthPoint:null,
    labelSpeed:null,
    labelHitPoint:null,
    item1:null,
    item2:null,
    item3:null,
    item4:null,
    item5:null,
    itemBox1: null,
    itemBox2: null,
    itemBox3: null,
    itemBox4: null,
    itemBox5: null,
    itemBoxList: null,
    itemContentList: null,

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();
        var winsize = cc.director.getWinSize();
        this.itemContentList = [];

        this.labelHealth = new cc.LabelTTF("Health:", "Helvetica", 20);
        this.labelHealth.setColor(cc.color(255,255,255));//black color
        this.labelHealth.setPosition(cc.p(90, winsize.height - 20));
        this.addChild(this.labelHealth);

        this.labelHealthPoint = new cc.LabelTTF("HealthPoint:", "Helvetica", 20);
        this.labelHealthPoint.setColor(cc.color(255,255,255));//black color
        this.labelHealthPoint.setPosition(cc.p(90, winsize.height - 40));
        this.addChild(this.labelHealthPoint);

        this.labelSpeed = new cc.LabelTTF("Speed:", "Helvetica", 20);
        this.labelSpeed.setColor(cc.color(255,255,255));//black color
        this.labelSpeed.setPosition(cc.p(90, winsize.height - 60));
        this.addChild(this.labelSpeed);

        this.labelHitPoint = new cc.LabelTTF("HitPoint:", "Helvetica", 20);
        this.labelHitPoint.setColor(cc.color(255,255,255));//black color
        this.labelHitPoint.setPosition(cc.p(90, winsize.height - 80));
        this.addChild(this.labelHitPoint);

        this.labelScore = new cc.LabelTTF("Score:", "Helvetica", 20);
        this.labelScore.setColor(cc.color(255,255,255));//black color
        this.labelScore.setPosition(cc.p(90, winsize.height - 100));
        this.addChild(this.labelScore);

        this.itemBoxList = [];

        this.itemBox1 = new cc.Sprite(res.hud_inventory_png);
        this.addChild(this.itemBox1);
        this.itemBox1.attr({x: cc.director.getWinSize().width/2-80*2, y:40});
        this.itemBoxList[0] = this.itemBox1;

        this.itemBox2 = new cc.Sprite(res.hud_inventory_png);
        this.addChild(this.itemBox2);
        this.itemBox2.attr({x: cc.director.getWinSize().width/2-80, y:40});
        this.itemBoxList[1] = this.itemBox2;


        this.itemBox3 = new cc.Sprite(res.hud_inventory_png);
        this.addChild(this.itemBox3);
        this.itemBox3.attr({x: cc.director.getWinSize().width/2, y:40});
        this.itemBoxList[2] = this.itemBox3;

        this.itemBox4 = new cc.Sprite(res.hud_inventory_png);
        this.addChild(this.itemBox4);
        this.itemBox4.attr({x: cc.director.getWinSize().width/2+80, y:40});
        this.itemBoxList[3] = this.itemBox4;

        this.itemBox5 = new cc.Sprite(res.hud_inventory_png);
        this.addChild(this.itemBox5);
        this.itemBox5.attr({x: cc.director.getWinSize().width/2+80*2, y:40});
        this.itemBoxList[4] = this.itemBox5;

    },

    //called when in contact with enemy and when adding food item
    updateHealth: function () {
        var playerLayer = this.getParent().gameLayer.getChildByTag(TagOfLayer.Player);
        this.labelHealth.setString("Health: " + playerLayer.playerList[playerLayer.currentPlayerID].character.health);
    },

    updateScore: function () {
        var playerLayer = this.getParent().gameLayer.getChildByTag(TagOfLayer.Player);
        this.labelScore.setString("Score: " + playerLayer.playerList[playerLayer.currentPlayerID].character.score);
    },

    //called when adding and deleting items
    updateInventory: function() {
        var playerLayer = this.getParent().gameLayer.getChildByTag(TagOfLayer.Player);
        for (var i = 0; i < playerLayer.playerList[playerLayer.currentPlayerID].character.inventoryCapacity; i++) {
            if (playerLayer.playerList[playerLayer.currentPlayerID].character.inventory[i] == null) {
                if(this.itemContentList[i] != null) {
                    this.removeChild(this.itemContentList[i]);
                }
            } else {
                var itemType = playerLayer.playerList[playerLayer.currentPlayerID].character.inventory[i].itemType;
                this.removeChild(this.itemContentList[i]);
                if (playerLayer.playerList[playerLayer.currentPlayerID].character.inventory[i].isSuper) {
                    switch(itemType) {
                        case ITEM_TYPE.healthPoint:
                            this.itemContentList[i] = new cc.Sprite(res.object_super_health_png);
                            cc.log("just added health point item to invbox");
                            break;
                        case ITEM_TYPE.hitPoint:
                            this.itemContentList[i] = new cc.Sprite(res.object_super_hit_png);
                            cc.log("just added hit point item to invbox");
                            break;
                        case ITEM_TYPE.speed:
                            this.itemContentList[i] = new cc.Sprite(res.object_super_speed_png);
                            cc.log("just added speed point item to invbox");
                            break;
                    }
                } else {
                    switch(itemType) {
                        case ITEM_TYPE.healthPoint:
                            this.itemContentList[i] = new cc.Sprite(res.object_health_point_png);
                            cc.log("just added health point item to invbox");
                            break;
                        case ITEM_TYPE.hitPoint:
                            this.itemContentList[i] = new cc.Sprite(res.object_hit_point_png);
                            cc.log("just added hit point item to invbox");
                            break;
                        case ITEM_TYPE.speed:
                            this.itemContentList[i] = new cc.Sprite(res.object_speed_point_png);
                            cc.log("just added speed point item to invbox");
                            break;
                    }
                }

                this.itemContentList[i].setScale(0.1);
                this.itemContentList[i].attr({x:this.itemBoxList[i].getPositionX(), y:this.itemBoxList[i].getPositionY()});
                this.addChild(this.itemContentList[i]);
            }
        }
        this.labelHealth.setString("Health: " + playerLayer.playerList[playerLayer.currentPlayerID].character.health);
        this.labelHealthPoint.setString("HealthPoint: " + playerLayer.playerList[playerLayer.currentPlayerID].character.healthPoint);
        this.labelHitPoint.setString("HitPoint: " + playerLayer.playerList[playerLayer.currentPlayerID].character.hitPoint);
        this.labelSpeed.setString("Speed: " + playerLayer.playerList[playerLayer.currentPlayerID].character.speed.toFixed(1));

    }
});