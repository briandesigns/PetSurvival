var Player = cc.Class.extend({
    /**
     * player class, contains the character the player has chosen
     */
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