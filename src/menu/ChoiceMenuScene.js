/**
 * scene that runs the choice menu
 */
var ChoiceMenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new ChoiceMenuLayer();
        layer.init();
        this.addChild(layer);
    }
});