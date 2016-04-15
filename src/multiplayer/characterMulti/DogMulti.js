

var DogMulti = Character.extend({
    
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.player, new cc.PhysicsSprite(res.character_dog_png), PLAYER_STATS.baseHealth, PLAYER_STATS.baseHealthPoint, PLAYER_MULTI_STATS.baseHitPoint, PLAYER_MULTI_STATS.baseSpeed, PLAYER_MULTI_STATS.baseSpeedDuration, PLAYER_MULTI_STATS.inventoryCapacity, space, res.dog_plist, res.dog_png, "dog");
        this.characterType = CHAR_TYPE.dog;

    }
});