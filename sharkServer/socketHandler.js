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
    console.log(sideline);
    io.sockets.emit('playerList',sideline);
  });
  socket.on('randomOpponent',function(player) {
    console.log("adding to random queue");
    randomQueue.push(player);
    console.log('random queue', randomQueue);
    if (randomQueue.length > 1){
      startRandomGame();
    }
  });
  socket.on('challengeGame', function(e){
    //grab challenged players
  });
  //handle syncing backbone models
  socket.on('update', function(data){
    //rule check
    ongoingGames[data.id] = data;
    athletes[data.player1.id].socket.emit('updateClient',data);
    athletes[data.player2.id].socket.emit('updateClient',data);
  });
  socket.on('newGame',function(data){
    console.log("game data on new game", data);
    if (this === athletes[data.localPlayer.id].socket){ //what is this really checking for?
      sideline[this.id] = {name: data.localPlayer.name, id: data.localPlayer.id};
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

var sandboxGame = JSON.parse('{"id":1,"player1":"tucker","player2":"nick","localPlayer":"tucker","word1Guesses":[{"guess":"barn","word":"lint","score":1},{"guess":"book","word":"lint","score":0},{"guess":"reed","word":"lint","score":0},{"guess":"repo","word":"lint","score":0}],"word2Guesses":[{"guess":"mint","word":"lynx","score":1},{"guess":"tome","word":"lynx","score":0},{"guess":"lyre","word":"lynx","score":2},{"guess":"baby","word":"lynx","score":1}],"guessing":"tucker","winner":null,"word2":"lynx","word1":"lint"}');

var startGameSandBox = function(){
  io.sockets.emit('updateClient', sandboxGame);
};

