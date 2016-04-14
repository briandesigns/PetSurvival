/**
 * Created by Joe on 2016-04-13.
 */

var RabbitMulti = Character.extend({

    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.player, new cc.PhysicsSprite(res.character_rabbit_png), PLAYER_MULTI_STATS.baseHealth, PLAYER_MULTI_STATS.baseHealthPoint, PLAYER_MULTI_STATS.baseHitPoint, PLAYER_MULTI_STATS.baseSpeed, PLAYER_MULTI_STATS.baseSpeedDuration, PLAYER_MULTI_STATS.inventoryCapacity, space, res.rabbit_plist, res.rabbit_png, "rabbit");
        this.characterType = CHAR_TYPE.rabbit;

    }
});