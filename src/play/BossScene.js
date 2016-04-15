/**
 * boss fighting side quest scene
 */
var BossScene = cc.Scene.extend({

    /**
     * instance fields
     */
    space: null, //environment where we put physical bodies created by the physics engine chipmunk2D
    gameLayer: null, //the layer of PlayScene that contains all other layers
    playerLayer: null, //the layer of PlayScene that contains the playable character
    mapLayer: null, //the layer of PlayScene that holds the tiled map
    caveMapLayer: null, //layer that holds the cave map
    boss: null, //the layer of PlayScene that holds all enemy elements
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
            this.collisionPlayerEnemyBegin.bind(this), null, null,
            this.collisionPlayerEnemyEnd.bind(this));
        this.space.addCollisionHandler(COLLISION_TYPE.player, COLLISION_TYPE.item,
            this.collisionPlayerItemBegin.bind(this), null, null);
        this.space.addCollisionHandler(COLLISION_TYPE.enemy, COLLISION_TYPE.item,
            this.collisionEnemyItemBegin.bind(this), null, null);
        this.space.addCollisionHandler(COLLISION_TYPE.projectile, COLLISION_TYPE.enemy,
            this.collisionProjectileEnemyBegin.bind(this), null,
            this.collisionProjectileEnemyEnd.bind(this));
    },

    /**
     * handles when projectile hits an enemy
     * @param arbiter
     * @param space
     * @returns {boolean}
     */
    collisionProjectileEnemyBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var proj = this.playerLayer.getProjectileByShape(shapes[0]);
        var enemy = this.boss;
        proj.collisionList.push(enemy);
        proj.attackEnemies();
        proj.die();
        cc.audioEngine.playEffect(res.sound_projectile);
        return true;
    },

    /**
     * handles when projectile hits an enemy
     * @param arbiter
     * @param space
     * @returns {boolean}
     */
    collisionProjectileEnemyEnd: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var enemy = this.boss;
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
        var enemy = this.boss;
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
        var enemy = this.boss;
        var playerCharacter = this.playerLayer.getPlayerByShape(shapes[0]).character;
        enemy.removeCollisionByChar(playerCharacter);
        playerCharacter.removeCollisionByChar(enemy);
        this.hudLayer.updateHealth();
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


    /**
     * handles when enemy collide with item
     * @param arbiter
     * @param space
     * @returns {boolean}
     */
    collisionEnemyItemBegin: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        var enemy = this.boss;
        var item = this.itemLayer.getItemByShape(shapes[1]);
        enemy.addItem(item);
        return true;
    },


    /**
     * Move player to Spawn point and zoom into the player and init hud
     * @param dt time frame(unused)
     */
    positionPlayer: function (dt) {

        this.playerLayer.player.character.sprite.setPosition(cc.p(
            this.mapLayer.coordinateAtTileIndex(184).x,
            this.mapLayer.coordinateAtTileIndex(184).y - 40));

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

        var enemy = this.boss;
        if (enemy.collisionList.length > 0) {
            enemy.attackEnemies();
            this.hudLayer.updateHealth();
        } else if (enemy.distanceFromChar(this.playerLayer.player.character) < 200 &&
            enemy.distanceFromChar(this.playerLayer.player.character) > 10) {
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
    },


    /**
     * Method that checks if an element has died on the map, then puts them into the trash to be
     * destroyed
     */
    trashDeadThings: function () {
        var enemy = this.boss;
        if (enemy.health <= 0) {
            this.trash.push(enemy);
        }
        if (this.playerLayer.player.character.health <= 0) {
            this.showGameOverMenu("LOST");
        }
    },

    /**
     * Destroy dead elements
     */
    emptyTrash: function () {
        for (var i = 0; i < this.trash.length; i ++) {
            cc.log("score added: " + this.trash[i].healthPoint);
            this.playerLayer.player.character.score += this.trash[i].healthPoint;
            this.hudLayer.updateScore();
            this.trash[i].die();
            this.trash = [];
            this.removeAllChildren(true);
            cc.director.runScene(new PlayScene("boss"));
        }
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

        this.mapLayer = new CaveMapLayer(this.space);
        this.itemLayer = new ItemLayer(this.space, this.mapLayer, null, true, null);
        var chosenChar ;
        switch(playerType) {
            case CHAR_TYPE.cat:
                chosenChar = new Cat(this.space);
                break;
            case CHAR_TYPE.dog:
                chosenChar = new Dog(this.space);
                break;
            case CHAR_TYPE.rabbit:
                chosenChar = new Rabbit(this.space);
                break;
            case CHAR_TYPE.pig:
                chosenChar = new Pig(this.space);
                break;
        }
        this.playerLayer = new PlayerLayer(this.space, chosenChar);
        this.boss = new Boss(this.space);
        this.boss.body.setPos(cc.p(this.mapLayer.coordinateAtTileIndex(73).x, this.mapLayer.coordinateAtTileIndex(73).y + 40));
        this.boundLayer = new BoundLayer(this.space, this.mapLayer);
        this.gameLayer.addChild(this.mapLayer, 0, TagOfLayer.Map);
        this.gameLayer.addChild(this.playerLayer, 0, TagOfLayer.Player);
        this.gameLayer.addChild(this.boss.sprite, 0, TagOfLayer.Enemy);
        this.gameLayer.addChild(this.boundLayer, 0, TagOfLayer.Bound);
        this.gameLayer.addChild(this.itemLayer, 0, TagOfLayer.Item);
        this.initCollisions();
        this.addChild(this.gameLayer);
        this.addChild(this.hudLayer, 0, TagOfLayer.Hud);
        this.scheduleUpdate();//execute main method every frame
        this.scheduleOnce(this.positionPlayer); //execute position player to spawn point at first
        this.schedule(this.enemyBehavior, 0.5);//move all enemies at every 0.5 seconds interval

        cc.audioEngine.playMusic(res.music_boss, true);
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
