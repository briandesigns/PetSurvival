/**
 * Created by brian on 2/13/16.
 */
var EnemyLayer = cc.Layer.extend({
    space: null,
    hydrantGroup: null,
    ctor: function (space) {
        this._super();
        this.space = space;
        this.init();
    },
    init: function () {
        this._super();

        this.hydrantGroup = [];
        for (var i = 0; i<1; i++) {
            this.hydrantGroup[i] = new Hydrant();


            this.space.addBody(this.hydrantGroup[i].body);
            this.space.addShape(this.hydrantGroup[i].shape);
            this.hydrantGroup[i].body.setPos(cc.p(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2)) ;
            this.addChild(this.hydrantGroup[i].sprite);


        }
    }
});

