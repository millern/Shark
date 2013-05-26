var Games = Backbone.Collection.extend({
  model: Game,
  url: '/games',
  initialize: function(){
    this.on('newGuess',function(){
      this.sync('update', this);
    }, this);
  }
});