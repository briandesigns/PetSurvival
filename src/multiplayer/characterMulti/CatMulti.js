/**
 * Created by Joe on 2016-04-13.
 */

var CatMulti = Character.extend({



    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.player,new cc.PhysicsSprite(res.character_cat_png), PLAYER_MULTI_STATS.baseHealth, PLAYER_MULTI_STATS.baseHealthPoint, PLAYER_MULTI_STATS.baseHitPoint, PLAYER_MULTI_STATS.baseSpeed, PLAYER_MULTI_STATS.baseSpeedDuration, PLAYER_MULTI_STATS.inventoryCapacity, space, res.cat_plist, res.can_png, "cat");
        this.characterType = CHAR_TYPE.cat;
    }
});