var AppView = Backbone.View.extend({
  tagName: 'div',
  initialize: function(){
    this.model.on('gameOver',function(){
      console.log("received game over event");
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
    console.log("rendering from app view");
    // console.log(this.model.get("currGame").get("winner"));
    return this.$el.append(
      (new GameView({model: this.model.get('currGame')})).render(),
      $('<div class="row"></div>')
      .append($btn)
      );
  }
});