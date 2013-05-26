var App = Backbone.Model.extend({
  initialize: function(params){
    this.set('player', params.name);
    var self = this;
    socket.emit('fetch');
    socket.on('updateClient',function(data){
      self.set('games',new Games(data) || new Games());
      self.set('currGame',self.get('games') ? self.get('games').last() : self.newGame(prompt('opponent')));
      self.trigger("ready");
    });
  },
  newGame: function(player2){
    console.log('starting new game');
    var game = new Game({player1: this.get('player'),player2:player2});
    this.get('games').add(game);
    this.set('currGame',game);
    this.get('currGame').on('gameOver',function(){
      this.trigger('gameOver');
    },this);
    socket.emit('update',this.get('games'));
  }
});
