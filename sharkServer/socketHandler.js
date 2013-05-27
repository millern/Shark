var fs = require('fs');
var gameIndex = 0;
var athletes = {};
var sideline = [];
var pitch = [];
var ongoingGames = {};
var manager = {};
var io;
module.exports = function(_io){
io = _io;
return manager;
};

manager.handler = function(socket){

socket.on('name', function(name){
  athletes[name] = {name: name, socket: socket};
  sideline.push(name);
  console.log(sideline);
  if (sideline.length >= 2){
    startGame();
  }
  console.log(ongoingGames);
});
//handle syncing backbone models
  socket.on('update', function(data){
    ongoingGames[data.id] = data;
    io.sockets.emit('updateClient',data);
  });
};

var startGame = function(){
  var a1 = sideline.pop();
  var a2 = sideline.pop();
  ongoingGames[gameIndex] = {id: gameIndex, player1:a1, player2:a2};
  pitch.push(a1);
  pitch.push(a2);
  athletes[a1].socket.emit('updateClient', ongoingGames[gameIndex]);
  athletes[a2].socket.emit('updateClient', ongoingGames[gameIndex]);
  gameIndex++;
};