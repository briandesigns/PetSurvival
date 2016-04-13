/**
 * Created by Joe on 2016-04-13.
 */

var PlayerMulti = Player.extend({
    playerId: null,
    
    ctor: function(playerId, character) {
        this.playerId = playerId;
        this._super(character);
    }
});