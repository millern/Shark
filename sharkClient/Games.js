var Games = Backbone.Collection.extend({
  model: Game,
  url: '/games',
  initialize: function(){
    this.on('syncGame',function(){
      this.sync('update', this);
    }, this);
  }
});