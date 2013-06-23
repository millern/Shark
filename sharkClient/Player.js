var Player = Backbone.Model.extend({
  initialize: function(params){
    this.set('name', params.name);
    this.set('id', params.id);
  },
  challenege: function(){
    socket.emit('challenge', this.toJSON());
  }
});