var gameIndex = 0,
    athletes = {},
    sideline = {},
    randomQueue = [],
    ongoingGames = {},
    manager = {},
    io,
    sandbox;

module.exports = function(_io,_sandbox){
  io = _io;
  sandbox = _sandbox;
  return manager;
};

manager.handler = function(socket){

  socket.on('connect', function(player){
    athletes[socket.id] = {name: player.name, socket: socket};
    sideline[socket.id] = {name: player.name, id: socket.id};
    if (sandbox){
        startGameSandBox();
    }
    console.log("logging the sideline", sideline);
    io.sockets.emit('playerList', sideline);
  });

  socket.on('disconnect', function(){
    console.log('sideline');
    console.log('disconnected id: ' + this.id);
    delete athletes[socket.id];
    delete sideline[socket.id];
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
    console.log(sideline);
    io.sockets.emit('playerList',sideline);
  });

  socket.on('gameTerminated', function(game){
    ongoingGames[game.id].isTerminated = true;
    if (socket.id === game.player1.id){
      athletes[game.player2.id].socket.emit('updateClient', ongoingGames[game.id]);
    }  else {
      athletes[game.player1.id].socket.emit('updateClient', ongoingGames[game.id]);
    }
    delete ongoingGames[game.id];
  });

  socket.on('randomOpponent',function(player) {
    console.log("adding to random queue");
    randomQueue.push(player);
    console.log('random queue', randomQueue);
    if (randomQueue.length > 1){
      startRandomGame();
    }
  });

  socket.on('sendChallenge', function(player){
    var p1 = this.id;
    var p2 = player.id;
    delete sideline[p1];
    delete sideline[p2];
    athletes[p2].socket.emit('challengeReceived', {name: athletes[p1].name, id: p1});
  });

  socket.on('challengeAccepted', function(player){
    startChallengeGame(player, {id: this.id, name: athletes[this.id].name});
    console.log('challenge accepted by player');
  });

  socket.on('challengeRejected', function(player){
    sideline[this.id] = {name: athletes[this.id], id: this.id};
    sideline[player.id] = player;
    console.log("challenge rejected by player");
  });

  socket.on('update', function(data){
    //need to delete games from ongoing games once someone has won, is safe becasue we emit data
    //need to figure out how we want to handle rematches with this
    if (data.winner){
      delete ongoingGames[data.id];
    } else {
     ongoingGames[data.id] = data;
    }
    athletes[data.player1.id].socket.emit('updateClient',data);
    athletes[data.player2.id].socket.emit('updateClient',data);
  });

  socket.on('newGame',function(player){
    console.log("game data on new game", player);
    if (this === athletes[player.id].socket){ //what is this really checking for?
      sideline[this.id] = {name: player.name, id: player.id};
      this.emit('newGameClicked');
    } else {
      throw new Error("Bad socket id");
    }
  });
};

var startRandomGame = function(){
  var a1 = randomQueue.pop();
  var a2 = randomQueue.pop();
  delete sideline[a1.id];
  delete sideline[a2.id];
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

