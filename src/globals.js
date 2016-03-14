//layers
if (typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.Map = 0;
    TagOfLayer.Player = 1;
    TagOfLayer.Generator = 2;
    TagOfLayer.Enemy = 3;
    TagOfLayer.Bound = 4;
    TagOfLayer.Item = 5;
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
    COLLISION_TYPE.goal = 3;
    COLLISION_TYPE.bounds = 4;
    COLLISION_TYPE.enemySpawn = 5;

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