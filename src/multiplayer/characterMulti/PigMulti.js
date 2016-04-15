var PigMulti = Character.extend({
    
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.player, new cc.PhysicsSprite(res.character_pig_png), PLAYER_MULTI_STATS.baseHealth, PLAYER_MULTI_STATS.baseHealthPoint, PLAYER_MULTI_STATS.baseHitPoint, PLAYER_MULTI_STATS.baseSpeed, PLAYER_MULTI_STATS.baseSpeedDuration,  PLAYER_STATS.inventoryCapacity, space, res.pig_plist, res.pig_png, "pig");
        this.characterType = CHAR_TYPE.pig;
    }
});