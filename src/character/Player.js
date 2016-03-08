var Player = cc.Class.extend({

    sprite: null,

    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function () {
        this.sprite = new cc.Sprite(res.character_bunny_png);
    },

});