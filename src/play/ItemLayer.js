var ItemLayer = cc.Layer.extend({
    space: null,
    itemList: null,
    ctor: function (space, itemList) {
        this._super();
        this.space = space;
        this.itemList = itemList;
        this.init();
    },
    init: function () {
        this._super();

        if (this.itemList == null) {
            this.itemList = [];
            this.createItems();
        }

    },

    createItems: function() {
        for (var i = 0; i < 15; i++) {
            this.itemList[i] = new HealthBoostItem(this.space);
            this.itemList[i].body.setPos(cc.p(1000 + (Math.random()*1000) - (Math.random()*1000), 1000+ (Math.random()*1000) - (Math.random()*1000))) ;
            this.addChild(this.itemList[i].sprite);
        }
        for (i = 15; i<20; i++) {
            this.itemList[i] = new HealthPointItem(this.space);
            this.itemList[i].body.setPos(cc.p(1000 + (Math.random()*1000) - (Math.random()*1000), 1000+ (Math.random()*1000) - (Math.random()*1000))) ;
            this.addChild(this.itemList[i].sprite);
        }
        for (i = 20; i<25; i++) {
            this.itemList[i] = new HitPointItem(this.space);
            this.itemList[i].body.setPos(cc.p(1000 + (Math.random()*1000) - (Math.random()*1000), 1000+ (Math.random()*1000) - (Math.random()*1000))) ;
            this.addChild(this.itemList[i].sprite);
        }
        for ( i = 25; i<30; i++) {
            this.itemList[i] = new SpeedItem(this.space);
            this.itemList[i].body.setPos(cc.p(1000 + (Math.random()*1000) - (Math.random()*1000), 1000+ (Math.random()*1000) - (Math.random()*1000))) ;
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

});

