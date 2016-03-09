var Vacuum = Character.extend({



    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function () {
        this._super(CHARACTER_TYPE.enemy, new cc.PhysicsSprite(res.character_vacuum_png), 100, 100, 100, 1.0, {}, 5)
    },

    maximizeHealth: function() {

    },

    setHealth: function(h) {

    },

    setHitPoint: function(hp) {

    },

    dropAllItems: function() {

    },

    dropItem: function(itemName) {

    }
});