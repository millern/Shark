var GameView = Backbone.View.extend({

  tagname: 'div',
  initialize: function(){
    this.model.on('errorMsg', function(errors){
      this.render(errors);
    }, this);
  },
  events: {
    'keyup .guess'  : function(event){
      if(event.which === 13){
        var guess = $('.guess').val().toLowerCase();
        this.model.validateGuess(guess);
        $('.guess').val('');
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
      var word = game.localPlayer === game.player1 ? game.word1 : game.word2;
      if (word){
      var player = game.localPlayer === game.player1 ? game.player1 : game.player2;
      var trail = game.guessing !== player || game.winner || !(game.word1 && game.word2) ? ' disabled />' : ' />';
      return new Handlebars.SafeString('<input class="guess" placeholder="guess word"' + trail);
      } else {
        return new Handlebars.SafeString('');
      }
    });
    Handlebars.registerHelper('setWord', function(game){
      var word = game.localPlayer === game.player1 ? game.word1 : game.word2;
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
      return game.winner? 'winner: ' + game.winner : game.guessing + ' is guessing.';
      }
    });
    Handlebars.registerHelper('guesses', function(guesses){
      return new Handlebars.SafeString(new GuessesView({collection: guesses}).render()[0].outerHTML);
    });
    Handlebars.registerHelper('word', function(game, side){
      var player = game.localPlayer === game.player1 ? 'player1' : 'player2';
      if ((side == "right"  && player === 'player2') || !!game.winner){
         return game.word2;
      } else if ((side === "left" && player === "player1") || !!game.winner){
        return game.word1;
      } else {
        return new Handlebars.SafeString('guess me');
      }
    });
    return Handlebars.compile(
      '<div class="row-fluid center"><h4 class="welcome">Welcome {{localPlayer}}</h4></div>' +
      '<div class="row-fluid center"><h5 class="gameState">{{gameState this}}</h5></div>' +
      '<div class="row-fluid center"><div class="setWord">{{setWord this}}</div></div>' +
      '<div class="row-fluid center"><div class="errors">{{errors}}</div></div>' +
      '<div class="row-fluid center"><div class="guessWord">{{guessWord this}}</div></div>' +
      '<div class="row-fluid wordsWrapper center">' +
          '<div class="row-fluid">' +
            '<div class="playerName span6">{{player1}}</div><div class="playerName span6">{{player2}}</div>'+
          '</div>'+
          '<div class="row-fluid">'+
            '<div class="word span6">{{word this "left"}}</div><div class="word span6">{{word this "right"}}</div>'+
          '</div>'+
          '<div class="row-fluid">' +
            '{{guesses this.word1Guesses}}{{guesses this.word2Guesses}}'+
          '</div>' +
      '</div>'
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