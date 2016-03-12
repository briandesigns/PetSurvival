var Cave = EnemySpawn.extend({

    ctor: function (space) {
        this._super(COLLISION_TYPE.enemySpawn, new cc.PhysicsSprite(res.spawn_cave_png), 100, 100, 10, 0.5, SPAWN_TYPE.cave, space);

    }

});