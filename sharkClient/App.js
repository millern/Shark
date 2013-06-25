var App = Backbone.Model.extend({
  initialize: function(params){
    this.set('playerList', new Players([]));
    var self = this;
    this.on('change:player', function(){
      socket.emit('connect', this.get('player'));
    },this);
    socket.on('newGameClicked', function(){
      console.log("reached model");
      self.trigger('newGameClicked');
    });
    socket.on('playerList', function(data){
      self.set('playerList', new Players(self.toArray(data)));
      self.trigger('newPlayers');
    });
    socket.on('updateClient',function(data){
      data.localPlayer = self.get('player');
      console.log("update game",data);
      self.set('currGame', new Game(data));
      self.trigger("update");
    });
  },
  toArray: function(object){
    var arr = [];
    for (var key in object){
      arr.push(object[key]);
    }
    console.log(arr);
    return arr;
  }
});
