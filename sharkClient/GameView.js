var GameView = Backbone.View.extend({

  tagname: 'div',

  events: {
    'keyup .player1Side .guess'  : function(event){
      if(event.which === 13){
        this.model.addGuess(this.model.get("player1"),$('.player1Side .guess').val());
        $('.player1Side .guess').val('');
      }
    },
    'keyup .player2Side .guess'  : function(event){
      if(event.which === 13){
        this.model.addGuess(this.model.get("player2"),$('.player2Side .guess').val());
        $('.player2Side .guess').val('');
      }
    },
    'keyup .player1Side .set'  : function(event){
      if(event.which === 13){
        this.model.setWord(this.model.get("player1"),$('.player1Side .set').val());
        $('.player1Side .set').val('');
      }
    },
    'keyup .player2Side .set'  : function(event){
      if(event.which === 13){
        this.model.setWord(this.model.get("player2"),$('.player2Side .set').val());
        $('.player2Side .set').val('');
      }
    }
  },

  template: function(){
    Handlebars.registerHelper('guessWord', function(game, player){
      var trail = game.guessing === player || game.winner ? ' disabled />' : ' />';
      return new Handlebars.SafeString('<input class="guess" placeholder="guess word"' + trail);
    });
    Handlebars.registerHelper('setWord', function(word){
      var trail = !! word ? ' disabled />' : ' />';
      return new Handlebars.SafeString('<input class="set" placeholder="set word"' + trail);
    });
    Handlebars.registerHelper('gameState', function(game){
      return game.winner? 'winner: ' + game.winner : game.guessing + ' is guessing';
    });
    Handlebars.registerHelper('guesses', function(guesses){
      return new Handlebars.SafeString(new GuessesView({collection: guesses}).render()[0].outerHTML);
    });
    return Handlebars.compile(
      '<div class="row">'+
      '<div>{{localPlayer}}</div>' +
        '<div class="gameState span2 offset4">{{gameState this}}</div>' +
      '</div>' +
      '<div class="row">' +
        '<div class="player1Side span4 offset1">' +
          '{{setWord this.word1}}'+
          '<div>{{player1}}</div>'+
          '{{guessWord this this.player2}}'+
          '<div>{{word1}}</div>'+
          '{{guesses this.word1Guesses}}'+
        '</div>'+
        '<div class="player2Side span4 offset1">' +
          '{{setWord this.word2}}'+
          '<div>{{player2}}</div>'+
          '{{guessWord this this.player1}}'+
          '<div>{{word2}}</div>'+
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