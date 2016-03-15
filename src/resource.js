var res = {
    menu_background_png : "res/menu/menu_background.png",
    menu_button_normal_singleplayer : "res/menu/menu_button_normal_singleplayer.png",
    menu_button_selected_singleplayer : "res/menu/menu_button_selected_singleplayer.png",
    menu_button_normal_runaway : "res/menu/menu_button_normal_runaway.png",
    menu_button_selected_runaway: "res/menu/menu_button_selected_runaway.png",
    terrain_jpg : "res/map/terrain.jpg",
    terrain2_png : "res/map/terrain2.png",
    terrain3_png : "res/map/terrain3.png",
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
    object_speed_point_png: "res/object/SpeedPoint.png"

};

var g_resources = [
    res.testmap_tmx
];

for (var i in res) {
    g_resources.push(res[i]);
}
