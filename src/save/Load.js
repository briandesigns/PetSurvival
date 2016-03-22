var loadPlayerChar = function (space, itemLayer) {
    return loadChar(space, itemLayer, "playerChar");
};

var loadItems = function (space) {
    var dict = cc.sys.localStorage;
    var itemList = [];
    var itemCount = dict.getItem("itemCount");

    for (var i = 0; i < itemCount; i++) {
        var item;
        var string = dict.getItem("item" + i);
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

var loadEnemies = function (space, itemLayer) {
    var dict = cc.sys.localStorage;
    var spawnList = [];
    var spawnCount = parseInt(dict.getItem("spawnCount"));
    for (var i = 0; i < spawnCount; i++) {
        var spawnString = dict.getItem("spawn" + i);
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
        var enemyCount = parseInt(dict.getItem("enemy" + j + "Count"));
        spawnList[j].enemyList = [];
        for (var k = 0; k < enemyCount; k++) {
            var enemy = loadChar(space, itemLayer, "enemy"+j+"-"+k);
            spawnList[j].enemyList.push(enemy);
        }
    }
    return spawnList;
};

//todo: for all token processing code, make sure that undefined is not added when token is
// actually empty but still counted as 1
var buildInventory = function (invTokens, itemLayer) {
    var inventory = [];
    cc.log("inv token length: " + invTokens.length);
    for (var i = 0; i < invTokens.length; i++) {
        if (parseInt(invTokens[i] != undefined)) {
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
    return char;

};