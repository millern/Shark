var AppView = Backbone.View.extend({
  tagName: 'div',
  className: 'row',

  render: function(){
    return this.$el.append(
      (new GameView({model: this.model.get('currGame')})).render()
      );
  }
});