var ItemLayer = cc.Layer.extend({
    space: null,
    itemList: null,
    ctor: function (space) {
        this._super();
        this.space = space;
        this.itemList = [];
        this.init();
    },
    init: function () {
        this._super();
        this.createItems();

    },

    createItems: function() {
        for (var i = 0; i < 15; i++) {
            this.itemList[i] = new HealthBoostItem(25, this.space);
            this.itemList[i].body.setPos(cc.p(1000 + (Math.random()*1000) - (Math.random()*1000), 1000+ (Math.random()*1000) - (Math.random()*1000))) ;
            this.addChild(this.itemList[i].sprite);
        }
        for (i = 15; i<20; i++) {
            this.itemList[i] = new HealthPointItem(25, this.space);
            this.itemList[i].body.setPos(cc.p(1000 + (Math.random()*1000) - (Math.random()*1000), 1000+ (Math.random()*1000) - (Math.random()*1000))) ;
            this.addChild(this.itemList[i].sprite);
        }
        for (i = 20; i<25; i++) {
            this.itemList[i] = new HitPointItem(5, this.space);
            this.itemList[i].body.setPos(cc.p(1000 + (Math.random()*1000) - (Math.random()*1000), 1000+ (Math.random()*1000) - (Math.random()*1000))) ;
            this.addChild(this.itemList[i].sprite);
        }
        for ( i = 25; i<30; i++) {
            this.itemList[i] = new SpeedItem(0.3, this.space);
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

