/**
 * Created by brian on 2/13/16.
 */

var PlayScene = cc.Scene.extend({
    space: null,
    gameLayer: null,
    playerLayer: null,
    mapLayer: null,
    enemyLayer: null,
    trash: null,

    initPhysics: function () {
        //1. new space object
        this.space = new cp.Space();
        //2. setup the  Gravity
        this.space.gravity = cp.v(0, 0);




    },

    initCollisions: function() {
        this.space.addCollisionHandler(COLLISION_TYPE.player, COLLISION_TYPE.enemy,
            this.collisionPlayerEnemyBegin.bind(this), null, null, null);
        this.space.addCollisionHandler(COLLISION_TYPE.player, COLLISION_TYPE.enemySpawn,
            this.collisionPlayerEnemySpawnBegin.bind(this), null, null, null);
    },

    collisionPlayerEnemyBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();

        var enemy = this.enemyLayer.getEnemyByShape(shapes[1]);
        enemy.health = 0;
        cc.log("collision detected");
        return true;
    },

    collisionPlayerEnemySpawnBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();

        var spawn = this.enemyLayer.getSpawnByShape(shapes[1]);
        spawn.health = 0;
        cc.log("collision detected");
        return true;
    },

    onEnter: function () {
        this._super();
        this.initPhysics();
        this.gameLayer = new cc.Layer();
        this.playerLayer = new PlayerLayer(this.space);
        this.mapLayer = new MapLayer(this.space);
        this.trash = [];

        this.enemyLayer = new EnemyLayer(this.space);
        this.gameLayer.addChild(this.mapLayer, 0, TagOfLayer.Map);
        this.gameLayer.addChild(this.playerLayer, 0, TagOfLayer.Player);
        this.gameLayer.addChild(this.enemyLayer, 0, TagOfLayer.Enemy);
        this.initCollisions();
        this.addChild(this.gameLayer);

        this.scheduleUpdate();
        this.schedule(this.spawnEnemy, 1);
        this.schedule(this.enemyBehavior, 0.5);

    },

    enemyBehavior: function(dt) {
        for(var i = 0; i < this.enemyLayer.enemySpawnList.length; i++) {
            var enemySpawn = this.enemyLayer.enemySpawnList[i];
            for (var j = 0; j< enemySpawn.enemyList.length; j++) {
                var enemy = enemySpawn.enemyList[j];
                if (!true) {
                    //todo: do something when theres player present
                } else {
                    var probability = Math.random();
                    if (probability < 0.5) {
                        if (probability<0.1) {
                            enemy.moveUp();
                        } else if (probability>0.1 && probability<=0.2) {
                            enemy.moveDown();
                        } else if (probability>0.2 && probability<=0.3) {
                            enemy.moveLeft();
                        } else if (probability>0.3 && probability<=0.4) {
                            enemy.moveRight();
                        } else {
                            //do nothing
                        }
                    }
                }
            }
        }
    },

    spawnEnemy: function(dt) {
        this.enemyLayer.spawnEnemy();
    },

    trashDeadThings: function() {
        for (var i = 0; i < this.enemyLayer.enemySpawnList.length; i++) {
            var spawn = this.enemyLayer.enemySpawnList[i];
            if (spawn.health == 0) {
                //this.trash.push(spawn);
                //todo: implement destroy spawns
            }
            for (var j = 0; j < spawn.enemyList.length; j++) {
                var enemy = spawn.enemyList[j];
                if (enemy.health == 0) {
                    //todo: this is causing problems with nulls
                    //spawn.enemyList.splice(i,1);
                    this.trash.push(enemy);
                }
            }
        }
    },

    emptyTrash: function() {
        for ( var i = 0; i < this.trash.length; i++) {
            this.trash[i].die();
        }
        this.trash = [];
    },

    update: function (dt) {
        // chipmunk step, tells cocos to start chipmunk
        this.space.step(dt);
        //moves the map in the opposite direction of player movement
        var playerLayer = this.gameLayer.getChildByTag(TagOfLayer.Player);
        var eyeX = playerLayer.getEyeX();
        var eyeY = playerLayer.getEyeY();
        this.gameLayer.setPosition(cc.p(-eyeX, -eyeY));
        this.trashDeadThings();
        this.emptyTrash();


    }
});