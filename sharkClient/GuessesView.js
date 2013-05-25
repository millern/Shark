var GuessesView = Backbone.View.extend({
  tagName: 'ul',

  render: function(){
    this.$el.children().detach();

    return this.$el.append(
      this.collection.map(function(guess){
        return new GuessView({model: guess}).render();
      })
    );
  }
});