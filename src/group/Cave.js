var Cave = EnemySpawn.extend({

    ctor: function () {
        this._super(COLLISION_TYPE.enemySpawn, new cc.PhysicsSprite(res.spawn_cave_png), 100, 100, 100, 0.5);

    }

});