var Pig = Character.extend({



    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.player, new cc.PhysicsSprite(res.character_pig_png), PLAYER_STATS.baseHealth+20, PLAYER_STATS.baseHealthPoint+20, PLAYER_STATS.baseHitPoint-5, PLAYER_STATS.baseSpeed-2,  PLAYER_STATS.inventoryCapacity, space);
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