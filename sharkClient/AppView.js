var AppView = Backbone.View.extend({
  tagName: 'div',
  initialize: function(){
    this.model.get('currGame').on('gameOver',function(){
      this.render();
    }, this);
  },
  events: {
    'click button' : function(){
      this.model.newGame('tucker');
      this.render();
    }
  },
  render: function(){
    this.$el.children().detach();
    var $btn = $('<button class="newGame offset4">New Game</button>');
    return this.$el.append(
      (new GameView({model: this.model.get('currGame')})).render(),
      $('<div class="row"></div>')
      .append($btn)
      );
  }
});