var App = Backbone.Model.extend({
  initialize: function(params){
    this.set('player', params.name);
    this.set('games', new Games());
  },
  newGame: function(player2){
    var game = new Game({player1: this.get('player'),player2:player2});
    this.get('games').add(game);
    this.set('currGame',game);
  }
});