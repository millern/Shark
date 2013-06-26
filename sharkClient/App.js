var App = Backbone.Model.extend({
  initialize: function(params){
    this.set('playerList', new Players([]));
    var self = this;
    this.on('change:player', function(){
      socket.emit('connect', this.get('player'));
    },this);

    this.get('playerList').on('challengeApp', function(player){
      socket.emit('challengeGame', this.toJSON());
    },this);

    socket.on('newGameClicked', function(){
      self.trigger('newGameClicked');
    });

    socket.on('playerList', function(data){
      self.set('playerList', new Players(self.toArray(data)));
      self.get('playerList').on('challengeApp', function(player){
        if (socket.socket.sessionid === player.id){
          alert('you challenged yourself');
        } else {
          this.trigger('challengeSent');
          socket.emit('sendChallenge',player);
        }
      },self);
      self.trigger('newPlayers');
    });

    socket.on('updateClient',function(data){
      data.localPlayer = self.get('player');
      console.log("update game",data);
      self.set('currGame', new Game(data));
      self.trigger("update");
    });

    socket.on('challengeReceived', function(player){
      if (confirm('You have received a challenge from ' + player.name + ".  Do you accept?")) {
        console.log("game accepted");
        socket.emit('challengeAccepted', player);
      } else {
        console.log("game rejected");
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
