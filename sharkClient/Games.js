var Games = Backbone.Collection.extend({
  model: Game,
  url: '/games',
  initialize: function(){
    this.on('syncGame',function(){
      socket.emit('update', this);
    }, this);
  }
});