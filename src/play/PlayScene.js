/**
 * The class that contains the main scene of the whole game
 * this is the scene where the player gets to control its character and complete the objectives
 * on the map
 * this class contains the main method called update that controls the execution of our game
 * from frame to frame
 */
var PlayScene = cc.Scene.extend({

    /**
     * instance fields
     */
    space: null, //environment where we put physical bodies created by the physics engine chipmunk2D
    gameLayer: null, //the layer of PlayScene that contains all other layers
    playerLayer: null, //the layer of PlayScene that contains the playable character
    mapLayer: null, //the layer of PlayScene that holds the tiled map
    enemyLayer: null, //the layer of PlayScene that holds all enemy elements
    boundLayer: null,// the layer of PlayScene where we put all the map boundaries
    itemLayer: null, //the layer of PlayScene where we put all items that could be picked up
    locationLayer:null,
    hudLayer:null,
    trash: null, //a buffer to contain all elements that should be eliminated from map after death

    /**
     * Set environment for for physical bodies and set environment gravity
     */
    initPhysics: function () {
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, 0);
    },

    /**
     * Add collision callbacks for Player/Enemy, Player/EnemySpawn and Player/Item collisions
     */
    initCollisions: function () {
        this.space.addCollisionHandler(COLLISION_TYPE.player, COLLISION_TYPE.enemy,
            this.collisionPlayerEnemyBegin.bind(this), null, null, this.collisionPlayerEnemyEnd.bind(this));
        this.space.addCollisionHandler(COLLISION_TYPE.player, COLLISION_TYPE.enemySpawn,
            this.collisionPlayerEnemySpawnBegin.bind(this), null, null, this.collisionPlayerEnemySpawnEnd.bind(this));
        this.space.addCollisionHandler(COLLISION_TYPE.player, COLLISION_TYPE.item,
            this.collisionPlayerItemBegin.bind(this), null, null);
        this.space.addCollisionHandler(COLLISION_TYPE.player, COLLISION_TYPE.end,
            this.collisionPlayerGoalBegin.bind(this), null, null);
    },

    /**
     * Executed at the beginning of Player/Enemy collision
     * add each other to their respective collisionList to initiate attack and damage logic
     * @param arbiter class that contains the 2 colliding elements
     * @param space physical environment
     * @returns {boolean} true if we want the collision to proceed normally, false otherwise
     */
    collisionPlayerEnemyBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var enemy = this.enemyLayer.getEnemyByShape(shapes[1]);
        var playerCharacter = this.playerLayer.getPlayerByShape(shapes[0]).character;
        enemy.collisionList.push(playerCharacter);
        playerCharacter.collisionList.push(enemy);
        cc.log("collision detected");
        return true;
    },

    /**
     * Executed at the end of Player/Enemy collision, when they separate
     * remove each other to their respective collisionList to stop attack and damage logic
     * @param arbiter class that contains the 2 colliding elements
     * @param space physical environment
     * @returns {boolean} true if we want the collision to proceed normally, false otherwise
     */
    collisionPlayerEnemyEnd: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var enemy = this.enemyLayer.getEnemyByShape(shapes[1]);
        var playerCharacter = this.playerLayer.getPlayerByShape(shapes[0]).character;
        enemy.removeCollisionByChar(playerCharacter);
        playerCharacter.removeCollisionByChar(enemy);
        cc.log("collision resolved");
        this.hudLayer.updateHealth();
        return true;
    },

    /**
     * Executed at the beginning of Player/EnemySpawn collision
     * add spawn to players collisionList to facilitate attack and damage logic
     * @param arbiter class that contains the 2 colliding elements
     * @param space physical environment
     * @returns {boolean} true if we want the collision to proceed normally, false otherwise
     */
    collisionPlayerEnemySpawnBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var spawn = this.enemyLayer.getSpawnByShape(shapes[1]);
        this.playerLayer.getPlayerByShape(shapes[0]).character.collisionList.push(spawn);
        cc.log("collision detected");
        return true;
    },

    /**
     * Executed at the end of Player/EnemySpawn collision, when they separate
     * remove spawn from players collisionList to end  attack and damage logic
     * @param arbiter class that contains the 2 colliding elements
     * @param space physical environment
     * @returns {boolean} true if we want the collision to proceed normally, false otherwise
     */
    collisionPlayerEnemySpawnEnd: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var enemy = this.enemyLayer.getEnemyByShape(shapes[1]);
        var playerCharacter = this.playerLayer.getPlayerByShape(shapes[0]).character;
        playerCharacter.removeCollisionByChar(enemy);
        cc.log("collision resolved");
        return true;
    },

    /**
     * Executed at the beginning of Player/Item collision
     * simply call addItem method of player
     * @param arbiter class that contains the 2 colliding elements
     * @param space physical environment
     * @returns {boolean} true if we want the collision to proceed normally, false otherwise
     */
    collisionPlayerItemBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var item = this.itemLayer.getItemByShape(shapes[1]);
        this.playerLayer.addItem(item);
        cc.log("collision detected");
        return true;
    },

    collisionPlayerGoalBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        cc.log("End of Game");
        cc.log("collision detected");
        return true;
    },

    /**
     * Move player to Spawn point and zoom into the player
     * @param dt time frame(unused)
     */
    positionPlayer: function (dt) {
        var moveAction = new cc.moveTo(1, cc.p(this.locationLayer.start.body.p.x, this.locationLayer.start.body.p.y));
        this.playerLayer.player.character.sprite.runAction(new cc.Sequence(moveAction));
        var zoomAction = new cc.scaleBy(1, 1.5, 1.5);
        this.gameLayer.runAction(new cc.Sequence(zoomAction));
    },

    /**
     * Enemy AI
     * for every enemy on the map, make them move randomly
     * this is called every few seconds
     * @param dt time interval
     */
    enemyBehavior: function (dt) {
        for (var i = 0; i < this.enemyLayer.enemySpawnList.length; i++) {
            var enemySpawn = this.enemyLayer.enemySpawnList[i];
            for (var j = 0; j < enemySpawn.enemyList.length; j++) {
                var enemy = enemySpawn.enemyList[j];
                if(enemy.collisionList.length>0) {
                    //while(enemy.collisionList.length !=0) {
                        enemy.attackEnemies();
                    //}
                } else if (enemy.distanceFromChar(this.playerLayer.player.character) < 60.0) {
                    //while(enemy.distanceFromChar(this.playerLayer.player.character) > 2) {
                        if (enemy.body.p.x > this.playerLayer.player.character.body.p.x) {
                            enemy.moveLeft();
                        } else {
                            enemy.moveRight();
                        }
                        if (enemy.body.p.y > this.playerLayer.player.character.body.p.y) {
                            enemy.moveDown();
                        } else {
                            enemy.moveUp();
                        }

                    //}
                }  else {
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
                        }
                    }
                }
            }
        }
    },

    /**
     * Spawn new enemies
     * This is called at a specifc time interval
     * @param dt time interval
     */
    spawnEnemy: function (dt) {
        this.enemyLayer.spawnEnemy();
    },

    /**
     * Method that checks if an element has died on the map, then puts them into the trash to be
     * destroyed
     */
    trashDeadThings: function () {
        for (var i = 0; i < this.enemyLayer.enemySpawnList.length; i++) {
            var spawn = this.enemyLayer.enemySpawnList[i];
            if (spawn.health <= 0) {
                this.trash.push(spawn);
            }
            for (var j = 0; j < spawn.enemyList.length; j++) {
                var enemy = spawn.enemyList[j];
                if (enemy.health <= 0) {
                    this.trash.push(enemy);
                }
            }
        }
    },

    /**
     * Destroy dead elements
     */
    emptyTrash: function () {
        for (var i = 0; i < this.trash.length; i++) {
            this.trash[i].die();
        }
        this.trash = [];
    },


    /**
     * Scene Initialization
     * like a constructor, called once at the beginning
     */
    onEnter: function () {
        this._super();
        this.initPhysics();
        this.trash = [];
        this.gameLayer = new cc.Layer();
        this.hudLayer = new HudLayer();
        this.playerLayer = new PlayerLayer(this.space);
        this.mapLayer = new MapLayer(this.space);
        this.boundLayer = new BoundLayer(this.space, this.mapLayer);
        this.itemLayer = new ItemLayer(this.space);
        this.enemyLayer = new EnemyLayer(this.space);
        this.locationLayer = new LocationLayer(this.space, this.mapLayer);
        this.gameLayer.addChild(this.mapLayer, 0, TagOfLayer.Map);
        this.gameLayer.addChild(this.playerLayer, 0, TagOfLayer.Player);
        this.gameLayer.addChild(this.enemyLayer, 0, TagOfLayer.Enemy);
        this.gameLayer.addChild(this.boundLayer, 0, TagOfLayer.Bound);
        this.gameLayer.addChild(this.itemLayer, 0, TagOfLayer.Item);
        this.gameLayer.addChild(this.locationLayer, 0, TagOfLayer.Location);
        this.initCollisions();
        this.addChild(this.gameLayer);
        this.addChild(this.hudLayer,0, TagOfLayer.Hud);
        this.scheduleUpdate();//execute main method every frame
        this.scheduleOnce(this.positionPlayer); //execute position player to spawn point at first
        this.schedule(this.spawnEnemy, 5); //spawn enemy every 5 seconds
        this.schedule(this.enemyBehavior, 0.5);//move all enemies at every 0.5 seconds interval

    },

    /**
     * Main method, executed at every frame
     * @param dt time interval
     */
    update: function (dt) {
        this.space.step(dt); //drive the chipmunk physics engine at every frame
        var playerLayer = this.gameLayer.getChildByTag(TagOfLayer.Player);
        //keep player centered on the screen and move everything else relative to it at every frame
        var eyeX = playerLayer.getEyeX() * 2.25;
        var eyeY = playerLayer.getEyeY() * 2.25;
        this.gameLayer.setPosition(cc.p(-eyeX, -eyeY));
        this.trashDeadThings();//put things that died in trash
        this.emptyTrash(); //remove dead things
    }
});