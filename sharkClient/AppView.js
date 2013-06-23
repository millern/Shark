var AppView = Backbone.View.extend({
  tagName: 'div',
  className: 'wrapper',
  initialize: function(){
    this.model.on('gameOver',function(){
      this.render();
    }, this);
    this.model.on('newPlayers', function(){
      this.render();
    }, this);
  },
  events: {
    'click .newGame' : function(){
      socket.emit('newGame',this.model.get('currGame').toJSON());
      this.render();
    }
  },
  welcomeTemplate: function(){
    return Handlebars.compile(
      '<header>Welcome {{name}}</header>'
      );
  },
  render: function(){
    this.$el.children().detach();
    var params = this.model.toJSON();
    var tmplt = this.welcomeTemplate();
    var $btn = $('<button class="newGame">New Game</button>');
    console.log("rendering from app view");
    $main = $('<div class="main"></div>');
    $main.append(new PlayersView({collection: this.model.get('playerList')}));
    $main.append(new GameView({model: this.model.get('currGame')}).render());
    $main.append($btn);
    $footer = $('<footer><small>powered by <a href="#">eagle</a></small></footer>');
    return this.$el.append(tmplt(params), $main,$footer);
  }
});