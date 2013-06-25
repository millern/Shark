var GameView = Backbone.View.extend({

  tagname: 'div',
  className: 'gameWrapper cf',
  initialize: function(){
    this.model.on('errorMsg', function(errors){
      this.render(errors);
    }, this);
  },
  events: {
    'keyup .guessBox'  : function(event){
      if(event.which === 13){
        var guess = $('.guessBox').val().toLowerCase();
        this.model.validateGuess(guess);
        $('.guessBox').val('');
      }
    },
    'keyup .set'  : function(event){
      if(event.which === 13){
        this.model.checkWord($('.set').val());
        $('.set').val('');
      }
    }
  },

  template: function(){
    Handlebars.registerHelper('guessWord', function(game){
      var word = game.localPlayer.id === game.player1.id ? game.word1 : game.word2;
      if (word){
      var player = game.localPlayer.id === game.player1.id ? game.player1 : game.player2;
      var trail = game.guessing.id !== player.id || game.winner || !(game.word1 && game.word2) ? ' disabled />' : ' />';
      return new Handlebars.SafeString('<input class="guessBox" placeholder="guess word"' + trail);
      } else {
        return new Handlebars.SafeString('');
      }
    });
    Handlebars.registerHelper('setWord', function(game){
      var word = game.localPlayer.id === game.player1.id ? game.word1 : game.word2;
      if (!word){
      return new Handlebars.SafeString('<input class="set" placeholder="set word" />');
      } else {
        return new Handlebars.SafeString('');
      }
    });
    Handlebars.registerHelper('gameState', function(game){
      if (!(game.word1 && game.word2)){
        return "set your words";
      } else {
      return game.winner? 'winner: ' + game.winner.name : game.guessing.name + ' is guessing.';
      }
    });
    Handlebars.registerHelper('guesses', function(guesses){
      return new Handlebars.SafeString(new GuessesView({collection: guesses}).render()[0].outerHTML);
    });
    Handlebars.registerHelper('word', function(game, side){
      var player = game.localPlayer.id === game.player1.id ? 'player1' : 'player2';
      if ((side == "right"  && player === 'player2') || !!game.winner){
         return game.word2;
      } else if ((side === "left" && player === "player1") || !!game.winner){
        return game.word1;
      } else {
        return new Handlebars.SafeString('guess me');
      }
    });
    return Handlebars.compile(
      '<section id="gamePlay">'+
        '<h1 class="gameState">{{gameState this}}</h1>' +
        '{{setWord this}}' +
        '<div class="guessWord">{{guessWord this}}</div>' +
        '<div class="errors">{{errors}}</div>' +
      '</section>' +
      '<section id="opponent">' +
        '<h1>{{player1.name}}</h1>' +
        '<h2>{{word this "left"}}</h2>' +
        '{{guesses this.word1Guesses}}' +
      '</section>' +
      '<section id="player">' +
        '<h1>{{player2.name}}</h1>'+
        '<h2>{{word this "right"}}</h2>'+
        '{{guesses this.word2Guesses}}'+
      '</section>'
      );
  },

  render: function(errors){
    this.$el.children().detach();
    var params = this.model.toJSON();
    if(errors){
      params.errors = errors;
    }
    var tmplt = this.template();
    return this.$el.html(tmplt(params));
  }
});