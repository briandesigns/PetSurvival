/**
 * scene that runs the main menu
 */
var MainMenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainMenuLayer();
        layer.init();
        this.addChild(layer);
    }
});