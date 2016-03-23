var PauseMenuLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
    },

    init: function () {
        this._super();
        var winsize = cc.director.getWinSize();
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);
        var spritebg = new cc.Sprite(res.pause_menu_background);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);
        cc.MenuItemFont.setFontSize(60);
        var menuItemResume = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_resume), // normal state image
            null, // select state image
            this.onResume,
            this
        );
        var menuItemSave = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_save),
            null,
            this.onSave,
            this
        );
        var menuItemMainMenu = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_main),
            null,
            this.onMain,
            this
        );
        var menu = new cc.Menu(menuItemResume, menuItemSave, menuItemMainMenu);  //7. create the
        // menu
        menu.setPosition(centerpos);
        menu.alignItemsVerticallyWithPadding(12);
        this.addChild(menu);
    },

    onResume: function () {
        cc.log("==onResume clicked");
        cc.director.resume();
        this.getParent().removeChild(this);
    },

    onSave: function () {
        cc.log("==onSave clicked");
        saveItems(this.getParent().itemLayer);
        savePlayerChar(this.getParent().playerLayer);
        saveEnemySpawns(this.getParent().enemyLayer);
        saveEnemies(this.getParent().enemyLayer);
        saveLocations(this.getParent().locationLayer);
    },

    onMain: function () {

        //cc.director.popScene(new MainMenuScene());
    }
});