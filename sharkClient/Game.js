var Game = Backbone.Model.extend ({
  initialize: function(params){
    this.set('player1', params.player1);
    this.set('player2', params.player2);
    this.set('word1Guesses', new Guesses());
    this.set('word2Guesses', new Guesses());
    this.set('guessing', params.player1);
    this.set('winner',null);
    this.get('word1Guesses').on('add',function(guess){
      if(guess.get('score') === 4){
      console.log('player2 won');
      this.set('winner',this.get('player2'));
      this.trigger('gameOver');
      }
    },this);
    this.get('word2Guesses').on('add',function(guess){
      if(guess.get('score') === 4){
        console.log('player1 won');
        this.set('winner',this.get('player1'));
        this.trigger('gameOver');
      }
    },this);
  },
  setWord: function(player, word){
    if (player === this.get('player1')) {
      this.set('word1', word);
    } else if (player === this.get('player2')) {
      this.set('word2', word);
    } else {
      new Error('player is not in the game');
    }
  },
  addGuess: function(player, guess){
    if (player === this.get('player1')) {
      this.get('word2Guesses').add(new Guess({guess:guess, word:this.get('word2')}));
    } else if (player === this.get('player2')) {
      this.get('word1Guesses').add(new Guess({guess:guess, word:this.get('word1')}));
    } else {
      new Error('player is not in the game');
    }
  },
  validWord: function(word){

  }
});