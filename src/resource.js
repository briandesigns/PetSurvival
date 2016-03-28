var res = {
    menu_background_png : "res/menu/menu_background.png",
    menu_button_normal_singleplayer : "res/menu/menu_button_normal_singleplayer.png",
    menu_button_selected_singleplayer : "res/menu/menu_button_selected_singleplayer.png",
    menu_button_normal_runaway : "res/menu/menu_button_normal_runaway.png",
    menu_button_selected_runaway: "res/menu/menu_button_selected_runaway.png",
    menu_button_normal_resume: "res/menu/menu_button_normal_resume.png",
    menu_button_normal_save: "res/menu/menu_button_normal_save.png",
    menu_button_normal_load: "res/menu/menu_button_normal_load.png",
    menu_button_normal_main: "res/menu/menu_button_normal_main.png",
    pause_menu_background: "res/menu/pause_menu_background.png",
    terrain_jpg : "res/map/terrain.jpg",
    terrain2_png : "res/map/terrain2.png",
    terrain3_png : "res/map/terrain3.png",
    caveTerrain_jpg : "res/map/caveTerrain.jpeg",
    caveTerrain_png : "res/map/caveTerrain.png",
    caveTerrain_tmx : "res/map/caveTerrain16x16.tmx",
    testmap_tmx : "res/map/64x64.tmx",
    character_rabbit_png : "res/character/rabbit.png",
    character_dog_png : "res/character/dog.png",
    character_pig_png : "res/character/pig.png",
    character_cat_png : "res/character/cat.png",
    character_hydrant_png : "res/character/hydrant.png",
    character_dryer_png : "res/character/dryer.png",
    character_can_png : "res/character/can.png",
    character_vacuum_png : "res/character/vacuum.png",
    spawn_cave_png: "res/spawn/cave.png",
    spawn_can_png: "res/spawn/CanSpawn.png",
    spawn_dryer_png: "res/spawn/DryerSpawn.png",
    spawn_hydrant_png: "res/spawn/HydrantSpawn.png",
    spawn_vacuum_png: "res/spawn/VacuumSpawn.png",
    spawn_red_flag_png: "res/spawn/redFlag.png",
    spawn_blue_flag_png: "res/spawn/blueFlag.png",
    object_food_png: "res/object/Food.png",
    object_health_point_png: "res/object/HealthPoint.png",
    object_hit_point_png: "res/object/HitPoint.png",
    object_speed_point_png: "res/object/SpeedPoint.png",
    object_pine_cone_png: "res/object/PineCone.png",
    hud_inventory_png: "res/hud/inventory.png",
    rabbit_png  : "res/character/spriteSheet/rabbit.png",
    rabbit_plist : "res/character/spriteSheet/rabbit.plist",

    dog_png  : "res/character/spriteSheet/dog.png",
    dog_plist : "res/character/spriteSheet/dog.plist",

    cat_png  : "res/character/spriteSheet/cat.png",
    cat_plist : "res/character/spriteSheet/cat.plist",

    pig_png  : "res/character/spriteSheet/pig.png",
    pig_plist : "res/character/spriteSheet/pig.plist",

    vacuum_png  : "res/character/spriteSheet/vacuum.png",
    vacuum_plist : "res/character/spriteSheet/vacuum.plist",

    can_png  : "res/character/spriteSheet/can.png",
    can_plist : "res/character/spriteSheet/can.plist",

    hydrant_png  : "res/character/spriteSheet/hydrant.png",
    hydrant_plist : "res/character/spriteSheet/hydrant.plist",

    dryer_png  : "res/character/spriteSheet/dryer.png",
    dryer_plist : "res/character/spriteSheet/dryer.plist"

};

var g_resources = [
    res.testmap_tmx
];

for (var i in res) {
    g_resources.push(res[i]);
}
