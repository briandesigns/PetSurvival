var Boss = Character.extend({

    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.enemy, new cc.PhysicsSprite(res.character_boss_png), ENEMY_STATS.baseHealth*8, ENEMY_STATS.baseHealthPoint*8, ENEMY_STATS.baseHitPoint*4, ENEMY_STATS.baseSpeed*0.5, ENEMY_STATS.baseSpeedDuration*2, ENEMY_STATS.inventoryCapacity, space);
        this.characterType = CHAR_TYPE.boss;
        this.projectileCount = 50;
    }
});