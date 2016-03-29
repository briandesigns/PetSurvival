var Boss = Character.extend({

    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this.characterType = CHAR_TYPE.boss;
        this._super(COLLISION_TYPE.enemy, new cc.PhysicsSprite(res.character_boss_png), ENEMY_STATS.baseHealth*8, ENEMY_STATS.baseHealthPoint*8, ENEMY_STATS.baseHitPoint*4, ENEMY_STATS.baseSpeed*2, ENEMY_STATS.baseSpeedDuration*0.5, ENEMY_STATS.inventoryCapacity, space, res.boss_plist, res.boss_png, "boss");
        this.projectileCount = 50;
    }
});