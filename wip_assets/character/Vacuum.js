var Vacuum = Character.extend({



    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.enemy, new cc.PhysicsSprite(res.character_vacuum_png), 100, 100, 100, 1.0, {}, 5, space, res.vacuum_plist, res.vacuum_png, "vacuum");
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