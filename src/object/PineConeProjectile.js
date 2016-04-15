var PineConeProjectile = Projectile.extend({

    /**
     * a range weapon
     */
    /** Constructor
     * @param {cc.SpriteBatchNode *}
     * @param {cp.Space *}
     * @param {cc.p}
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.projectile, new cc.PhysicsSprite(res.object_pine_cone_png), PLAYER_STATS.baseHealth, ITEM_STATS.pineConeDamage, 100, 0.2, space);
    }
});