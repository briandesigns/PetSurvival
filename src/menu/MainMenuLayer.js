/**
 * Created by brian on 2/13/16.
 */
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
            this.onPlay, this
        );
        var menuItemExit = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_runaway),
            new cc.Sprite(res.menu_button_selected_runaway),
            this.onRunaway, this
        );
        var menu = new cc.Menu(menuItemSingleplayer, menuItemExit);  //7. create the menu
        menu.setPosition(centerpos);
        menu.alignItemsVerticallyWithPadding(12);
        this.addChild(menu);
    },

    onPlay: function () {
        cc.log("==onplay clicked");
        cc.director.runScene(new PlayScene());
    },

    onRunaway: function () {
        cc.log("==onRunaway clicked");
    }
});