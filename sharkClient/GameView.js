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
    Handlebars.registerHelper('guessWord1', function(game){
      var trail = game.guessing === game.player2 || game.winner ? ' disabled />' : ' />';
      return new Handlebars.SafeString('<input class="guess" placeholder="guess word"' + trail);
    });
    Handlebars.registerHelper('setWord1', function(game){
      var trail = !! game.word1 ? ' disabled />' : ' />';
      return new Handlebars.SafeString('<input class="set" placeholder="set word"' + trail);
    });
    Handlebars.registerHelper('guessWord2', function(game){
      var trail = game.guessing === game.player1 || game.winner ? ' disabled />' : ' />';
      return new Handlebars.SafeString('<input class="guess" placeholder="guess word"' + trail);
    });
    Handlebars.registerHelper('setWord2', function(game){
      var trail = !! game.word2 ? ' disabled />' : ' />';
      return new Handlebars.SafeString('<input class="set" placeholder="set word"' + trail);
    });
    Handlebars.registerHelper('gameState', function(game){
      return game.winner? 'winner: ' + game.winner : game.guessing + ' is guessing';
    });
    return Handlebars.compile(
      '<div class="row">'+
      '<div class="gameState span2 offset4">{{gameState this}}</div>' +
      '</div>' +
      '<div class="row">' +
      '<div class="player1Side span4 offset1">' +
      '{{setWord1}}'+
      '<div>{{player1}}</div>'+
      '{{guessWord1}}'+
      '<div>{{word1}}</div>'+
      '<ul>{{#each word1Guesses}}<li>{{this.guess}} {{this.score}}</li>{{/each}}</ul>'+
      '</div>'+
      '<div class="player2Side span4 offset1">' +
      '{{setWord2}}'+
      '<div>{{player2}}</div>'+
      '{{guessWord2}}'+
      '<div>{{word2}}</div>'+
      '<ul>{{#each word1Guesses}}<li>{{this.guess}} {{this.score}}</li>{{/each}}</ul>'+
      '</div>'+
      '</div>');
  },

  render: function(){
    this.$el.children().detach();
    var tmplt = this.template();
    // $gameState = $('<div class="row"></div>');
    // $('<div class="gameState span2 offset4"></div>')
      // .text(this.model.get('winner') ?
        // 'winner: ' + this.model.get('winner') :
        // this.model.get('guessing')+ " is guessing"
        // ).appendTo($gameState);

    // $gamePlay = $('<div class="row"></div>');
    // $player1Side = $('<div class="player1Side span4 offset1"></div>').append(
    //   $('<input class="set" placeholder="set word"/>')
    //     .prop("disabled",!!this.model.get("word1")),
    //   $('<div></div>').text(this.model.get('player1')),
    //   $('<input class="guess" placeholder="guess word"/>')
    //     .prop("disabled",this.model.get("guessing") === this.model.get("player2") || this.model.get("winner") ? true : false),
    //   $('<div></div>').text(this.model.get('word1')),
    //   new GuessesView({collection: this.model.get('word1Guesses')}).render()
      // ).appendTo($gamePlay);
    // $player2Side = $('<div class="player2Side span4"></div>').append(
    //   $('<input class="set" placeholder="set word"/>')
    //     .prop("disabled",!!this.model.get("word2")),
    //   $('<div></div>').text(this.model.get('player2')),
    //   $('<input class="guess" placeholder="guess word"/>')
    //     .prop("disabled",this.model.get("guessing") === this.model.get("player1") || this.model.get("winner") ? true : false),
    //   $('<div></div>').text(this.model.get('word2')),
    //   new GuessesView({collection: this.model.get('word2Guesses')}).render()
    //   ).appendTo($gamePlay);
    return this.$el.html(tmplt(this.model.toJSON()));
  }
});