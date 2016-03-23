var EndPoint = Location.extend({

    ctor: function (space) {
        this._super(COLLISION_TYPE.end, new cc.PhysicsSprite(res.spawn_red_flag_png), 0.1, space);
    }

});