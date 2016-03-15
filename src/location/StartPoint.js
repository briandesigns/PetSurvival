var StartPoint = Location.extend({

    ctor: function (space) {
        this._super(COLLISION_TYPE.start, new cc.PhysicsSprite(res.spawn_blue_flag_png), 0.5, space);
    }

});