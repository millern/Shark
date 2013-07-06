var gameIndex = 0,
    athletes = {},
    sideline = {},
    randomQueue = [],
    ongoingGames = {},
    manager = {},
    io,
    sandbox,
    events = require('events'),
    util = require('util');

  var Sideline = function() {
    events.EventEmitter.call(this);
    this.storage = {};
  };

  util.inherits(Sideline, events.EventEmitter);

  Sideline.prototype.add = function(player){
    this.storage[player.id] = player;
    this.emit('change',this.storage);
  };

  Sideline.prototype.remove = function(id){
    delete this.storage[id];
    this.emit('change', this.storage);
  };

  var sl = new Sideline();

  sl.on('change', function(sideline){
    console.log("Emitting the Sideline ------");
    console.log(sl);
    io.sockets.emit('playerList', sideline);
  });

  var Player = function(name, id) {
    this.name = name;
    this.id = id;
  };

  module.exports = function(_io,_sandbox){
    io = _io;
    sandbox = _sandbox;
    return manager;
  };


manager.handler = function(socket){

  socket.on('connect', function(player){
    athletes[socket.id] = {name: player.name, socket: socket};
    if (sandbox){
      // Initialized a predefined game for styling
        startGameSandBox();
    }
    sl.add(new Player(player.name, socket.id));
  });

  socket.on('disconnect', function(){
    console.log('sideline');
    console.log('disconnected id: ' + this.id);
    delete athletes[socket.id];
    sl.remove(socket.id);
    removeFromRandomQueue(this.id);
    for (var game in ongoingGames){
      if (ongoingGames[game].player1.id === socket.id){
        ongoingGames[game].isTerminated = true;
        athletes[ongoingGames[game].player2.id].socket.emit('updateClient', ongoingGames[game]);
        delete ongoingGames[game];
      } else if(ongoingGames[game].player2.id === socket.id){
        ongoingGames[game].isTerminated = true;
        athletes[ongoingGames[game].player1.id].socket.emit('updateClient', ongoingGames[game]);
        delete ongoingGames[game];
      }
    }
  });

  socket.on('gameTerminated', function(game){

    var player1 = game.player1;
    var player2 = game.player2;

    sl.add(new Player(player1.name, player1.id));
    sl.add(new Player(player2.name, player2.id));

    ongoingGames[game.id].isTerminated = true;

    if (socket.id === player1.id){
      athletes[player2.id].socket.emit('updateClient', ongoingGames[game.id]);
    }  else {
      athletes[player1.id].socket.emit('updateClient', ongoingGames[game.id]);
    }
    delete ongoingGames[game.id];

  });

  socket.on('randomOpponent',function(player) {
    console.log("adding to random queue");
    if(!randomQueueContains(player.id)){
      randomQueue.push(player);
      console.log('Random Game Queue ----------', randomQueue);
      if (randomQueue.length > 1){
        startRandomGame();
      }
    } else {
      console.warn('Player prevented from entering random queue twice');
    }
  });

  socket.on('sendChallenge', function(player){
    var p1 = this.id;
    var p2 = player.id;
    sl.remove(p1);
    sl.remove(p2);
    athletes[p2].socket.emit('challengeReceived', {name: athletes[p1].name, id: p1});
  });

  socket.on('challengeAccepted', function(player){
    startChallengeGame(player, {id: this.id, name: athletes[this.id].name});
    console.log('challenge accepted by player');
  });

  socket.on('challengeRejected', function(player){
    sl.add(athletes[this.id], this.id);
    sl.add(player.name, player.id);
    // sideline[this.id] = {name: athletes[this.id], id: this.id};
    // sideline[player.id] = player;
    console.log("challenge rejected by player");
  });

  socket.on('returnToLobby', function(player){
      sl.add(new Player(player.name, player.id));
  });

  socket.on('update', function(game){
    //need to delete games from ongoing games once someone has won, is safe becasue we emit game
    //need to figure out how we want to handle rematches with this
    if (game.winner){
      delete ongoingGames[game.id];
    } else {
     ongoingGames[game.id] = game;
    }
    athletes[game.player1.id].socket.emit('updateClient',game);
    athletes[game.player2.id].socket.emit('updateClient',game);
  });

  socket.on('newGame',function(player){
    console.log("game data on new game", player);
    if (this === athletes[player.id].socket){ // What is this really checking for?
      sl.add(player.name, player.id);
      this.emit('newGameClicked');
    } else {
      throw new Error("Bad socket id");
    }
  });
};

var startRandomGame = function(){
  var a1 = randomQueue.pop();
  var a2 = randomQueue.pop();
  sl.remove(a1.id);
  sl.remove(a2.id);
  ongoingGames[gameIndex] = {id: gameIndex, player1:a1, player2:a2};
  athletes[a1.id].socket.emit('updateClient', ongoingGames[gameIndex]);
  athletes[a2.id].socket.emit('updateClient', ongoingGames[gameIndex]);
  gameIndex++;
};

var startChallengeGame = function(player1, player2){
  ongoingGames[gameIndex] = {id: gameIndex, player1: player1, player2: player2};
  athletes[player1.id].socket.emit('updateClient', ongoingGames[gameIndex]);
  athletes[player2.id].socket.emit('updateClient', ongoingGames[gameIndex]);
  gameIndex++;
};

var startGameSandBox = function(){
  var sandboxGame = JSON.parse('{"id":1,"player1":"tucker","player2":"nick","localPlayer":"tucker","word1Guesses":[{"guess":"barn","word":"lint","score":1},{"guess":"book","word":"lint","score":0},{"guess":"reed","word":"lint","score":0},{"guess":"repo","word":"lint","score":0}],"word2Guesses":[{"guess":"mint","word":"lynx","score":1},{"guess":"tome","word":"lynx","score":0},{"guess":"lyre","word":"lynx","score":2},{"guess":"baby","word":"lynx","score":1}],"guessing":"tucker","winner":null,"word2":"lynx","word1":"lint"}');
  io.sockets.emit('updateClient', sandboxGame);
};
var removeFromRandomQueue = function(id){
  for (var i = 0; i < randomQueue.length; i++){
    if (randomQueue[i].id === id){
      randomQueue.splice(i,1);
    }
  }
};
var randomQueueContains = function(id){
  return randomQueue.some(function(item){
    return id === item.id;
  });
};

