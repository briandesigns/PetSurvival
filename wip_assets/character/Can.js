var Can = Character.extend({



    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.enemy, new cc.PhysicsSprite(res.character_can_png), 100, 100, 100, 1.0, {}, 5, space, res.can_plist, res.can_png, "can")
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