/**
 * Created by brian on 2/13/16.
 */
var EnemyLayer = cc.Layer.extend({
    space: null,
    enemySpawns: null,
    ctor: function (space) {
        this._super();
        this.space = space;
        this.init();
    },
    init: function () {
        this._super();

        this.enemySpawns = [];

        this.enemySpawns[0] = new Cave();
        this.space.addBody(this.enemySpawns[0].body);
        this.space.addShape(this.enemySpawns[0].shape);
        var contentSize = this.enemySpawns[0].sprite.getContentSize();
        var spriteScale = this.enemySpawns[0].spriteScale;
        this.enemySpawns[0].body.setPos(cc.p((cc.director.getWinSize().width / 2)+ contentSize.width*spriteScale, cc.director.getWinSize().height / 2)) ;
        this.addChild(this.enemySpawns[0].sprite);

        this.enemySpawns[1] = new Cave();
        this.space.addBody(this.enemySpawns[1].body);
        this.space.addShape(this.enemySpawns[1].shape);
        this.enemySpawns[1].body.setPos(cc.p(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2)) ;
        this.addChild(this.enemySpawns[1].sprite);

        this.enemySpawns[2] = new Hydrant();
        this.space.addBody(this.enemySpawns[2].body);
        this.space.addShape(this.enemySpawns[2].shape);
        this.enemySpawns[2].body.setPos(cc.p((cc.director.getWinSize().width / 2) + contentSize.width*spriteScale*3, cc.director.getWinSize().height / 2)) ;
        this.addChild(this.enemySpawns[2].sprite);

        for (var i = 0; i<1; i++) {
        }
    }
});

