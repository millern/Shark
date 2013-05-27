var App = Backbone.Model.extend({
  initialize: function(params){
    this.set('player', params.name);
    socket.emit('name',params.name);
    var self = this;
    socket.on('updateClient',function(data){
      console.log('update client');
      self.set('currGame', new Game(data));
      self.trigger("ready");
    });
  }
});
