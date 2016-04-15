var BossSpawn = EnemySpawn.extend({

    ctor: function (space) {
        this._super(new cc.PhysicsSprite(res.spawn_boss_png), SPAWN_STATS.baseHealth*50, SPAWN_STATS.baseCapacity*0, SPAWN_STATS.baseSpriteScale, SPAWN_TYPE.boss, space);
    },

    changeHealth: function () {
        //do nothing since boss spawn cannot be attacked
    }



});