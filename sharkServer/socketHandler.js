var gameIndex = 0,
    athletes = {},
    sideline = [],
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

socket.on('name', function(name){
  athletes[name] = {name: name, socket: socket};
  sideline.push(name);
  console.log(sideline);
  if (sandbox){
      startGameSandBox();
  } else if (sideline.length >= 2){
    startGame();
  }
  console.log(ongoingGames);
});
//handle syncing backbone models
  socket.on('update', function(data){
    //rule check
    ongoingGames[data.id] = data;
    athletes[data.player1].socket.emit('updateClient',data);
    athletes[data.player2].socket.emit('updateClient',data);
  });
  socket.on('newGame',function(data){
    if (this === athletes[data.player1].socket){
      sideline.push(data.player1);
    } else {
      sideline.push(data.player2);
    }
    if (sideline.length >= 2){
      startGame();
    }
  });
};

var startGame = function(){
  var a1 = sideline.pop();
  var a2 = sideline.pop();
  ongoingGames[gameIndex] = {id: gameIndex, player1:a1, player2:a2};
  athletes[a1].socket.emit('updateClient', ongoingGames[gameIndex]);
  athletes[a2].socket.emit('updateClient', ongoingGames[gameIndex]);
  gameIndex++;
};

var sandboxGame = JSON.parse('{"id":1,"player1":"tucker","player2":"nick","localPlayer":"tucker","word1Guesses":[{"guess":"barn","word":"lint","score":1},{"guess":"book","word":"lint","score":0},{"guess":"reed","word":"lint","score":0},{"guess":"repo","word":"lint","score":0}],"word2Guesses":[{"guess":"mint","word":"lynx","score":1},{"guess":"tome","word":"lynx","score":0},{"guess":"lyre","word":"lynx","score":2},{"guess":"baby","word":"lynx","score":1}],"guessing":"tucker","winner":null,"word2":"lynx","word1":"lint"}');

var startGameSandBox = function(){
  io.sockets.emit('updateClient', sandboxGame);
};

