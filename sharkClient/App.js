var App = Backbone.Model.extend({
  initialize: function(params){
    this.set('playerList', new Players([]));
    this.set('message', ''); //Message that displays below the game
    var self = this;

    this.on('change:player', function(){
      socket.emit('connect', this.get('player'));
    },this);

    socket.on('newGameClicked', function(){
      self.trigger('newGameClicked');
    });

    socket.on('playerList', function(data){
      self.set('playerList', new Players(self.toArray(data)));
      self.get('playerList').on('challenge', function(player){
        if (socket.socket.sessionid === player.id){
          alert('you challenged yourself');
        } else {
          this.trigger('challengeSent');
          this.set('message', 'Challenge sent to ' + player.name);
          socket.emit('sendChallenge',player);
        }
      },self);
      self.trigger('newPlayers');
    });

    socket.on('updateClient',function(data){
      data.localPlayer = self.get('player');
      self.set('message','');
      self.set('currGame', new Game(data));
      // Set a message when opponent disconnects
      if (self.get('currGame').get('isTerminated')){
        self.set('message','Opponent disconnected.  Select an opponent or choose random.');
      }
      self.trigger("update");
    });

    socket.on('challengeReceived', function(player){
      if (confirm('You have received a challenge from ' + player.name + ".  Do you accept?")) {
        socket.emit('challengeAccepted', player);
      } else {
        socket.emit('challengeRejected', player);
      }
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
