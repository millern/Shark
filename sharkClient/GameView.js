var GameView = Backbone.View.extend({

  tagname: 'div',

  initialize: function(){
    this.model.get('word1Guesses').on('add', function(){
      this.render();
    }, this);
    this.model.get('word2Guesses').on('add', function(){
      this.render();
    }, this);
  },

  events: {
    'keyup .rightSide input'  : function(event){
      if(event.which === 13){
        this.model.addGuess(this.model.get("player1"),$('.rightSide input').val());
        $('.rightSide input').val('');
      }
    },
    'keyup .leftSide input'  : function(event){
      if(event.which === 13){
        this.model.addGuess(this.model.get("player2"),$('.leftSide input').val());
        $('.leftSide input').val('');
      }
    }
  },

  render: function(){
    this.$el.children().detach();
    $rightSide = $('<div class="rightSide span4"></div>').append(
      $('<div></div>').text(this.model.get('player1')),
      $('<input class="guess" placeholder="guess word"/>'),
      $('<div></div>').text(this.model.get('word1')),
      new GuessesView({collection: this.model.get('word1Guesses')}).render()
      );
    $leftSide = $('<div class="leftSide span4"></div>').append(
      $('<div></div>').text(this.model.get('player2')),
      $('<input class="guess" placeholder="guess word"/>'),
      $('<div></div>').text(this.model.get('word2')),
      new GuessesView({collection: this.model.get('word2Guesses')}).render()
      );
    return this.$el.append([
      $leftSide,
      $rightSide
      ]);
  }
});