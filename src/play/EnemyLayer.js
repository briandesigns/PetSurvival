/**
 * Created by brian on 2/13/16.
 */
var EnemyLayer = cc.Layer.extend({
    space: null,
    enemySpawnList: null,
    ctor: function (space) {
        this._super();
        this.space = space;
        this.init();
    },
    init: function () {
        this._super();
        this.enemySpawnList = [];
        this.createSpawns();

    },

    createSpawns: function() {
        for (var i = 0; i < 5; i++) {
            this.enemySpawnList[i] = new Cave();
            this.space.addBody(this.enemySpawnList[i].body);
            this.space.addShape(this.enemySpawnList[i].shape);
            this.enemySpawnList[i].body.setPos(cc.p((cc.director.getWinSize().width / 2) + (Math.random()*1000) - (Math.random()*1000), (cc.director.getWinSize().height / 2)+ (Math.random()*1000) - (Math.random()*1000))) ;
            this.addChild(this.enemySpawnList[i].sprite);
        }
    },

    spawnEnemy: function() {
        for (var i = 0; i< this.enemySpawnList.length; i++) {
            var enemySpawn = this.enemySpawnList[i];
            if (enemySpawn.enemyList.length<=enemySpawn.capacity) {
                var enemy = null;
                switch(enemySpawn.spawnType) {
                    case SPAWN_TYPE.can:
                        enemy = new Can();
                        break;
                    case SPAWN_TYPE.dryer:
                        enemy = new Dryer();
                        break;
                    case SPAWN_TYPE.vacuum:
                        enemy = new Vacuum();
                        break;
                    case SPAWN_TYPE.hydrant:
                        enemy = new Hydrant();
                        break;
                    default:
                        enemy = new Can();
                }
                enemySpawn.enemyList.push(enemy);
                this.space.addBody(enemy.body);
                this.space.addShape(enemy.shape);
                enemy.body.setPos(cc.p(enemySpawn.body.p.x, enemySpawn.body.p.y));
                this.addChild(enemy.sprite);
            }
        }

    }
});

