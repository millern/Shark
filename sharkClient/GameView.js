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

  render: function(){
    this.$el.children().detach();

    $gameState = $('<div class="row"></div>');
    $('<div class="gameState span2 offset4"></div>')
      .text(this.model.get('winner') ?
        'winner: ' + this.model.get('winner') :
        this.model.get('guessing')+ " is guessing"
        ).appendTo($gameState);

    $gamePlay = $('<div class="row"></div>');
    $player1Side = $('<div class="player1Side span4 offset1"></div>').append(
      $('<input class="set" placeholder="set word"/>')
        .prop("disabled",!!this.model.get("word1")),
      $('<div></div>').text(this.model.get('player1')),
      $('<input class="guess" placeholder="guess word"/>')
        .prop("disabled",this.model.get("guessing") === this.model.get("player2") || this.model.get("winner") ? true : false),
      $('<div></div>').text(this.model.get('word1')),
      new GuessesView({collection: this.model.get('word1Guesses')}).render()
      ).appendTo($gamePlay);
    $player2Side = $('<div class="player2Side span4"></div>').append(
      $('<input class="set" placeholder="set word"/>')
        .prop("disabled",!!this.model.get("word2")),
      $('<div></div>').text(this.model.get('player2')),
      $('<input class="guess" placeholder="guess word"/>')
        .prop("disabled",this.model.get("guessing") === this.model.get("player1") || this.model.get("winner") ? true : false),
      $('<div></div>').text(this.model.get('word2')),
      new GuessesView({collection: this.model.get('word2Guesses')}).render()
      ).appendTo($gamePlay);
    return this.$el.append([
      $gameState,
      $gamePlay
      ]);
  }
});