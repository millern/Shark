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
    var $btn = $('<div class="center"><button class="newGame">New Game</button></div>');
    console.log("rendering from app view");
    return this.$el.append(
      (new GameView({model: this.model.get('currGame')})).render().append($btn)
      );
  }
});