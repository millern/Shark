var AppView = Backbone.View.extend({
  tagName: 'div',
  initialize: function(){
    this.model.on('gameOver',function(){
      this.render();
    }, this);
  },
  events: {
    'click .newGame' : function(){
      socket.emit('newGame',this.model.get('currGame').toJSON());
      this.render();
    }
  },
  render: function(){
    this.$el.children().detach();
    var $btn = $('<button class="newGame offset4">New Game</button>');
    console.log("rendering from app view");
    return this.$el.append(
      (new GameView({model: this.model.get('currGame')})).render(),
      $('<div class="row"></div>')
      .append($btn)
      );
  }
});