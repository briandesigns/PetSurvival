var Player = cc.Node.extend({

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