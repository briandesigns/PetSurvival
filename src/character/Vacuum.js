var Vacuum = Character.extend({



    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.enemy, new cc.PhysicsSprite(res.character_vacuum_png), ENEMY_STATS.baseHealth-20, ENEMY_STATS.baseHealthPoint-20, ENEMY_STATS.baseHitPoint+1, ENEMY_STATS.baseSpeed+1, ENEMY_STATS.baseSpeedDuration, ENEMY_STATS.inventoryCapacity, space, res.vacuum_plist, res.vacuum_png, "vacuum");
        this.characterType = CHAR_TYPE.vacuum;

    }
});