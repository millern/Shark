var GameView = Backbone.View.extend({

  tagname: 'div',

  events: {
    'keyup .guess'  : function(event){
      if(event.which === 13){
        this.model.addGuess(this.model.get("localPlayer"),$('.guess').val());
        $('.guess').val('');
      }
    },
    'keyup .set'  : function(event){
      if(event.which === 13){
        this.model.setWord(this.model.get("localPlayer"),$('.set').val());
        $('.set').val('');
      }
    }
  },

  template: function(){
    Handlebars.registerHelper('guessWord', function(game){
      var player = game.localPlayer === game.player1 ? game.player1 : game.player2;
      var trail = game.guessing !== player || game.winner ? ' disabled />' : ' />';
      return new Handlebars.SafeString('<input class="guess" placeholder="guess word"' + trail);
    });
    Handlebars.registerHelper('setWord', function(game){
      var word = game.localPlayer === game.player1 ? game.word1 : game.word2;
      var trail = !! word ? ' disabled />' : ' />';
      return new Handlebars.SafeString('<input class="set" placeholder="set word"' + trail);
    });
    Handlebars.registerHelper('gameState', function(game){
      return game.winner? 'winner: ' + game.winner : game.guessing + ' is guessing.';
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
        return "";
      }
    });
    return Handlebars.compile(
      '<div class="row"><h4 class="span4 offset4">Welcome {{localPlayer}}</h4></div>' +
      '<div class="row"><h4 class="gameState span4 offset4">{{gameState this}}</h4></div>' +
      '<div class="row"><div class="span2 offset4">{{setWord this}}</div></div>' +
      '<div class="row"><div class="span2 offset4">{{guessWord this}}</div></div>' +
      '<div class="row">' +
        '<div class="leftSide span4 offset2">' +
          '<div class="playerName">{{player1}}</div>'+
          '<div>{{word this "left"}}</div>'+
          '{{guesses this.word1Guesses}}'+
        '</div>'+
        '<div class="rightSide" span4 offset2">' +
          '<div class="playerName">{{player2}}</div>'+
          '<div>{{word this "right"}}</div>'+
          '{{guesses this.word2Guesses}}'+
        '</div>'+
      '</div>');
  },

  render: function(){
    this.$el.children().detach();
    var tmplt = this.template();
    return this.$el.html(tmplt(this.model.toJSON()));
  }
});