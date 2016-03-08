var Player = cc.Class.extend({

    character: null,

    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (character) {
        this.character = character;
    },

});