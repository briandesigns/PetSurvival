// Extend the player layer so that it can support Player IDs

var PlayerMulti = Player.extend({
    playerId: null,
    
    ctor: function(playerId, character) {
        this.playerId = playerId;
        this._super(character);
    }
});