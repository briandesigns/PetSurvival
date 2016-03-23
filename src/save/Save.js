/**
 * player, characterType, (x;y), healthPoint, health, hitPoint, speed, (invID;invID), invCapacity
 * @param playerLayer
 */
var savePlayerChar = function (playerLayer) {
    var char = playerLayer.player.character;
    var string = buildCSV(
        "player",
        char.characterType,
        char.sprite.getPositionX() + ";" + char.sprite.getPositionY(),
        char.healthPoint,
        char.health,
        char.hitPoint,
        char.speed,
        buildInvString(char.inventory),
        char.inventoryCapacity,
        char.score
    );
    var dict = cc.sys.localStorage;
    dict.setItem("playerChar", string);
    cc.log(dict.getItem("playerChar"));
};

/**
 * spawn0, spawnType, (x;y), health
 * @param enemyLayer
 */
var saveEnemySpawns = function (enemyLayer) {
    var dict = cc.sys.localStorage;
    var spawnList = enemyLayer.enemySpawnList;
    var i;
    for (i = 0; i < spawnList.length; i++) {
        var string = buildCSV(
            "spawn"+i,
            spawnList[i].spawnType,
            spawnList[i].sprite.getPositionX() + ";" + spawnList[i].sprite.getPositionY(),
            spawnList[i].health
        );
        dict.setItem("spawn"+i, string);
        cc.log(dict.getItem("spawn" +i));
    }
    dict.setItem("spawnCount", i);
    cc.log("SpawnCount: " + dict.getItem("spawnCount"));
};

/**
 * enemy0-1,characterType,(x;y), healthPoint, health, hitPoint, speed, (invID;invID), invCap
 * @param enemyLayer
 */
var saveEnemies = function (enemyLayer) {
    var dict = cc.sys.localStorage;
    var spawnList = enemyLayer.enemySpawnList;
    for (var i = 0; i < spawnList.length; i++) {
        var enemyList = spawnList[i].enemyList;
        var j;
        for (j = 0; j < enemyList.length; j++) {
            var char = enemyList[j];
            var string = buildCSV(
                "enemy"+i+"-"+j,
                char.characterType,
                char.sprite.getPositionX() + ";" + char.sprite.getPositionY(),
                char.healthPoint,
                char.health,
                char.hitPoint,
                char.speed,
                buildInvString(char.inventory),
                char.inventoryCapacity
            );
            dict.setItem("enemy"+i+"-"+j, string);
            cc.log(dict.getItem("enemy"+i+"-"+j));
        }
        dict.setItem("enemy"+i+"Count", j);
        cc.log("enemy"+i+"Count: " + dict.getItem("enemy"+i+"Count"));
    }
};

/**
 * item0,itemID, itemType, (x;y)
 * @param itemLayer
 */
var saveItems = function (itemLayer) {
    var dict = cc.sys.localStorage;
    var itemList = itemLayer.itemList;
    var i;
    for (i = 0; i < itemList.length; i++) {
        var string = buildCSV(
            "item"+i,
            itemList[i].itemID,
            itemList[i].itemType,
            itemList[i].sprite.getPositionX() + ";"  + itemList[i].sprite.getPositionY()
        );
        dict.setItem("item"+i, string);
        cc.log(dict.getItem("item"+i));
    }
    dict.setItem("itemCount", i);
    cc.log("itemCount: " + dict.getItem("itemCount"));

};

/**
 * start,(x;y)
 * end, (x;y)
 * @param locationLayer
 */
var saveLocations = function (locationLayer) {
    var start = locationLayer.start;
    var end = locationLayer.end;
    var stringStart = buildCSV(
        "start",
        start.sprite.getPositionX()+";"+start.sprite.getPositionY()
    );
    var stringEnd= buildCSV(
        "end",
        end.sprite.getPositionX()+";"+ end.sprite.getPositionY()
    );
    var dict = cc.sys.localStorage;
    dict.setItem("start", stringStart);
    cc.log(dict.getItem("start"));
    dict.setItem("end", stringEnd);
    cc.log(dict.getItem("end"));

};

/**
 * @param mapLayer
 */

var saveMap = function (mapLayer) {
    var dict = cc.sys.localStorage;

    //var tiledMapWidth = mapLayer.tiledMapWidth;
    //var tiledMapHeight = mapLayer.tiledMapHeight;
    var tiledMapsWide = mapLayer.tiledMapsWide;
    var tiledMapsHigh = mapLayer.tiledMapsHigh;
    var totalTiledMaps = mapLayer.totalTiledMaps;
    var collisionArray = mapLayer.collisionArray;

    //dict.setItem("tiledMapWidth", tiledMapWidth);
    //dict.setItem("tiledMapHeight", tiledMapHeight);
    dict.setItem("tiledMapsWide", tiledMapsWide);
    dict.setItem("tiledMapsHigh", tiledMapsHigh);
    dict.setItem("totalTiledMaps", totalTiledMaps);
    dict.setItem("collisionArray", buildMapArrayString(collisionArray));

    var mapAsTmxStrings = mapLayer.mapAsTmxStrings;
    for (var i = 0; i < mapAsTmxStrings.length; i++) {
        dict.setItem("tmxMap"+i, mapAsTmxStrings[i]);
        cc.log(dict.getItem("tmxMap"+i));
    }
    dict.setItem("tmxMapCount", mapAsTmxStrings.length);
};

var buildCSV = function () {
    var string = "";
    for (var i = 0; i < arguments.length; i++) {
        string += arguments[i];
        if (i != arguments.length - 1) {
            string += ",";
        }
    }
    return string;
};

var buildInvString = function (inventory) {
    cc.log("inventory length" + inventory.length);
    var string="";
    for (var i = 0; i < inventory.length; i++) {
        string += inventory[i].itemID;
        if (i != inventory.length - 1) {
            string += ";";
        }
    }
    return string;
};

var buildMapArrayString = function (mapArray) {
    cc.log("map array length" + mapArray.length);
    var string="";
    for (var i=0; i<mapArray.length; i++) {
        string += mapArray[i];
        if (i != mapArray.length - 1) {
            string += ";";
        }
    }
    return string
};