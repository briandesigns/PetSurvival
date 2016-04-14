/**
 * Created by Joe on 2016-04-13.
 */

var PigMulti = Character.extend({
    
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.player, new cc.PhysicsSprite(res.character_pig_png), PLAYER_MULTI_STATS.baseHealth+20, PLAYER_MULTI_STATS.baseHealthPoint+20, PLAYER_MULTI_STATS.baseHitPoint-5, PLAYER_MULTI_STATS.baseSpeed-0.4, PLAYER_MULTI_STATS.baseSpeedDuration,  PLAYER_MULTI_STATS.inventoryCapacity, space, res.pig_plist, res.pig_png, "pig");
        this.characterType = CHAR_TYPE.pig;
    }
});