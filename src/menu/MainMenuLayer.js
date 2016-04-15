var MainMenuLayer = cc.Layer.extend({
    /**
     * our main menu
     */

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
        // Multiplayer menu button (note: currently uses single player sprite)
        var menuItemMultiplayer = new cc.MenuItemSprite(
            new cc.Sprite(res.menu_button_normal_multiplayer),
            new cc.Sprite(res.menu_button_selected_multiplayer),
            this.onMultiplayer,
            this
        );
        
        var menu = new cc.Menu(menuItemSingleplayer, menuItemLoad, menuItemMultiplayer);  //7. create the menu
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
    },
    
    onMultiplayer: function () {
        cc.log("Multiplayer Game Selected");

        //create a message to send to the server
        var config = {
            event:Events.LOGIN,
            username:"Joe"
        };
        var message = Encode(config);

        //open WebSocket connection with the server and wait for handshake confirmation
        try {
            ws = new WebSocket("ws://localhost:8888/ws");

            // callback when connection is opened (?)
            ws.onopen = function () {
                ws.send(message)
            };

            // Callback when there is a message from the server
            ws.onmessage = function(e) {
                console.log("message from server: " + e.data);
                if (e.data!==null || e.data!== 'undefined') {
                    var jsonFromClient = Decode(e.data);

                    // Login is successful, start a new game
                    if(jsonFromClient.event === Events.LOGIN_DONE) {
                        cc.log("==Creating New Game");
                        cc.director.runScene(new MultiplayerScene(jsonFromClient));
                    }
                }
            };

            // Callback when connection is closed (?)
            ws.onclose = function(e) { };

            // Callback when connection encounters an error (?)
            ws.onerror = function(e) { };
        } catch (e) {
            console.error('Sorry, the web socket at "%s" is unavailable', url);
        }
    }
});