var MainMenuLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
    },

    init: function () {
        this._super();
        var winsize = cc.director.getWinSize();
        var centerpos = cc.p(winsize.width / 2, winsize.height / 2);
        var spritebg = new cc.Sprite(res.menu_background_png);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);
        cc.MenuItemFont.setFontSize(60);
        var menuItemSingleplayer = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_singleplayer), // normal state image
            new cc.Sprite(res.menu_button_selected_singleplayer), // select state image
            this.onPlay,
            this
        );
        var menuItemLoad = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_load),
            null,
            this.onLoad,
            this
        );
        var menu = new cc.Menu(menuItemSingleplayer, menuItemLoad);  //7. create the menu
        menu.setPosition(centerpos);
        menu.alignItemsVerticallyWithPadding(12);
        this.addChild(menu);

        cc.audioEngine.playMusic(res.music_mainmenu, true);
        //cc.audioEngine.setMusicVolume(0.4);
    },

    onPlay: function () {
        cc.log("==Creating New Game");
        //cc.director.pushScene(new PlayScene(false));
        cc.director.runScene(new ChoiceMenuScene());
    },

    onLoad: function () {
       cc.log("Load Saved Game");
        cc.director.runScene(new PlayScene(true));
    }
});