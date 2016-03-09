//layers
if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.Map = 0;
    TagOfLayer.Player = 1;
    TagOfLayer.Generator = 2;
    TagOfLayer.Enemy = 3;
}

//items
if(typeof ITEM_TYPE == "undefined") {
    var ITEM_TYPE = {};
    ITEM_TYPE.healthPoint = "healthPoint";
    ITEM_TYPE.hitPoint = "hitPoint";
    ITEM_TYPE.speed = "speed";
    ITEM_TYPE.healthBoost = "healthBoost";
}

//character
if(typeof CHARACTER_TYPE == "undefined") {
    var CHARACTER_TYPE = {};
    CHARACTER_TYPE.player = "player";
    CHARACTER_TYPE.enemy = "enemy";
}
