/**
 * Created by brian on 2/13/16.
 */
var EnemyLayer = cc.Layer.extend({
    space: null,
    enemySpawnList: null,
    ctor: function (space, enemySpawnList) {
        this._super();
        this.space = space;
        this.enemySpawnList = enemySpawnList;
        this.init();

    },
init: function () {
        this._super();
    if (this.enemySpawnList == null) {
        this.enemySpawnList = [];
        this.createSpawns();
    } else {
        for (var i = 0; i < this.enemySpawnList.length; i++) {
            var spawn = this.enemySpawnList[i];
            this.addChild(spawn.sprite);
            for (var j = 0; j < spawn.enemyList.length; j++) {
                var enemy = spawn.enemyList[j];
                this.addChild(enemy.sprite);
            }
        }
    }

    },

    createSpawns: function() {
        this.enemySpawnList[0] = new HydrantSpawn(this.space);
        this.enemySpawnList[1] = new DryerSpawn(this.space);
        this.enemySpawnList[2] = new CanSpawn(this.space);
        this.enemySpawnList[3] = new VacuumSpawn(this.space);
        this.enemySpawnList[4] = new BossSpawn(this.space);
        this.enemySpawnList[5] = new BossSpawn(this.space);
        this.enemySpawnList[6] = new BossSpawn(this.space);

        for (var i = 0; i < this.enemySpawnList.length; i++) {
            this.enemySpawnList[i].body.setPos(cc.p(
                1000 + (Math.random()*1000) - (Math.random()*1000),
                1000+ (Math.random()*1000) - (Math.random()*1000))) ;
            this.addChild(this.enemySpawnList[i].sprite);
        }
    },

    spawnEnemy: function() {
        for (var i = 0; i< this.enemySpawnList.length; i++) {
            var enemySpawn = this.enemySpawnList[i];
            //cc.log("spawn" + i + "created, " + "spawn capacity: " + enemySpawn.capacity+ ", enemylist: " + enemySpawn.enemyList.length);
            if (enemySpawn.enemyList.length<enemySpawn.capacity) {
                var enemy = null;
                switch(enemySpawn.spawnType) {
                    case SPAWN_TYPE.can:
                        enemy = new Can(this.space);
                        break;
                    case SPAWN_TYPE.dryer:
                        enemy = new Dryer(this.space);
                        break;
                    case SPAWN_TYPE.vacuum:
                        enemy = new Vacuum(this.space);
                        break;
                    case SPAWN_TYPE.hydrant:
                        enemy = new Hydrant(this.space);
                        break;
                    default:
                        enemy = new Can(this.space);
                }
                enemySpawn.enemyList.push(enemy);
                enemy.body.setPos(cc.p(enemySpawn.body.p.x, enemySpawn.body.p.y));
                this.addChild(enemy.sprite);
            }
        }

    },

    getSpawnByShape: function(shape) {
        for (var i = 0; i < this.enemySpawnList.length; i++) {
            var spawn = this.enemySpawnList[i];
            if (spawn.shape == shape) {
                return spawn;
            }
        }
        return null;
    },

    getEnemyByShape: function(shape) {
        for (var i = 0; i < this.enemySpawnList.length; i++) {
            var spawn = this.enemySpawnList[i];
            for (var j = 0; j< spawn.enemyList.length; j++) {
                var enemy = spawn.enemyList[j];
                if (enemy.shape == shape) {
                    return enemy;
                }
            }
        }
        return null;
    }
});

