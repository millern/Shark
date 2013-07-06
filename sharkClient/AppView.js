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
    }, this);

    this.model.on('change:message change:player', function(){
      this.render();
    }, this);

    this.model.on('newGameClicked',function(){
      this.model.set('message','Select an opponent or choose random');
      $('.newGame').toggleClass('randomOpponent').toggleClass('newGame').text('Random Opponent');
    }, this);

    this.model.on('challengeSent', function(){
      $('.randomOpponent').prop('disabled', true);
    });

    $('body').append(this.render());
  },
  events: {
    'click .newGame' : function(){
      var currGame = this.model.get('currGame');
      if (currGame && !currGame.get('isTerminated') && !currGame.get('winner')){
        // Prompt player to confirm game quit
        if (confirm("This will end your current game.  Are you sure?")){
          console.log("Player clicked new game -- game terminated");
          socket.emit('gameTerminated', this.model.get('currGame'));
          this.model.set('currGame', undefined);
        }
      } else {
        socket.emit('newGame',this.model.get('player'));
      }
      this.render();
    },
    'click .startGame' : function(e){  // Player sets name and clicks 'Got It'
      this.startGame();
    },
    'click .returnToLobby' : function(e) {
      this.model.set('currGame',undefined);
      //return player to lobby.  Lobby change will cause render.
      socket.emit('returnToLobby', this.model.get('player'));
    },
    'keyup .setName' : function(e){  // Player sets name and hits return
      if(e.which === 13){
        this.startGame();
      }
    },
    'click .randomOpponent' : function(e){
      socket.emit('randomOpponent', this.model.get('player'));
      this.model.trigger('challengeSent');
      this.model.set('message','Waiting for random opponent');
      //$('.randomOpponent').prop('disabled', true);
    }
  },
  startGame: function(){
    if ($('.setName').val() !== ''){
      this.model.set('player', {
        name: $('.setName').val(),
        id: socket.socket.sessionid
      });
      $('.wrapper').children().remove();
      this.model.set('message','Select an opponent or choose random');
      $('.setName').prop('disabled',true);
    } else {
      this.model.set('message','Please enter a name');
    }
  },
  render: function(){
    this.$el.children().detach();
    var playerName = this.model.get('player') ? this.model.get('player').name : '';
    $head = $('<header> Welcome to Shark ' + playerName + ' </header>');
    var $main = $('<div class="main"></div>');
    $main.append($('<h2 class="startMessages"></h2>').text(this.model.get('message')));
    console.log("rendering app view");
    this.$el.append(new PlayersView({collection: this.model.get('playerList')}).render());
    if(this.model.get('currGame')){
      return this.renderGame($head, $main);
    } else {
      return this.renderWelcome($head, $main);
    }
  },
  renderGame: function($head, $main) {
  var $btn = this.buttonText();
  $main.prepend($btn);
  $main.prepend(new GameView({model: this.model.get('currGame')}).render());
  $footer = $('<footer><small>powered by <a href="#">eagle</a></small></footer>');
  return this.$el.append($head, $main,$footer);
  },

  buttonText: function() {
    var currGame = this.model.get('currGame');
    var btnClass = currGame.get('isTerminated') ? 'randomOpponent' :
                   currGame.get('winner') ?   'returnToLobby' : 'newGame';
    var btnText = currGame.get('isTerminated') ? 'Random Opponent' :
                  currGame.get('winner') ?   'Return to Lobby' : 'New Game';
    return $('<button class="' + btnClass + '">' + btnText + '</button>');
  },

  rulesTemplate: function() {
    var model = this.model;
    Handlebars.registerHelper('actionInput',function(){
      if (!!model.get('player')){
        return new Handlebars.SafeString('<input class="setName" placeholder="Enter your name" disabled>');
      } else {
        return new Handlebars.SafeString('<input class="setName" placeholder="Enter your name">');
      }
    });
    Handlebars.registerHelper('actionButton', function(){
      if(!!model.get('player') || (model.get('currGame') && model.get('currGame').get('isTerminated'))){
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
          '</section>' +
          '</div>'
    );
  },
  renderWelcome: function($head, $main) {
    console.log('rendering welcome');
    $main.prepend(this.rulesTemplate()());
    $footer = $('<footer><small>powered by <a href="#">eagle</a></small></footer>');
    return this.$el.append($head,$main,$footer);
  }
});