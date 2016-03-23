var HydrantSpawn = EnemySpawn.extend({

    ctor: function (space) {
        this._super(new cc.PhysicsSprite(res.spawn_hydrant_png), SPAWN_STATS.baseHealth, SPAWN_STATS.baseCapacity, SPAWN_STATS.baseSpriteScale, SPAWN_TYPE.hydrant, space);


    }

});