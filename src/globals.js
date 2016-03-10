//layers
if (typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.Map = 0;
    TagOfLayer.Player = 1;
    TagOfLayer.Generator = 2;
    TagOfLayer.Enemy = 3;
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