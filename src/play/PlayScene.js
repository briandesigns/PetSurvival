/**
 * Created by brian on 2/13/16.
 */

var PlayScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        this.addChild(new MapLayer());
        this.addChild(new PlayerLayer());
    }
});