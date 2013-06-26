var Players = Backbone.Collection.extend({
  initialize: function(){
    this.on('challenge', function(player){
      console.log("players challenge");
      this.trigger('challengeApp',player);
    },this);
  },
  model: Player
});