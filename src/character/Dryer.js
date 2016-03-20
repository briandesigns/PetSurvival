var Dryer = Character.extend({



    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.enemy, new cc.PhysicsSprite(res.character_dryer_png), ENEMY_STATS.baseHealth-30, ENEMY_STATS.baseHealthPoint-30, ENEMY_STATS.baseHitPoint-1, ENEMY_STATS.baseSpeed+3,  ENEMY_STATS.inventoryCapacity, space);
    }
});