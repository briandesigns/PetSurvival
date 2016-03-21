var Hydrant = Character.extend({



    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.enemy, new cc.PhysicsSprite(res.character_hydrant_png), ENEMY_STATS.baseHealth, ENEMY_STATS.baseHealthPoint, ENEMY_STATS.baseHitPoint+2, ENEMY_STATS.baseSpeed-1,  ENEMY_STATS.inventoryCapacity, space);
        this.characterType = CHAR_TYPE.hydrant;

    }
});