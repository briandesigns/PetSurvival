/**
 * Created by brian on 2/13/16.
 */
var MapLayer = cc.Layer.extend({
    map:null,

    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();

        this.map = new cc.TMXTiledMap(res.map_tmx);
        this.addChild(this.map);

        this.scheduleUpdate();
    }
});
