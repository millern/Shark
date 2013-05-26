var GameView = Backbone.View.extend({

  tagname: 'div',

  initialize: function(){
    this.model.get('word1Guesses').on('add', function(){
      this.render();
    }, this);
    this.model.get('word2Guesses').on('add', function(){
      this.render();
    }, this);
    this.model.on('change:word1 change:word2', function(){
      this.render();
    },this);
    this.model.on('change:winner', function(){
      this.render();
    },this);

  },

  events: {
    'keyup .rightSide .guess'  : function(event){
      if(event.which === 13){
        this.model.addGuess(this.model.get("player1"),$('.rightSide .guess').val());
        $('.rightSide .guess').val('');
      }
    },
    'keyup .leftSide .guess'  : function(event){
      if(event.which === 13){
        this.model.addGuess(this.model.get("player2"),$('.leftSide .guess').val());
        $('.leftSide .guess').val('');
      }
    },
    'keyup .rightSide .set'  : function(event){
      if(event.which === 13){
        this.model.setWord(this.model.get("player1"),$('.rightSide .set').val());
        $('.rightSide .set').val('');
      }
    },
    'keyup .leftSide .set'  : function(event){
      if(event.which === 13){
        this.model.setWord(this.model.get("player2"),$('.leftSide .set').val());
        $('.leftSide .set').val('');
      }
    }
  },

  render: function(){
    this.$el.children().detach();
    $gameState = $('<div class="row"></div>');
    $('<div class="gameState span2 offset4"></div>')
      .text(this.model.get('winner') ?
        'winner: ' + this.model.get('winner') :
        'inprogress'
        ).appendTo($gameState);
    $gamePlay = $('<div class="row"></div>');
    $rightSide = $('<div class="rightSide span4 offset1"></div>').append(
      $('<input class="set" placeholder="set word"/>'),
      $('<div></div>').text(this.model.get('player1')),
      $('<input class="guess" placeholder="guess word"/>'),
      $('<div></div>').text(this.model.get('word1')),
      new GuessesView({collection: this.model.get('word1Guesses')}).render()
      ).appendTo($gamePlay);
    $leftSide = $('<div class="leftSide span4"></div>').append(
      $('<input class="set" placeholder="set word"/>'),
      $('<div></div>').text(this.model.get('player2')),
      $('<input class="guess" placeholder="guess word"/>'),
      $('<div></div>').text(this.model.get('word2')),
      new GuessesView({collection: this.model.get('word2Guesses')}).render()
      ).appendTo($gamePlay);
    return this.$el.append([
      $gameState,
      $gamePlay
      ]);
  }
});