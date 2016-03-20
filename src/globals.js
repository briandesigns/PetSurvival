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
}

//items types
if (typeof ITEM_TYPE == "undefined") {
    var ITEM_TYPE = {};
    ITEM_TYPE.healthPoint = "healthPoint";
    ITEM_TYPE.hitPoint = "hitPoint";
    ITEM_TYPE.speed = "speed";
    ITEM_TYPE.healthBoost = "healthBoost";
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

}

var MAX_INT = 4294967295;

//EnemySpawn Types
if (typeof SPAWN_TYPE == "undefined") {
    var SPAWN_TYPE = {};
    SPAWN_TYPE.can = 0;
    SPAWN_TYPE.dryer = 1;
    SPAWN_TYPE.hydrant = 2;
    SPAWN_TYPE.vacuum = 3;
    SPAWN_TYPE.cave = 4;
}

//player character stats
if (typeof PLAYER_STATS == "undefined") {
    var PLAYER_STATS = {};
    PLAYER_STATS.baseHealth = 100;
    PLAYER_STATS.baseHealthPoint = 100;
    PLAYER_STATS.inventoryCapacity = 5;
    PLAYER_STATS.baseHitPoint = 15;
    PLAYER_STATS.baseSpeed = 1.2;
}

//enemy character stats
if (typeof ENEMY_STATS == "undefined") {
    var ENEMY_STATS = {};
    ENEMY_STATS.baseHealth = 100;
    ENEMY_STATS.baseHealthPoint = 100;
    ENEMY_STATS.inventoryCapacity = 1;
    ENEMY_STATS.baseHitPoint = 2;
    ENEMY_STATS.baseSpeed = 8;
}

//item stats
if (typeof ITEM_STATS == "undefined") {
    var ITEM_STATS = {};
    ITEM_STATS.healthBoost = 20;
    ITEM_STATS.healthPointBenefit = 10;
    ITEM_STATS.hitPointBenefit = 5;
    ITEM_STATS.speedBoost = 0.2;
}

