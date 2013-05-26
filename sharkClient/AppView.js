var AppView = Backbone.View.extend({
  tagName: 'div',

  render: function(){
    return this.$el.append(
      (new GameView({model: this.model.get('currGame')})).render()
      );
  }
});