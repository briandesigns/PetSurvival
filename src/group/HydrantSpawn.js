var HydrantSpawn = EnemySpawn.extend({

    ctor: function (space) {
        this._super(new cc.PhysicsSprite(res.spawn_hydrant_png), 500, 5, 0.05, SPAWN_TYPE.hydrant, space);

    }

});