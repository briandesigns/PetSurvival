var StartPoint = Location.extend({

    /**
     * start location . this is where player spawns
     * @param space
     */
    ctor: function (space) {
        this._super(COLLISION_TYPE.start, null, 0.1, space);
    }

});