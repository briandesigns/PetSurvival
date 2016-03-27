var loadPlayerChar = function (space, itemLayer, boss) {
    var char = loadChar(space, itemLayer, boss + "playerChar");
    cc.log("inventory length is:" + char.inventory.length);
    for (var i = 0; i < char.inventory.length; i++) {
        cc.log("player has inventory type:" + char.inventory[i].itemType);
    }
    return char;
};

var loadItems = function (space, boss) {
    var dict = cc.sys.localStorage;
    var itemList = [];
    var itemCount = dict.getItem(boss + "itemCount");

    for (var i = 0; i < itemCount; i++) {
        var item;
        var string = dict.getItem(boss + "item" + i);
        cc.log("loading: " + string);
        var tokens = string.split(",");
        var posTokens = tokens[3].split(";");
        switch (parseInt(tokens[2])) {
            case ITEM_TYPE.healthBoost:
                item = new HealthBoostItem(space);
                break;
            case ITEM_TYPE.healthPoint:
                item = new HealthPointItem(space);
                break;
            case ITEM_TYPE.speed:
                item = new SpeedItem(space);
                break;
            case ITEM_TYPE.hitPoint:
                item = new HitPointItem(space);
                break;
        }
        item.itemID = parseInt(tokens[1]);
        item.body.setPos(cc.p(parseFloat(posTokens[0]), parseFloat(posTokens[1])));
        itemList.push(item);
    }
    return itemList;
};

var loadEnemies = function (space, itemLayer, boss) {
    var dict = cc.sys.localStorage;
    var spawnList = [];
    var spawnCount = parseInt(dict.getItem(boss + "spawnCount"));
    for (var i = 0; i < spawnCount; i++) {
        var spawnString = dict.getItem(boss + "spawn" + i);
        cc.log("loading: " + spawnString);
        var spawnTokens = spawnString.split(",");
        var posTokens = spawnTokens[2].split(";");
        var spawn;

        switch (parseInt(spawnTokens[1])) {
            case SPAWN_TYPE.can :
                spawn = new CanSpawn(space);
                break;
            case SPAWN_TYPE.dryer:
                spawn = new DryerSpawn(space);
                break;
            case SPAWN_TYPE.hydrant:
                spawn = new HydrantSpawn(space);
                break;
            case SPAWN_TYPE.vacuum:
                spawn = new VacuumSpawn(space);
                break;
        }
        spawn.body.setPos(cc.p(parseFloat(posTokens[0]), parseFloat(posTokens[1])));
        spawn.health = parseInt(spawnTokens[3]);
        spawnList.push(spawn);
    }
    for (var j = 0; j < spawnList.length; j++) {
        var enemyCount = parseInt(dict.getItem(boss + "enemy" + j + "Count"));
        spawnList[j].enemyList = [];
        for (var k = 0; k < enemyCount; k++) {
            var enemy = loadChar(space, itemLayer, boss + "enemy"+j+"-"+k);
            spawnList[j].enemyList.push(enemy);
        }
    }
    return spawnList;
};

var loadLocations = function (space, boss) {
    var dict = cc.sys.localStorage;
    var startString = dict.getItem(boss + "start");
    var startTokens = startString.split(",");
    var posTokens = startTokens[1].split(";");
    var start = new StartPoint(space);
    start.body.setPos(cc.p(parseFloat(posTokens[0]), parseFloat(posTokens[1])));
    var endString = dict.getItem(boss + "end");
    var endTokens = endString.split(",");
    posTokens = endTokens[1].split(";");
    var end = new EndPoint(space);
    end.body.setPos(cc.p(parseFloat(posTokens[0]), parseFloat(posTokens[1])));
    return {start: start, end: end};
};

var loadTmxMap = function (boss) {
    var dict = cc.sys.localStorage;

    var mapAsTmxStrings = [];
    var tmxMapCount = dict.getItem(boss + "tmxMapCount");

    for (var i = 0; i < tmxMapCount; i++) {
        var tmxMap = dict.getItem(boss + "tmxMap" + i);
        cc.log("loading: tmxMap " + i);
        mapAsTmxStrings.push(tmxMap);
    }

    return mapAsTmxStrings;
};

var loadCollisionArray = function (boss) {
    var dict = cc.sys.localStorage;

    var collisionArrayString = dict.getItem(boss + "collisionArray");
    var collisionArray = collisionArrayString.split(";");

    return collisionArray;
};

var loadTiledMapsWide = function (boss) {
    var dict = cc.sys.localStorage;
    return dict.getItem(boss + "tiledMapsWide");
};

var loadTiledMapsHigh = function (boss) {
    var dict = cc.sys.localStorage;
    return dict.getItem(boss + "tiledMapsHigh");
};

var loadTiledMapWidth = function (boss) {
    var dict = cc.sys.localStorage;
    return dict.getItem(boss + "tiledMapWidth");
};

var loadTiledMapHeight = function (boss) {
    var dict = cc.sys.localStorage;
    return dict.getItem(boss + "tiledMapHeight");
};

var loadTotalTiledMaps = function (boss) {
    var dict = cc.sys.localStorage;
    return dict.getItem(boss + "totalTiledMaps");

};

var buildInventory = function (invTokens, itemLayer) {
    var inventory = [];
    for (var i = 0; i < invTokens.length; i++) {
        cc.log(parseInt(invTokens[i]));
        if (invTokens[i] != "") {
            inventory.push(itemLayer.getItemByID(parseInt(invTokens[i])));
        }
    }
    return inventory;

};

var loadChar = function (space, itemLayer, dictName) {
    var dict = cc.sys.localStorage;
    var string = dict.getItem(dictName);
    cc.log("loading : " + string);
    var tokens = string.split(",");
    var posTokens = tokens[2].split(";");
    var invTokens = tokens[7].split(";");
    var char;

    switch (parseInt(tokens[1])) {
        case CHAR_TYPE.dog:
            char = new Dog(space);
            break;
        case CHAR_TYPE.cat:
            char = new Cat(space);
            break;
        case CHAR_TYPE.rabbit:
            char = new Rabbit(space);
            break;
        case CHAR_TYPE.pig:
            char = new Pig(space);
            break;
        case CHAR_TYPE.can:
            char = new Can(space);
            break;
        case CHAR_TYPE.dryer:
            char = new Dryer(space);
            break;
        case CHAR_TYPE.hydrant:
            char = new Hydrant(space);
            break;
        case CHAR_TYPE.vacuum:
            char = new Vacuum(space);
            break;

    }
    char.body.setPos(cc.p(parseFloat(posTokens[0]), parseFloat(posTokens[1])));
    char.healthPoint = parseInt(tokens[3]);
    char.health = parseInt(tokens[4]);
    char.hitPoint = parseInt(tokens[5]);
    char.speed = parseFloat(tokens[6]);
    char.inventory = buildInventory(invTokens, itemLayer);
    char.inventoryCapacity = parseInt(tokens[8]);
    char.score = parseInt(tokens[9]);
    return char;

};