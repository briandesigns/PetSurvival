/**
 * Created by brian on 2/13/16.
 */
var EnemyLayer = cc.Layer.extend({
    space: null,
    DryerGroup: null,
    ctor: function (space) {
        this._super();
        this.space = space;
        this.init();
    },
    init: function () {
        this._super();

        this.DryerGroup = [];
        for (var i = 0; i<1; i++) {
            this.DryerGroup[i] = new Dryer();


            this.space.addBody(this.DryerGroup[i].body);
            this.space.addShape(this.DryerGroup[i].shape);
            this.DryerGroup[i].body.setPos(cc.p(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2)) ;
            this.addChild(this.DryerGroup[i].sprite);


        }
    }
});

