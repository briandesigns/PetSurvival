var CanSpawn = EnemySpawn.extend({

    ctor: function (space) {
        this._super(new cc.PhysicsSprite(res.spawn_can_png), 500, 5, 0.05, SPAWN_TYPE.can, space);

    }

});