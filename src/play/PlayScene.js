/**
 * Created by brian on 2/13/16.
 */

var PlayScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        this.gameLayer = new cc.Layer();

        this.gameLayer.addChild(new MapLayer(), 0, TagOfLayer.Map);
        this.gameLayer.addChild(new PlayerLayer(), 0, TagOfLayer.Player);
        this.addChild(this.gameLayer);

        this.scheduleUpdate();
    },
    update: function (dt) {
        //moves the map in the opposite direction of player movement
        var playerLayer = this.gameLayer.getChildByTag(TagOfLayer.Player);
        var eyeX = playerLayer.getEyeX();
        var eyeY = playerLayer.getEyeY();
        this.gameLayer.setPosition(cc.p(-eyeX,-eyeY));
    }
});