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
        return new Handlebars.SafeString('<b>guess me</b>');
      }
    });
    return Handlebars.compile(
      '<div class="row center"><h4 class="welcome">Welcome {{localPlayer}}</h4></div>' +
      '<div class="row center"><h5 class="gameState">{{gameState this}}</h5></div>' +
      '<div class="row center"><div class="setWord">{{setWord this}}</div></div>' +
      '<div class="row center"><div class="guessWord">{{guessWord this}}</div></div>' +
      '<div class="row wordsWrapper center">' +
        '<div class="leftSide">' +
          '<div class="row">' +
            '<div class="playerName">{{player1}}</div>'+
          '</div>'+
          '<div class="row">'+
            '<div>{{word this "left"}}</div>'+
          '</div>'+
          '<div class="row">' +
            '{{guesses this.word1Guesses}}'+
          '</div>'+
        '</div>'+
        '<div class="rightSide">' +
          '<div class="row">' +
            '<div class="playerName">{{player2}}</div>'+
          '</div>'+
          '<div class="row">' +
            '<div>{{word this "right"}}</div>'+
          '</div>'+
          '<div class="row">' +
            '{{guesses this.word2Guesses}}'+
          '</div>'+
        '</div>'+
      '</div>'
      );
  },

  render: function(){
    this.$el.children().detach();
    var tmplt = this.template();
    return this.$el.html(tmplt(this.model.toJSON()));
  }
});