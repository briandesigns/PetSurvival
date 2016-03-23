var DryerSpawn = EnemySpawn.extend({

    ctor: function (space) {
        this._super(new cc.PhysicsSprite(res.spawn_dryer_png), SPAWN_STATS.baseHealth, SPAWN_STATS.baseCapacity, SPAWN_STATS.baseSpriteScale, SPAWN_TYPE.dryer, space);

    }

});