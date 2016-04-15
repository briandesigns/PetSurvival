var StartPoint = Location.extend({

    ctor: function (space) {
        this._super(COLLISION_TYPE.start, null, 0.1, space);
    }

});