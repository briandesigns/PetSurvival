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
    },
    update: function () {
        var playerLayer = this.gameLayer.getChildByTag(TagOfLayer.Player);
        var eyeX = playerLayer.getEyeX();

        this.setPosition(cc.p(-eyeX,0));
    }
});