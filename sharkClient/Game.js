var Game = Backbone.Model.extend ({
  initialize: function(params){
    this.set('id', params.id);
    this.set('player1', params.player1);
    this.set('player2', params.player2);
    this.set('localPlayer', params.localPlayer);
    this.set('word1Guesses', params.word1Guesses ? new Guesses(params.word1Guesses) : new Guesses());
    this.set('word2Guesses', params.word2Guesses ? new Guesses(params.word2Guesses) : new Guesses());
    this.set('guessing', params.guessing || params.player1);
    this.set('winner',params.winner || null);

    this.get('word1Guesses').on('add',function(guess){
      this.handleGuess(guess,this.get("player2"));
      this.trigger('syncGame');
    },this);
    this.get('word2Guesses').on('add',function(guess){
      this.handleGuess(guess,this.get("player1"));
      this.trigger('syncGame');
    },this);
    this.on('change:word1 change:word2',function(){
      this.trigger('syncGame');
    },this);
    this.on('syncGame',function(){
      socket.emit('update', this.toJSON());
    }, this);
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
  handleGuess: function(guess, guesser){
    if(guess.get('score') === 4 && this.validateDuplicates(guess.get('guess'))){
      console.log(guesser, ' won');
      this.set('winner',guesser);
    } else {
      console.log("new turn");
      this.toggleTurn();
      this.trigger('newTurn');
    }
  },
  toggleTurn: function(){
    this.set('guessing',this.get('guessing')===this.get('player1') ?
                        this.get('player2') :
                        this.get('player1')
            );
  },
  validateWord: function(word){
    return this.validateLength(word) &&
           this.validateCharacters(word) &&
           this.validateDuplicates(word) &&
           this.validateAnagram(word) ?
           true :
           false;
  },
  validateGuess: function(word){
    return this.validateLength(word) &&
           this.validateCharacters(word) ?
           true :
           false;
  },
  validateLength: function(word){
    return word.length === 4 ? true : false;
  },
  validateCharacters: function(word){
    return !!word.match(/^[a-z]{4}$/);
  },
  validateDuplicates: function(word){
    var hash = {};
    return _.reduce(word,function(memo,item){
      if(hash.hasOwnProperty(item) || !memo){
        return false;
      } else {
        hash[item] = true;
        return true;
      }
    },true);
  },
  validateAnagram: function(word){
    return true;
  }
});