var ChoiceMenuLayer = cc.Layer.extend({
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


        var menuItemCat = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_cat),
            new cc.Sprite(res.menu_button_selected_cat),
            this.chooseCat,
            this
        );



        var menuItemDog = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_dog),
            new cc.Sprite(res.menu_button_selected_dog),
            this.chooseDog,
            this
        );


        var menuItemRabbit = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_rabbit),
            new cc.Sprite(res.menu_button_selected_rabbit),
            this.chooseRabbit,
            this
        );


        var menuItemPig = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_pig),
            new cc.Sprite(res.menu_button_selected_pig),
            this.choosePig,
            this
        );

        var charMenu = new cc.Menu(menuItemCat, menuItemDog, menuItemRabbit, menuItemPig);  //7. create the
        charMenu.setPosition(cc.p(centerpos.x, centerpos.y+200));
        charMenu.alignItemsHorizontallyWithPadding(40);
        this.addChild(charMenu);


        var menuItemMapSmall = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_smallmap),
            new cc.Sprite(res.menu_button_selected_smallmap),
            this.chooseSmall,
            this
        );

        var menuItemMapMedium = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_mediummap),
            new cc.Sprite(res.menu_button_selected_mediummap),
            this.chooseMedium,
            this
        );

        var menuItemMapLarge = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_largemap),
            new cc.Sprite(res.menu_button_selected_largemap),
            this.chooseLarge,
            this
        );
        var mapMenu = new cc.Menu(menuItemMapSmall, menuItemMapMedium, menuItemMapLarge);
        mapMenu.setPosition(cc.p(centerpos.x, centerpos.y));
        mapMenu.alignItemsHorizontallyWithPadding(40);
        this.addChild(mapMenu);

        var menuItemMain = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_main),
            null,
            this.onMain,
            this
        );

        var menuItemPlay = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_singleplayer),
            null,
            this.onPlay,
            this
        );
        var navMenu = new cc. Menu(menuItemMain, menuItemPlay);
        navMenu.setPosition(cc.p(centerpos.x, centerpos.y-100));
        navMenu.alignItemsHorizontallyWithPadding(20);
        this.addChild(navMenu);
    },

    chooseCat: function () {
        playerType = CHAR_TYPE.cat;
    },

    chooseDog: function () {
        playerType = CHAR_TYPE.dog;
    },

    chooseRabbit: function () {
        playerType = CHAR_TYPE.rabbit;
    },

    choosePig: function () {
        playerType = CHAR_TYPE.pig;
    },

    chooseSmall: function () {
        chosenMapSize =MAP_SIZE.small;
    },

    chooseMedium: function () {
        chosenMapSize = MAP_SIZE.medium;
    },

    chooseLarge: function () {
        chosenMapSize = MAP_SIZE.big;
    },

    onMain: function () {
        cc.director.popScene();
    },

    onPlay: function () {
        cc.director.runScene(new PlayScene(false));
    }

});