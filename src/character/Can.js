var Can = Character.extend({



    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.enemy, new cc.PhysicsSprite(res.character_can_png), ENEMY_STATS.baseHealth, ENEMY_STATS.baseHealthPoint, ENEMY_STATS.baseHitPoint, ENEMY_STATS.baseSpeed, ENEMY_STATS.baseSpeedDuration, ENEMY_STATS.inventoryCapacity, space);
        this.characterType = CHAR_TYPE.can;

    }
});