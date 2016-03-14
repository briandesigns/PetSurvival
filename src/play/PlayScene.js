/**
 * Created by brian on 2/13/16.
 */

var PlayScene = cc.Scene.extend({
    space: null,
    gameLayer: null,
    playerLayer: null,
    mapLayer: null,
    enemyLayer: null,
    boundLayer:null,
    itemLayer:null,
    trash: null,

    initPhysics: function () {
        //1. new space object
        this.space = new cp.Space();
        //2. setup the  Gravity
        this.space.gravity = cp.v(0, 0);


    },

    initCollisions: function () {
        this.space.addCollisionHandler(COLLISION_TYPE.player, COLLISION_TYPE.enemy,
            this.collisionPlayerEnemyBegin.bind(this), null, null, this.collisionPlayerEnemyEnd.bind(this));
        this.space.addCollisionHandler(COLLISION_TYPE.player, COLLISION_TYPE.enemySpawn,
            this.collisionPlayerEnemySpawnBegin.bind(this), null, null, this.collisionPlayerEnemySpawnEnd.bind(this));
        this.space.addCollisionHandler(COLLISION_TYPE.player, COLLISION_TYPE.item,
            this.collisionPlayerItemBegin.bind(this), null, null);
    },

    collisionPlayerEnemyBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();

        var enemy = this.enemyLayer.getEnemyByShape(shapes[1]);
        var playerCharacter = this.playerLayer.getPlayerByShape(shapes[0]).character;
        enemy.collisionList.push(playerCharacter);
        playerCharacter.collisionList.push(enemy);
        cc.log("collision detected");
        return true;
    },

    collisionPlayerEnemyEnd: function (arbiter, space) {
        var shapes = arbiter.getShapes();

        var enemy = this.enemyLayer.getEnemyByShape(shapes[1]);
        var playerCharacter = this.playerLayer.getPlayerByShape(shapes[0]).character;
        enemy.removeCollisionByChar(playerCharacter);
        playerCharacter.removeCollisionByChar(enemy);
        cc.log("collision resolved");
        return true;
    },

    collisionPlayerEnemySpawnBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();

        var spawn = this.enemyLayer.getSpawnByShape(shapes[1]);
        this.playerLayer.getPlayerByShape(shapes[0]).character.collisionList.push(spawn);
        cc.log("collision detected");
        return true;
    },

    collisionPlayerEnemySpawnEnd: function(arbiter, space) {
        var shapes = arbiter.getShapes();

        var enemy = this.enemyLayer.getEnemyByShape(shapes[1]);
        var playerCharacter = this.playerLayer.getPlayerByShape(shapes[0]).character;
        playerCharacter.removeCollisionByChar(enemy);
        cc.log("collision resolved");
        return true;
    },

    collisionPlayerItemBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();

        var item = this.itemLayer.getItemByShape(shapes[1]);
        var playerCharacter = this.playerLayer.getPlayerByShape(shapes[0]).character;
        playerCharacter.addItem(item);
        cc.log("collision detected");
        return true;
    },





    onEnter: function () {
        this._super();
        this.initPhysics();
        this.gameLayer = new cc.Layer();
        this.playerLayer = new PlayerLayer(this.space);
        this.mapLayer = new MapLayer(this.space);
        this.boundLayer = new BoundLayer(this.space, this.mapLayer);
        this.itemLayer = new ItemLayer(this.space);
        this.trash = [];

        this.enemyLayer = new EnemyLayer(this.space);
        this.gameLayer.addChild(this.mapLayer, 0, TagOfLayer.Map);
        this.gameLayer.addChild(this.playerLayer, 0, TagOfLayer.Player);
        this.gameLayer.addChild(this.enemyLayer, 0, TagOfLayer.Enemy);
        this.gameLayer.addChild(this.boundLayer, 0, TagOfLayer.Bound);
        this.gameLayer.addChild(this.itemLayer, 0, TagOfLayer.Item);
        var zoomAction = new cc.scaleBy(1,1.5,1.5);
        this.gameLayer.runAction(new cc.Sequence(zoomAction));
        this.initCollisions();
        this.addChild(this.gameLayer);

        this.scheduleUpdate();
        this.schedule(this.spawnEnemy, 5);
        this.schedule(this.enemyBehavior, 0.5);
        this.scheduleOnce(this.positionPlayer);

    },

    positionPlayer: function(dt) {
        var action1 = new cc.moveTo(0,cc.p(this.mapLayer.coordinateAtTileIndex(0).x,this.mapLayer.coordinateAtTileIndex(0).y));

        this.playerLayer.player.character.sprite.runAction(new cc.Sequence(action1));
    },

    enemyBehavior: function (dt) {
        for (var i = 0; i < this.enemyLayer.enemySpawnList.length; i++) {
            var enemySpawn = this.enemyLayer.enemySpawnList[i];
            for (var j = 0; j < enemySpawn.enemyList.length; j++) {
                var enemy = enemySpawn.enemyList[j];
                if (!true) {
                    //todo: do something when theres player present
                } else {
                    var probability = Math.random();
                    if (probability < 0.5) {
                        if (probability < 0.1) {
                            enemy.moveUp();
                        } else if (probability > 0.1 && probability <= 0.2) {
                            enemy.moveDown();
                        } else if (probability > 0.2 && probability <= 0.3) {
                            enemy.moveLeft();
                        } else if (probability > 0.3 && probability <= 0.4) {
                            enemy.moveRight();
                        } else {
                            //do nothing
                        }
                    }
                }
            }
        }
    },

    spawnEnemy: function (dt) {
        this.enemyLayer.spawnEnemy();
    },

    trashDeadThings: function () {
        for (var i = 0; i < this.enemyLayer.enemySpawnList.length; i++) {
            var spawn = this.enemyLayer.enemySpawnList[i];
            if (spawn.health <= 0) {
                //this.trash.push(spawn);
                //todo: implement destroy spawns
            }
            for (var j = 0; j < spawn.enemyList.length; j++) {
                var enemy = spawn.enemyList[j];
                if (enemy.health <= 0) {
                    //todo: this is causing problems with nulls
                    //spawn.enemyList.splice(i,1);
                    this.trash.push(enemy);
                }
            }
        }
    },

    emptyTrash: function () {
        for (var i = 0; i < this.trash.length; i++) {
            this.trash[i].die();
        }
        this.trash = [];
    },

    update: function (dt) {
        // chipmunk step, tells cocos to start chipmunk
        this.space.step(dt);
        //moves the map in the opposite direction of player movement
        var playerLayer = this.gameLayer.getChildByTag(TagOfLayer.Player);
        var eyeX = playerLayer.getEyeX()*2.25;
        var eyeY = playerLayer.getEyeY()*2.25;
        this.gameLayer.setPosition(cc.p(-eyeX, -eyeY));
        this.trashDeadThings();
        this.emptyTrash();


    }
});