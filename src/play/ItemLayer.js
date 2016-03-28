var ItemLayer = cc.Layer.extend({
    space: null,
    itemList: null,
    isCave: null,
    mapLayer: null,

    ctor: function (space, mapLayer, itemList, isCave) {
        this._super();
        this.space = space;
        this.mapLayer = mapLayer;
        this.itemList = itemList;
        this.isCave = isCave;
        this.init();
    },
    init: function () {
        this._super();

        if (this.itemList == null) {
            this.itemList = [];
            this.createItems();
        } else {
            for (var i = 0; i < this.itemList.length; i++) {
                this.addChild(this.itemList[i].sprite);
            }
        }

    },

    createItems: function() {
        if (this.isCave) {
            this.itemList[0] = new PineConeItem(this.space);
            this.itemList[0].body.setPos(cc.p(this.mapLayer.coordinateAtTileIndex(184).x, this.mapLayer.coordinateAtTileIndex(184).y));
            this.itemList[0].itemID = 0;
            this.addChild((this.itemList[0].sprite));
        } else {
            for (var i = 0; i < 15; i++) {
                this.itemList[i] = new HealthBoostItem(this.space);
                this.itemList[i].body.setPos(cc.p(1000 + (Math.random()*1000) - (Math.random()*1000),
                    1000+ (Math.random()*1000) - (Math.random()*1000))) ;
                this.itemList[i].itemID = i;
                this.addChild(this.itemList[i].sprite);
            }
            for (i = 15; i<20; i++) {
                this.itemList[i] = new HealthPointItem(this.space);
                this.itemList[i].body.setPos(cc.p(1000 + (Math.random()*1000) - (Math.random()*1000),
                    1000+ (Math.random()*1000) - (Math.random()*1000))) ;
                this.itemList[i].itemID = i;
                this.addChild(this.itemList[i].sprite);
            }
            for (i = 20; i<25; i++) {
                this.itemList[i] = new HitPointItem(this.space);
                this.itemList[i].body.setPos(cc.p(1000 + (Math.random()*1000) - (Math.random()*1000),
                    1000+ (Math.random()*1000) - (Math.random()*1000))) ;
                this.itemList[i].itemID = i;
                this.addChild(this.itemList[i].sprite);
            }
            for ( i = 25; i<30; i++) {
                this.itemList[i] = new SpeedItem(this.space);
                this.itemList[i].body.setPos(cc.p(1000 + (Math.random()*1000) - (Math.random()*1000),
                    1000+ (Math.random()*1000) - (Math.random()*1000))) ;
                this.itemList[i].itemID = i;
                this.addChild(this.itemList[i].sprite);
            }

            this.itemList[i] = new SuperSpeedItem(this.space);
            this.itemList[i].body.setPos(cc.p((cc.director.getWinSize().width * 10)  ,
                (cc.director.getWinSize().height * 10)));
            this.itemList[i].itemID = -1;
            this.itemList[i].isPlaced = "false";
            this.addChild(this.itemList[i].sprite);


            i = i + 1;
            this.itemList[i] = new SuperHealthPointItem(this.space);
            this.itemList[i].body.setPos(cc.p((cc.director.getWinSize().width * 10)  ,
                (cc.director.getWinSize().height * 10)));
            this.itemList[i].itemID = -2;
            this.itemList[i].isPlaced = "false";
            this.addChild(this.itemList[i].sprite);

            i = i + 1;
            this.itemList[i] = new SuperHitPointItem(this.space);
            this.itemList[i].body.setPos(cc.p((cc.director.getWinSize().width * 10)  ,
                (cc.director.getWinSize().height * 10)));
            this.itemList[i].itemID = -3;
            this.itemList[i].isPlaced = "false";
            this.addChild(this.itemList[i].sprite);
        }
    },

    getItemByShape: function(shape) {
        for (var i = 0; i < this.itemList.length; i++) {
            var item = this.itemList[i];
            if (item.shape == shape) {
                return item;
            }
        }
        return null;
    },

    getItemByID: function (id) {
        for (var i = 0; i < this.itemList.length; i++) {
            var item = this.itemList[i];
            if (item.itemID == id) {
                return item;
            }
        }
    }

});

