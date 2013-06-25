var Player = Backbone.Model.extend({
  initialize: function(params){
      this.set('id', params.id);
      this.set('name',params.name);
  },
  challenege: function(){
    socket.emit('challengeGame', this.toJSON());
  }
});