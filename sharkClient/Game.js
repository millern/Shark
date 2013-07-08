var Game = Backbone.Model.extend ({
  initialize: function(params){
    this.set('id', params.id);
    this.set('player1', params.player1);
    this.set('player2', params.player2);
    this.set('localPlayer', params.localPlayer);
    this.set('word1Guesses', params.word1Guesses ? new Guesses(params.word1Guesses) : new Guesses());
    this.set('word2Guesses', params.word2Guesses ? new Guesses(params.word2Guesses) : new Guesses());
    this.set('guessing', params.guessing || (Math.random() > 0.5 ? params.player1 : params.player2));
    this.set('winner',params.winner || null);
    this.set('isTerminated', params.isTerminated || false);

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
    if (player.id === this.get('player1').id) {
      this.set('word1', word);
    } else if (player.id === this.get('player2').id) {
      this.set('word2', word);
    } else {
      new Error('player is not in the game');
    }
  },
  addGuess: function(player, guess){
    if (player.id === this.get('player1').id) {
      this.get('word2Guesses').unshift(new Guess({guess:guess, word:this.get('word2')}));
    } else if (player.id === this.get('player2').id) {
      this.get('word1Guesses').unshift(new Guess({guess:guess, word:this.get('word1')}));
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
  validateGuess: function(word){
    if (this.validateCharacters(word)){
      this.checkDictionary(word);
    } else {
      this.trigger('errorMsg',"Invalid Guess");
    }
  },
  toggleTurn: function(){
    this.set('guessing',this.get('guessing').id === this.get('player1').id ?
                        this.get('player2') :
                        this.get('player1')
            );
  },
  checkWord: function(word){
    if(this.validateCharacters(word) &&
       this.validateDuplicates(word)){
      this.checkAnagram(word);
    } else {
      var errors = [];
      if (!this.validateCharacters(word)){
        errors.push('4 Letter Words');
      }
      if (!this.validateDuplicates(word)){
        errors.push('No Duplicate Letters');
      }
      this.trigger('errorMsg', errors.join(', '));
      console.log("invalid word",word);
    }
  },
  validateLength: function(word){
    return word.length === 4;
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
  checkAnagram: function(word){
    var self = this;
    $.ajax({
      url:"http://anagramica.com/best/"+word,
      type: "GET",
      dataType: "jsonp",
      success: function(data){
        if (data.best.length === 1 && data.best[0]===word){
          self.setWord(self.get('localPlayer'),word);
        } else {
          if (data.best.length === 1){
            self.trigger('errorMsg', word + " is not in the dictionary");
          } else {
            self.trigger('errorMsg', "No anagrams ("+data.best.join(', ')+")");
          }
          console.log("Anagram check fails: ",data.best.join(', '));
        }
      },
      error: function(err){
        console.log("Anagram error: ",err);
      }
    });
  },
  checkDictionary: function(word){
    var self = this;
    $.ajax({
      url:"http://anagramica.com/lookup/"+word,
      type: "GET",
      dataType: "jsonp",
      success: function(data){
        if (data.found === 1){
          self.addGuess(self.get("localPlayer"),word);
        } else {
          self.trigger('errorMsg',"Guess a real word");
          console.log("Guess is not a word");
        }
      },
      error: function(err){
        console.log("Anagram error: ",err);
      }
    });
  }
});