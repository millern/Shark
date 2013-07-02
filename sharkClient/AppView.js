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

    this.model.on('update', function(){
      this.render();
    },this);

    this.model.on('newGameClicked',function(){
      console.log("reached view");
      $('.startMessages').text('Select an opponent or choose random');
      $('.newGame').toggleClass('randomOpponent').toggleClass('newGame').text('Random Opponent');
    });

    this.model.on('challengeSent', function(){
      $('.randomOpponent').prop('disabled', true);
    });

    $('body').append(this.render());
  },
  events: {
    'click .newGame' : function(){
      console.log("rendering new game");
      if (this.model.get('currGame') && !this.model.get('currGame').get('isTerminated')){
        socket.emit('gameTerminated', this.model.get('currGame'));
        this.model.set('currGame', undefined);
      }
      socket.emit('newGame',this.model.get('player'));
      this.render();
    },
    'click .startGame' : function(){
      this.startGame();
    },
    'keyup .setName' : function(e){
      if(e.which === 13){
        this.startGame();
      }
    },
    'click .randomOpponent' : function(e){
      socket.emit('randomOpponent', this.model.get('player'));
      $('.startMessages').text('Waiting for random opponent');
    }
  },
  welcomeTemplate: function(){
    return Handlebars.compile(
      '<header>Welcome {{name}}</header>'
      );
  },
  startGame: function(){
    console.log("starting a game");
    if ($('.setName').val() !== ''){
      this.model.set('player', {
        name: $('.setName').val(),
        id: socket.socket.sessionid
      });
      $('.wrapper').children().remove();
      $('.startMessages').text('Waiting for Opponent');
      $('.setName').prop('disabled',true);
    } else {
      $('.startMessages').text('Please enter a name');
    }
  },
  render: function(){
    this.$el.children().detach();
    var $main = $('<div class="main"></div>');
    console.log("rendering app view");
    this.$el.append(new PlayersView({collection: this.model.get('playerList')}).render());
    if(this.model.get('currGame')){
      return this.renderGame($main);
    } else {
      return this.renderWelcome($main);
    }
  },
  renderGame: function($main) {
  var tmplt = this.welcomeTemplate();
  var params = this.model.toJSON();
  var $btn = $('<button class="newGame">New Game</button>');
  $main.append(new GameView({model: this.model.get('currGame')}).render());
  $main.append($btn);
  $main.append($('<h2 class="startMessages"></h2>'));
  $footer = $('<footer><small>powered by <a href="#">eagle</a></small></footer>');
  return this.$el.append(tmplt(params.player), $main,$footer);
  },
  rulesTemplate: function(){
    var model = this.model;
    Handlebars.registerHelper('actionInput',function(){
      if (!!model.get('player')){
        return new Handlebars.SafeString('<input class="setName" placeholder="Enter your name" disabled>');
      } else {
        return new Handlebars.SafeString('<input class="setName" placeholder="Enter your name">');
      }
    });
    Handlebars.registerHelper('actionButton', function(){
      if(!!model.get('player')){
        return new Handlebars.SafeString('<button class="randomOpponent">Random Opponent.</button>');
      } else {
        return new Handlebars.SafeString('<button class="startGame">Got it.</button>');
      }
    });
    return Handlebars.compile(
      '<div id="instructions" class="gameWrapper">' +
          '<section id="gamePlay">' +
            '{{actionInput}}' +
            '<section class="rules">' +
              '<h2>How to Play</h2>' +
              '<ol>' +
                '<li>Choose a 4 letter word.  No anagrams.  No duplicate letters.  No fake words.</li>' +
                '<li>Guess your opponent\'s word.</li>' +
                '<li>See how many letters in your guess match letters in your opponent\'s word.</li>' +
                '<li>The first player to guess his opponent\'s word wins.</li>' +
                '<li>Start a game by clicking on an opponent in the lobby or selecting a random opponent</li>' +
                '<li>Good Luck!</li>' +
              '</ol>' +
            '</section>' +
            '{{actionButton}}' +
            '<h2 class="startMessages"></h2>' +
          '</section>' +
          '</div>'
    );
  },
  renderWelcome: function($main) {
    console.log('rendering welcome');
    $head = $('<header> Welcome to Shark</header>');
    $main.append(this.rulesTemplate()());
    $footer = $('<footer><small>powered by <a href="#">eagle</a></small></footer>');
    return this.$el.append($head,$main,$footer);
  }
});