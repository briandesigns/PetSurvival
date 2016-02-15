/**
 * Created by brian on 2/13/16.
 */

var MainMenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainMenuLayer();
        layer.init();
        this.addChild(layer);
    }
});