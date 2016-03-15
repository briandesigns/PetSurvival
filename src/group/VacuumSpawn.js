var VacuumSpawn = EnemySpawn.extend({

    ctor: function (space) {
        this._super(COLLISION_TYPE.enemySpawn, new cc.PhysicsSprite(res.spawn_vacuum_png), 500, 5, 0.05, SPAWN_TYPE.vacuum, space);

    }

});