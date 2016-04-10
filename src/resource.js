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
    menu_button_normal_cat: "res/menu/menu_button_normal_cat.png",
    menu_button_normal_dog: "res/menu/menu_button_normal_dog.png",
    menu_button_normal_pig: "res/menu/menu_button_normal_pig.png",
    menu_button_normal_rabbit: "res/menu/menu_button_normal_rabbit.png",
    menu_button_selected_cat: "res/menu/menu_button_selected_cat.png",
    menu_button_selected_dog: "res/menu/menu_button_selected_dog.png",
    menu_button_selected_pig: "res/menu/menu_button_selected_pig.png",
    menu_button_selected_rabbit: "res/menu/menu_button_selected_rabbit.png",
    menu_button_normal_smallmap: "res/menu/menu_button_normal_smallmap.png",
    menu_button_normal_mediummap: "res/menu/menu_button_normal_mediummap.png",
    menu_button_normal_largemap: "res/menu/menu_button_normal_largemap.png",
    menu_button_selected_smallmap: "res/menu/menu_button_selected_smallmap.png",
    menu_button_selected_mediummap: "res/menu/menu_button_selected_mediummap.png",
    menu_button_selected_largemap: "res/menu/menu_button_selected_largemap.png",
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
    character_boss_png : "res/character/boss.png",
    spawn_cave_png: "res/spawn/cave.png",
    spawn_can_png: "res/spawn/CanSpawn.png",
    spawn_dryer_png: "res/spawn/DryerSpawn.png",
    spawn_hydrant_png: "res/spawn/HydrantSpawn.png",
    spawn_vacuum_png: "res/spawn/VacuumSpawn.png",
    spawn_boss_png: "res/spawn/BossSpawn.png",
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
    dryer_plist : "res/character/spriteSheet/dryer.plist",

    boss_png  : "res/character/spriteSheet/boss.png",
    boss_plist : "res/character/spriteSheet/boss.plist",

    object_super_speed_png: "res/object/SuperSpeedPoint.png",
    object_super_health_png: "res/object/SuperHealthPoint.png",
    object_super_hit_png: "res/object/SuperHitPoint.png",

    music_map : "res/sound/background/Brittle Rille.mp3",
    music_mainmenu : "res/sound/background/Danse Macabre - Light Dance.mp3",
    music_boss : "res/sound/background/Clash Defiant.mp3",
    sound_attack : "res/sound/attack.wav",
    sound_enemy_defeat : "res/sound/enemy_defeat.wav",
    sound_spawn_destruction : "res/sound/spawn_destruction.mp3",
    sound_item_add : "res/sound/item_add.mp3",
    sound_item_remove : "res/sound/item_remove.mp3",
    sound_projectile : "res/sound/projectile.wav",
    
    EndPoint : "res/spawn/EndPoint.png",
    human_plist : "res/spawn/human.plist",
    human_png : "res/spawn/human.png"
};

var g_resources = [
    res.testmap_tmx
];

for (var i in res) {
    g_resources.push(res[i]);
}
