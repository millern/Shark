var App = Backbone.Model.extend({
  initialize: function(params){
    this.set('player', params.name);
    socket.emit('name',params.name);
    var self = this;
    socket.on('updateClient',function(data){
      data.localPlayer = self.get('player');
      self.set('currGame', new Game(data));
      self.trigger("update");
    });
    socket.on('playerList', function(data){
      self.set('playerList', new Players(data));
      self.trigger('newPLayers');
    });
  }
});
