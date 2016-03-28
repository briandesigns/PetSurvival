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
    locationLayer: null,
    hudLayer: null,
    trash: null, //a buffer to contain all elements that should be eliminated from map after death
    hasMovedVertically: null,
    isLoadGame: null,

    /**
     * Set environment for for physical bodies and set environment gravity
     */
    initPhysics: function () {
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, 0);
    },

    ctor: function (isloadGame) {
        this._super();
        this.isLoadGame = isloadGame;
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
        this.space.addCollisionHandler(COLLISION_TYPE.enemy, COLLISION_TYPE.item,
            this.collisionEnemyItemBegin.bind(this), null, null);
        this.space.addCollisionHandler(COLLISION_TYPE.projectile, COLLISION_TYPE.enemy,
            this.collisionProjectileEnemyBegin.bind(this), null, this.collisionProjectileEnemyEnd.bind(this));
    },

    collisionProjectileEnemyBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var proj = this.playerLayer.getProjectileByShape(shapes[0]);
        var enemy = this.enemyLayer.getEnemyByShape(shapes[1]);
        proj.collisionList.push(enemy);
        proj.attackEnemies();
        proj.die();
        return true;
    },

    collisionProjectileEnemyEnd: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var enemy = this.enemyLayer.getEnemyByShape(shapes[1]);
        var proj = this.playerLayer.getProjectileByShape(shapes[0]);
        proj.removeCollisionByChar(enemy);
        return true;
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
        var playerChar = this.playerLayer.player.character;
        var spawn = this.enemyLayer.getSpawnByShape(shapes[1]);
        if (spawn.spawnType == SPAWN_TYPE.boss) {
            spawn.health = 0;
            spawn.die();
            var item;
            for(var i = -1; i > -4; i--) {
                item = this.itemLayer.getItemByID(i);
                if (item.isPlaced == "false") {
                    break;
                }
            }
            cc.log("item type is : " + item.itemType);
            item.body.setPos(cc.p(playerChar.sprite.getPositionX() + 32, playerChar.sprite.getPositionY()));
            item.isPlaced = "true";
            this.playerLayer.player.character.score += spawn.healthPoint;
            this.hudLayer.updateScore();
            saveItems(this.itemLayer,"boss");
            cc.log("player pos before save:" + this.playerLayer.player.character.sprite.getPositionX()+
                " , " + this.playerLayer.player.character.sprite.getPositionY());
            savePlayerChar(this.playerLayer,"boss");
            saveEnemySpawns(this.enemyLayer,"boss");
            saveEnemies(this.enemyLayer,"boss");
            saveLocations(this.locationLayer,"boss");
            saveMap(this.mapLayer, "boss");
            this.removeAllChildren(true);
            cc.director.resume();
            cc.director.pushScene(new BossScene());
        } else {
            this.playerLayer.getPlayerByShape(shapes[0]).character.collisionList.push(spawn);
        }
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
        return true;
    },

    collisionPlayerGoalBegin: function (arbiter, space) {
        cc.director.pause();
        this.showGameOverMenu("WON");
        return true;
    },

    collisionEnemyItemBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var enemy = this.enemyLayer.getEnemyByShape(shapes[0]);
        var item = this.itemLayer.getItemByShape(shapes[1]);
        enemy.addItem(item);
        return true;
    },


    /**
     * Move player to Spawn point and zoom into the player and init hud
     * @param dt time frame(unused)
     */
    positionPlayer: function (dt) {
        if (this.isLoadGame == true) {
            var dict = cc.sys.localStorage;
            var string = dict.getItem("playerChar");
            var tokens = string.split(",");
            var posTokens = tokens[2].split(";");
            this.playerLayer.player.character.sprite.setPosition(cc.p(
                parseFloat(posTokens[0]),
                parseFloat(posTokens[1])));
        } else if (this.isLoadGame == false) {
            this.playerLayer.player.character.sprite.setPosition(cc.p(
                this.locationLayer.start.body.p.x,
                this.locationLayer.start.body.p.y));
        } else if (this.isLoadGame == "boss") {
            var dict = cc.sys.localStorage;
            var string = dict.getItem("bossplayerChar");
            var tokens = string.split(",");
            var posTokens = tokens[2].split(";");
            this.playerLayer.player.character.sprite.setPosition(cc.p(
                parseFloat(posTokens[0]),
                parseFloat(posTokens[1])));
        }
        var zoomAction = new cc.scaleBy(1, 1.5, 1.5);
        this.gameLayer.runAction(new cc.Sequence(zoomAction));
        this.hudLayer.updateHealth();
        this.hudLayer.updateInventory();
        this.hudLayer.updateScore();
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
                if (enemy.collisionList.length > 0) {
                    enemy.attackEnemies();
                    this.hudLayer.updateHealth();
                } else if (enemy.distanceFromChar(this.playerLayer.player.character) < 100 && enemy.distanceFromChar(this.playerLayer.player.character) > 10) {
                    if (this.hasMovedVertically == true) {
                        if (enemy.body.p.x > this.playerLayer.player.character.body.p.x) {
                            enemy.moveLeft();
                        } else {
                            enemy.moveRight();
                        }
                        this.hasMovedVertically = false;

                    } else {
                        if (enemy.body.p.y > this.playerLayer.player.character.body.p.y) {
                            enemy.moveDown();
                        } else {
                            enemy.moveUp();
                        }
                        this.hasMovedVertically = true;
                    }

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
                    //spawn.enemyList.splice(j,1);
                }
            }
        }
        if(this.playerLayer.player.character.health <= 0) {
            this.showGameOverMenu("LOST");
        }
    },

    /**
     * Destroy dead elements
     */
    emptyTrash: function () {
        for (var i = 0; i < this.trash.length; i++) {
            cc.log("score added: " + this.trash[i].healthPoint);
            this.playerLayer.player.character.score += this.trash[i].healthPoint;
            this.hudLayer.updateScore();
            this.trash[i].die();
        }
        this.trash = [];
    },

    showGameOverMenu: function (winLoss) {
        var gameOverLayer = new OverMenuLayer(this.playerLayer.player.character.score, winLoss);
        gameOverLayer.init();
        this.addChild(gameOverLayer);
    },

    /**
     * Scene Initialization
     * like a constructor, called once at the beginning
     */
    onEnter: function () {
        this._super();
        this.initPhysics();
        this.trash = [];
        this.hasMovedVertically = false;
        this.gameLayer = new cc.Layer();
        this.hudLayer = new HudLayer();
        if (this.isLoadGame == true) {
            this.mapLayer = new MapLayer(this.space, loadTmxMap(""), loadCollisionArray(""),
                loadTiledMapsWide(""), loadTiledMapsHigh(""), loadTotalTiledMaps(""),
                loadTiledMapWidth(""), loadTiledMapHeight(""));
            this.itemLayer = new ItemLayer(this.space, this.mapLayer, loadItems(this.space, ""), false);
            this.playerLayer = new PlayerLayer(this.space, loadPlayerChar(this.space, this.itemLayer, ""));
            this.enemyLayer = new EnemyLayer(this.space,loadEnemies(this.space, this.itemLayer, ""));
            this.locationLayer = new LocationLayer(this.space, this.mapLayer, loadLocations(this.space, ""));
        } else if (this.isLoadGame == false) {
            this.mapLayer = new MapLayer(this.space, null, null, null, null, null, null, null);
            this.itemLayer = new ItemLayer(this.space, this.mapLayer,null, false);
            this.playerLayer = new PlayerLayer(this.space, new Dog(this.space));
            this.enemyLayer = new EnemyLayer(this.space, null);
            this.locationLayer = new LocationLayer(this.space, this.mapLayer, null);
        } else if (this.isLoadGame == "boss"){
            cc.log("Loading boss save");
            this.mapLayer = new MapLayer(this.space, loadTmxMap("boss"), loadCollisionArray("boss"),
                loadTiledMapsWide("boss"), loadTiledMapsHigh("boss"), loadTotalTiledMaps("boss"),
                loadTiledMapWidth("boss"), loadTiledMapHeight("boss"));
            this.itemLayer = new ItemLayer(this.space, this.mapLayer, loadItems(this.space, "boss"), false);
            this.playerLayer = new PlayerLayer(this.space, loadPlayerChar(this.space, this.itemLayer, "boss"));
            this.enemyLayer = new EnemyLayer(this.space,loadEnemies(this.space, this.itemLayer, "boss"));
            this.locationLayer = new LocationLayer(this.space, this.mapLayer, loadLocations(this.space, "boss"));
        }
        this.boundLayer = new BoundLayer(this.space, this.mapLayer);
        this.gameLayer.addChild(this.mapLayer, 0, TagOfLayer.Map);
        this.gameLayer.addChild(this.playerLayer, 0, TagOfLayer.Player);
        this.gameLayer.addChild(this.enemyLayer, 0, TagOfLayer.Enemy);
        this.gameLayer.addChild(this.boundLayer, 0, TagOfLayer.Bound);
        this.gameLayer.addChild(this.itemLayer, 0, TagOfLayer.Item);
        this.gameLayer.addChild(this.locationLayer, 0, TagOfLayer.Location);
        this.addChild(this.gameLayer);
        this.addChild(this.hudLayer, 0, TagOfLayer.Hud);
        this.positionPlayer();
        this.initCollisions();
        this.scheduleUpdate();//execute main method every frame
        //this.scheduleOnce(this.positionPlayer); //execute position player to spawn point at first
        this.schedule(this.spawnEnemy, 5); //spawn enemy every 5 seconds
        this.schedule(this.enemyBehavior, 0.5);//move all enemies at every 0.5 seconds interval
    },

    onExit: function () {
        this._super();
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