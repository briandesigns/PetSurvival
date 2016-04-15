/**
 * layer that contains all enemy spawns and enemies
 */
var EnemyLayer = cc.Layer.extend({
    space: null,
    enemySpawnList: null,
    funChecker: null,
    mapLayer: null,

    ctor: function (space, mapLayer, enemySpawnList, funChecker) {
        this._super();
        this.space = space;
        this.mapLayer = mapLayer;
        this.enemySpawnList = enemySpawnList;
        this.funChecker = funChecker;
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

    /**
     * generate spawns and set their location randomly
     */
    createSpawns: function () {
        this.enemySpawnList[0] = new HydrantSpawn(this.space);
        this.enemySpawnList[1] = new DryerSpawn(this.space);
        this.enemySpawnList[2] = new CanSpawn(this.space);
        this.enemySpawnList[3] = new BossSpawn(this.space);

        // If map size is medium or bigger add more enemies
        if (chosenMapSize != MAP_SIZE.small) {
            this.enemySpawnList[4] = new VacuumSpawn(this.space);
            this.enemySpawnList[5] = new BossSpawn(this.space);

            // If map size is large add even more enemies
            if (chosenMapSize == MAP_SIZE.big) {
                this.enemySpawnList[0] = new HydrantSpawn(this.space);
                this.enemySpawnList[1] = new DryerSpawn(this.space);
                this.enemySpawnList[2] = new CanSpawn(this.space);
                this.enemySpawnList[6] = new BossSpawn(this.space);
            }
        }

        var spawnLocations = this.funChecker.objectLocations;

        for (var i = 0; i < this.enemySpawnList.length; i++) {
            var xCoord = this.mapLayer.coordinateAtTileIndex(spawnLocations[i]).x + 16;
            var yCoord = this.mapLayer.coordinateAtTileIndex(spawnLocations[i]).y + 16;

            this.enemySpawnList[i].body.setPos(cc.p(xCoord, yCoord));
            this.addChild(this.enemySpawnList[i].sprite);
        }
    },

    /**
     * spawn 1 enemy for each spawn,, this is called at different time steps
     */
    spawnEnemy: function () {
        for (var i = 0; i < this.enemySpawnList.length; i++) {
            var enemySpawn = this.enemySpawnList[i];
            //cc.log("spawn" + i + "created, " + "spawn capacity: " + enemySpawn.capacity+ ", enemylist: " + enemySpawn.enemyList.length);
            if (enemySpawn.enemyList.length < enemySpawn.capacity) {
                var enemy = null;
                switch (enemySpawn.spawnType) {
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

    /**
     * find the spawn given its sprite on the map
     * @param shape
     * @returns {*}
     */
    getSpawnByShape: function (shape) {
        for (var i = 0; i < this.enemySpawnList.length; i++) {
            var spawn = this.enemySpawnList[i];
            if (spawn.shape == shape) {
                return spawn;
            }
        }
        return null;
    },

    /**
     * find the enemy of a spawn gven its sprite on the map
     * @param shape
     * @returns {*}
     */
    getEnemyByShape: function (shape) {
        for (var i = 0; i < this.enemySpawnList.length; i++) {
            var spawn = this.enemySpawnList[i];
            for (var j = 0; j < spawn.enemyList.length; j++) {
                var enemy = spawn.enemyList[j];
                if (enemy.shape == shape) {
                    return enemy;
                }
            }
        }
        return null;
    }
});

