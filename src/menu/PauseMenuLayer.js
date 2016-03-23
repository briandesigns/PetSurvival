var PauseMenuLayer = cc.Layer.extend({
    winsize: null,
    centerpos : null,
    ctor: function () {
        this._super();
    },

    init: function () {
        this._super();
        this.winsize = cc.director.getWinSize();
        this.centerpos = cc.p(this.winsize.width / 2, this.winsize.height / 2);
        var spritebg = new cc.Sprite(res.pause_menu_background);
        spritebg.setPosition(this.centerpos);
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
        menu.setPosition(this.centerpos);
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
        //var coverSprite = new cc.Sprite(res.pause_menu_background);
        //coverSprite.setPosition(this.centerpos);
        //this.addChild(coverSprite);
        //var labelSave = new cc.LabelTTF("SAVING", "Helvetica", 60);
        //labelSave.setColor(cc.color(255,255,255));//black color
        //labelSave.setPosition(this.centerpos);
        //this.addChild(labelSave);
        saveItems(this.getParent().itemLayer);
        savePlayerChar(this.getParent().playerLayer);
        saveEnemySpawns(this.getParent().enemyLayer);
        saveEnemies(this.getParent().enemyLayer);
        saveLocations(this.getParent().locationLayer);
        //this.removeChild(labelSave);
        //this.removeChild(coverSprite);
    },

    onMain: function () {
        this.getParent().removeAllChildren(true);
        cc.director.resume();
        cc.director.runScene(new MainMenuScene());
    }
});