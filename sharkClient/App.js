var App = Backbone.Model.extend({
  initialize: function(params){
    this.set('player', params.name);
    var games = new Games();
    var self = this;
    games.fetch({success: function(){
      self.set('games', games);
      self.set('currGame',games.last());
      self.trigger("ready");
    }, error: function(){
      self.set('games', games);
      self.newGame('tucker');
      self.trigger('ready');
    }});
  },
  newGame: function(player2){
    console.log('starting new game');
    var game = new Game({player1: this.get('player'),player2:player2});
    this.get('games').add(game);
    this.set('currGame',game);
    this.get('currGame').on('gameOver',function(){
      this.trigger('gameOver');
    },this);
    this.get('games').sync('update', this.get('games'));
  }
});