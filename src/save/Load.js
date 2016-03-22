var loadPlayerChar = function (space, itemLayer) {
    var dict = cc.sys.localStorage;
    var string = dict.getItem("playerChar");
    cc.log("loading : "+ string);
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
        item.body.setPos(cc.p(parseFloat(posTokens[0]),parseFloat(posTokens[1])));
        itemList.push(item);
    }
    return itemList;
};

var buildInventory = function (invTokens, itemLayer) {
    var inventory = [];
    for (var i = 0; i < invTokens.length; i++) {
        inventory.push(itemLayer.getItemByID(parseInt(invTokens[i])));
    }
    return inventory;

};