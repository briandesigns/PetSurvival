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

        var catSprite = new cc.Sprite(res.character_cat_png);
        catSprite.setScale(0.2);
        var menuItemCat = new cc.MenuItemSprite(
            catSprite, // normal state image
            null,
            this.chooseCat,
            this
        );

        var dogSprite = new cc.Sprite(res.character_dog_png);
        dogSprite.setScale(0.2);
        var menuItemDog = new cc.MenuItemSprite(
            dogSprite, // normal state image
            null,
            this.chooseDog,
            this
        );

        var rabbitSprite = new cc.Sprite(res.character_rabbit_png);
        rabbitSprite.setScale(0.2);
        var menuItemRabbit = new cc.MenuItemSprite(
            rabbitSprite, // normal state image
            null,
            this.chooseRabbit,
            this
        );

        var pigSprite = new cc.Sprite(res.character_pig_png);
        pigSprite.setScale(0.2);
        var menuItemPig = new cc.MenuItemSprite(
            pigSprite, // normal state image
            null,
            this.choosePig,
            this
        );

        var charMenu = new cc.Menu(menuItemCat, menuItemDog, menuItemRabbit, menuItemPig);  //7. create the
        charMenu.setPosition(cc.p(winsize.width/2 + 100, winsize.height));
        charMenu.alignItemsHorizontallyWithPadding(40);
        this.addChild(charMenu);


        var menuItemMapSmall = new cc.MenuItemSprite(
            new cc.Sprite(res.hud_inventory_png),
            null,
            this.chooseSmall,
            this
        );

        var menuItemMapMedium = new cc.MenuItemSprite(
            new cc.Sprite(res.hud_inventory_png),
            null,
            this.chooseMedium,
            this
        );

        var menuItemMapLarge = new cc.MenuItemSprite(
            new cc.Sprite(res.hud_inventory_png),
            null,
            this.chooseLarge,
            this
        );
        var mapMenu = new cc.Menu(menuItemMapSmall, menuItemMapMedium, menuItemMapLarge);
        mapMenu.setPosition(cc.p(centerpos.x, centerpos.y));
        mapMenu.alignItemsHorizontallyWithPadding(2);
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
        navMenu.setPosition(cc.p(centerpos.x, centerpos.y));
        navMenu.alignItemsHorizontallyWithPadding(2);
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