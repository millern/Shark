var App = Backbone.Model.extend({
  initialize: function(params){
    socket.on('playerList', function(data){
      self.set('playerList', new Players(data));
      self.trigger('newPLayers');
    });
    this.on('change:player', function(){
      socket.emit('name',this.get('player'));
    },this);
    this.set('playerList', new Players([]));
    var self = this;
    socket.on('updateClient',function(data){
      data.localPlayer = self.get('player');
      self.set('currGame', new Game(data));
      self.trigger("update");
    });
  }
});
