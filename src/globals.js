//layers
if (typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.Map = 0;
    TagOfLayer.Player = 1;
    TagOfLayer.Generator = 2;
    TagOfLayer.Enemy = 3;
    TagOfLayer.Bound = 4;
    TagOfLayer.Item = 5;
    TagOfLayer.Location = 6;
    TagOfLayer.Hud = 7;
    TagOfLayer.CaveMap = 8;
}

//items types
if (typeof ITEM_TYPE == "undefined") {
    var ITEM_TYPE = {};
    ITEM_TYPE.healthPoint = 0;
    ITEM_TYPE.hitPoint = 1;
    ITEM_TYPE.speed = 2;
    ITEM_TYPE.healthBoost = 3;
    ITEM_TYPE.pineCone = 4;
}

//collision types
if (typeof COLLISION_TYPE == "undefined") {
    var COLLISION_TYPE = {};
    COLLISION_TYPE.player = 0;
    COLLISION_TYPE.enemy = 1;
    COLLISION_TYPE.item = 2;
    COLLISION_TYPE.end = 3;
    COLLISION_TYPE.bounds = 4;
    COLLISION_TYPE.enemySpawn = 5;
    COLLISION_TYPE.start = 6;
    COLLISION_TYPE.wall = 7;
    COLLISION_TYPE.projectile = 8;
    COLLISION_TYPE.bossSpawn = 9;

}

var MAX_INT = 4294967295;

//EnemySpawn Types
if (typeof SPAWN_TYPE == "undefined") {
    var SPAWN_TYPE = {};
    SPAWN_TYPE.can = 0;
    SPAWN_TYPE.dryer = 1;
    SPAWN_TYPE.hydrant = 2;
    SPAWN_TYPE.vacuum = 3;
    SPAWN_TYPE.boss = 4;
}

//character Types
if (typeof CHAR_TYPE == "undefined") {
    var CHAR_TYPE = {};
    CHAR_TYPE.dog = 0;
    CHAR_TYPE.cat = 1;
    CHAR_TYPE.rabbit = 2;
    CHAR_TYPE.pig = 3;
    CHAR_TYPE.can = 4;
    CHAR_TYPE.dryer = 5;
    CHAR_TYPE.hydrant = 6;
    CHAR_TYPE.vacuum = 7;
    CHAR_TYPE.boss = 8;
}

//player character stats
if (typeof PLAYER_STATS == "undefined") {
    var PLAYER_STATS = {};
    PLAYER_STATS.baseHealth = 100;
    PLAYER_STATS.baseHealthPoint = 100;
    PLAYER_STATS.inventoryCapacity = 5;
    PLAYER_STATS.baseHitPoint = 15;
    PLAYER_STATS.baseSpeed = 1.2;
    PLAYER_STATS.baseSpeedDuration = 0.03;
}

//enemy character stats
if (typeof ENEMY_STATS == "undefined") {
    var ENEMY_STATS = {};
    ENEMY_STATS.baseHealth = 100;
    ENEMY_STATS.baseHealthPoint = 100;
    ENEMY_STATS.inventoryCapacity = 1;
    ENEMY_STATS.baseHitPoint = 2;
    ENEMY_STATS.baseSpeed = 8;
    ENEMY_STATS.baseSpeedDuration = 0.5;
}

//enemy spawn stats
if (typeof SPAWN_STATS == "undefined") {
    var SPAWN_STATS = {};
    SPAWN_STATS.baseHealth = 500;
    SPAWN_STATS.baseHealthPoint = 500;
    SPAWN_STATS.baseCapacity = 5;
    SPAWN_STATS.baseSpriteScale = 0.07;
}

//item stats
if (typeof ITEM_STATS == "undefined") {
    var ITEM_STATS = {};
    ITEM_STATS.healthBoost = 20;
    ITEM_STATS.healthPointBenefit = 10;
    ITEM_STATS.hitPointBenefit = 5;
    ITEM_STATS.speedBoost = 0.2;
    ITEM_STATS.pineConeDamage = 50;
}

//map size
if (typeof MAP_SIZE == "undefined") {
    var MAP_SIZE = {};
    MAP_SIZE.small = 0;
    MAP_SIZE.medium = 1;
    MAP_SIZE.big = 2;
}

var playerType;



