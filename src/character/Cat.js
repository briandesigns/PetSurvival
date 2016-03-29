var Cat = Character.extend({



    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.player,new cc.PhysicsSprite(res.character_cat_png), PLAYER_STATS.baseHealth, PLAYER_STATS.baseHealthPoint, PLAYER_STATS.baseHitPoint, PLAYER_STATS.baseSpeed, PLAYER_STATS.baseSpeedDuration, PLAYER_STATS.inventoryCapacity, space, res.cat_plist, res.can_png, "cat");
        this.characterType = CHAR_TYPE.cat;
    }
});