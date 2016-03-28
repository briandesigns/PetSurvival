var OverMenuLayer = cc.Layer.extend({
    winsize: null,
    centerpos : null,
    score: null,
    winLoss: null,
    ctor: function (score, winLoss) {
        this._super();
        this.score = score;
        this.winLoss = winLoss;
    },

    init: function () {
        this._super();
        this.winsize = cc.director.getWinSize();
        this.centerpos = cc.p(this.winsize.width / 2, this.winsize.height / 2);
        var spritebg = new cc.Sprite(res.pause_menu_background);
        spritebg.setPosition(this.centerpos);
        this.addChild(spritebg);
        cc.MenuItemFont.setFontSize(60);
        var menuItemMainMenu = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_main),
            null,
            this.onMain,
            this
        );
        var menu = new cc.Menu(menuItemMainMenu);
        menu.setPosition(this.centerpos);
        menu.alignItemsVerticallyWithPadding(12);
        this.addChild(menu);

        var winLabel = new cc.LabelTTF("GAME " + this.winLoss, "Helvetica", 100);
        winLabel.setColor(cc.color(255,255,255));
        winLabel.setPosition(cc.p(this.centerpos.x, this.centerpos.y + 200));
        this.addChild(winLabel);

        var scoreLabel = new cc.LabelTTF("SCORE: " + this.score, "Helvetica", 30);
        scoreLabel.setColor(cc.color(255,255,255));
        scoreLabel.setPosition(cc.p(this.centerpos.x, this.centerpos.y + 130));
        this.addChild(scoreLabel);
    },

    onMain: function () {
        this.getParent().removeAllChildren(true);
        cc.director.resume();
        cc.director.runScene(new MainMenuScene());
    }
});