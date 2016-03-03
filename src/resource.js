var res = {
    menu_background_png : "res/menu/menu_background.png",
    menu_button_normal_singleplayer : "res/menu/menu_button_normal_singleplayer.png",
    menu_button_selected_singleplayer : "res/menu/menu_button_selected_singleplayer.png",
    menu_button_normal_runaway : "res/menu/menu_button_normal_runaway.png",
    menu_button_selected_runaway: "res/menu/menu_button_selected_runaway.png",
    character_bunny_png : "res/character/bunny.png",
    trees_png : "res/map/trees.png",
    HF1_A2_png : "res/map/HF1_A2.png",
    map_tmx : "res/map/map.tmx"
};

var g_resources = [
    res.map_tmx
];

for (var i in res) {
    g_resources.push(res[i]);
}
