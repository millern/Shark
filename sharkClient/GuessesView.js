var GuessesView = Backbone.View.extend({
  tagName: 'ul',
  className: "guessesList span6",

  render: function(){
    this.$el.children().detach();

    return this.$el.append(
      this.collection.map(function(guess){
        return new GuessView({model: guess}).render();
      })
    );
  }
});