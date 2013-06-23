var PlayersView = Backbone.View.extend({
  tagName: 'ul',
  className: 'lobby',
  render: function(){
    this.$el.children().detach();
    return this.$el.append(
      this.collection.map(function(player){
       return new PlayerView({model: player}).render();
    }));
  }
});