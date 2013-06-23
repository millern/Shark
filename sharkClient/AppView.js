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
    if(this.model.get('currGame')){
      return this.renderGame();
    } else {
      return this.renderWelcome();
    }
  },
  renderGame: function() {
  var tmplt = this.welcomeTemplate();
  var $btn = $('<button class="newGame">New Game</button>');
  $main = $('<div class="main"></div>');
  $main.append(new PlayersView({collection: this.model.get('playerList')}));
  $main.append(new GameView({model: this.model.get('currGame')}).render());
  $main.append($btn);
  $footer = $('<footer><small>powered by <a href="#">eagle</a></small></footer>');
  return this.$el.append(tmplt(params), $main,$footer);
  },
  renderWelcome: function() {
    console.log('rendering welcome');
    $head = $('<header> Welcome to Shark</header>');
    $main = $('<div class="main"></div>');
    $main.append($('<div id="instructions" class="gameWrapper">' +
          '<section id="gamePlay">' +
            '<input class="setName" placeholder="Enter your name">' +
            '<section class="rules">' +
              '<h2>How to Play</h2>' +
              '<ol>' +
                '<li>Choose a 4 letter word.  No anagrams.  No duplicate letters.  No fake words.</li>' +
                '<li>Guess your opponent\'s word.</li>' +
                '<li>See how many letters in your guess match letters in your opponent\'s word.</li>' +
                '<li>The first player to guess his opponent\'s word wins.</li>' +
                '<li>Good Luck!</li>' +
              '</ol>' +
            '</section>' +
            '<button class="startGame">Got it.</button>' +
            '<h2 class="startMessages"></h2>' +
          '</section>' +
          '</div>'));
    $footer = $('<footer><small>powered by <a href="#">eagle</a></small></footer>');
    return this.$el.append($head,$main,$footer);
  }
});