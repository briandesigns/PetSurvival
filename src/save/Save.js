/**
 * player, characterType, (x;y), healthPoint, health, hitPoint, speed, (invID;invID), invCapacity
 * @param playerLayer
 */
var savePlayerChar = function (playerLayer, boss) {
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
    dict.setItem(boss + "playerChar", string);
    cc.log(dict.getItem(boss + "playerChar"));
};

/**
 * spawn0, spawnType, (x;y), health
 * @param enemyLayer
 */
var saveEnemySpawns = function (enemyLayer, boss) {
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
        dict.setItem(boss + "spawn"+i, string);
        cc.log(dict.getItem(boss + "spawn" +i));
    }
    dict.setItem(boss + "spawnCount", i);
    cc.log(boss + "SpawnCount: " + dict.getItem(boss + "spawnCount"));
};

/**
 * enemy0-1,characterType,(x;y), healthPoint, health, hitPoint, speed, (invID;invID), invCap
 * @param enemyLayer
 */
var saveEnemies = function (enemyLayer, boss) {
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
            dict.setItem(boss + "enemy"+i+"-"+j, string);
            cc.log(dict.getItem(boss + "enemy"+i+"-"+j));
        }
        dict.setItem(boss + "enemy"+i+"Count", j);
        cc.log(boss + "enemy"+i+"Count: " + dict.getItem(boss + "enemy"+i+"Count"));
    }
};

/**
 * item0,itemID, itemType, (x;y)
 * @param itemLayer
 */
var saveItems = function (itemLayer, boss) {
    var dict = cc.sys.localStorage;
    var itemList = itemLayer.itemList;
    var i;
    for (i = 0; i < itemList.length; i++) {
        var string = buildCSV(
            "item"+i,
            itemList[i].itemID,
            itemList[i].itemType,
            itemList[i].sprite.getPositionX() + ";"  + itemList[i].sprite.getPositionY(),
            itemList[i].isSuper,
            itemList[i].isPlaced
        );
        dict.setItem(boss + "item"+i, string);
        cc.log(dict.getItem(boss + "item"+i));
    }
    dict.setItem(boss + "itemCount", i);
    cc.log("itemCount: " + dict.getItem(boss + "itemCount"));

};

/**
 * start,(x;y)
 * end, (x;y)
 * @param locationLayer
 */
var saveLocations = function (locationLayer, boss) {
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
    dict.setItem(boss + "start", stringStart);
    cc.log(dict.getItem(boss + "start"));
    dict.setItem(boss + "end", stringEnd);
    cc.log(dict.getItem(boss + "end"));

};

/**
 * @param mapLayer
 */

var saveMap = function (mapLayer, boss) {
    var dict = cc.sys.localStorage;

    var tiledMapWidth = mapLayer.tiledMapWidth;
    var tiledMapHeight = mapLayer.tiledMapHeight;
    var tiledMapsWide = mapLayer.tiledMapsWide;
    var tiledMapsHigh = mapLayer.tiledMapsHigh;
    var totalTiledMaps = mapLayer.totalTiledMaps;
    var collisionArray = mapLayer.collisionArray;

    dict.setItem(boss + "tiledMapWidth", tiledMapWidth);
    dict.setItem(boss + "tiledMapHeight", tiledMapHeight);
    dict.setItem(boss + "tiledMapsWide", tiledMapsWide);
    dict.setItem(boss + "tiledMapsHigh", tiledMapsHigh);
    dict.setItem(boss + "totalTiledMaps", totalTiledMaps);
    dict.setItem(boss + "collisionArray", buildMapArrayString(collisionArray));
    cc.log("Saving collision array: " + collisionArray);

    var mapAsTmxStrings = mapLayer.mapAsTmxStrings;
    for (var i = 0; i < mapAsTmxStrings.length; i++) {
        dict.setItem(boss + "tmxMap"+i, mapAsTmxStrings[i]);
        cc.log(dict.getItem(boss + "tmxMap"+i));
    }
    dict.setItem(boss + "tmxMapCount", mapAsTmxStrings.length);
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