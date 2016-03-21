var savePlayerChar = function (playerLayer) {
    var char = playerLayer.player.character;
    var string = buildCSV(
        "player",
        char.characterType,
        "(" + char.sprite.getPositionX() + ";" + char.sprite.getPositionY() + ")",
        char.healthPoint,
        char.health,
        char.hitPoint,
        char.speed,
        buildInvString(char.inventory),
        char.inventoryCapacity
    );
    var dict = cc.sys.localStorage;
    dict.setItem("playerChar", string);
    cc.log(dict.getItem("playerChar"));
};

var saveEnemySpawns = function (enemyLayer) {
    var spawnList = enemyLayer.enemySpawnList;
    for (var i = 0; i < spawnList.length; i++) {
        var string = buildCSV(
            "spawn"+i,
            "(" + spawnList[i].sprite.getPositionX() + ";" + spawnList[i].sprite.getPositionY()+ ")",
            spawnList[i].spawnType,
            spawnList[i].health
        );
        var dict = cc.sys.localStorage;
        dict.setItem("spawn"+i, string);
        cc.log(dict.getItem("spawn" +i));
    }
};

var saveEnemies = function (enemyLayer) {
    var spawnList = enemyLayer.enemySpawnList;
    for (var i = 0; i < spawnList.length; i++) {
        var enemyList = spawnList[i].enemyList;
        for (var j = 0; j < enemyList.length; j++) {
            var char = enemyList[j];
            var string = buildCSV(
                "enemy"+i+"-"+j,
                char.characterType,
                "(" + char.sprite.getPositionX() + ";" + char.sprite.getPositionY() + ")",
                char.healthPoint,
                char.health,
                char.hitPoint,
                char.speed,
                buildInvString(char.inventory),
                char.inventoryCapacity
            );
            var dict = cc.sys.localStorage;
            dict.setItem("enemy"+i+"-"+j, string);
            cc.log(dict.getItem("enemy"+i+"-"+j));
        }
    }
};

var saveItems = function (itemLayer) {
    var itemList = itemLayer.itemList;
    for (var i = 0; i < itemList.length; i++) {
        var string = buildCSV(
            "item"+i,
            itemList[i].itemType,
            "(" + itemList[i].sprite.getPositionX() + ";"  + itemList[i].sprite.getPositionY() + ")"
        );
        var dict = cc.sys.localStorage;
        dict.setItem("item"+i, string);
        cc.log(dict.getItem("item"+i));
    }
};

var saveLocations = function (locationLayer) {
    var start = locationLayer.start;
    var end = locationLayer.end;
    var stringStart = buildCSV(
        "start",
        "(" + start.sprite.getPositionX()+";"+start.sprite.getPositionY()+")"
    );
    var stringEnd= buildCSV(
        "end",
        "(" + end.sprite.getPositionX()+";"+ end.sprite.getPositionY()+")"
    );
    var dict = cc.sys.localStorage;
    dict.setItem("start", stringStart);
    cc.log(dict.getItem("start"));
    dict.setItem("end", stringEnd);
    cc.log(dict.getItem("end"));

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
    var string = "(";
    for (var i = 0; i < inventory.length; i++) {
        string += inventory[i].itemID;
        if (i != inventory.length - 1) {
            string += ";";
        }
    }
    string += ")";
    return string;
};