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
    var body = JSON.stringify(data);
    fs.writeFile(__dirname + '/data.txt', body, function(err){
      if (err){
        console.log(err);
      } else {
      }
    });
    io.sockets.emit('updateClient',data);
  });

  socket.on('fetch',function(){
    fs.readFile(__dirname + '/data.txt', function(err,data){
      if(err){
        console.log(err);
      } else {
        socket.emit('updateClient',JSON.parse(data));
      }
    });
  });
};

var startGame = function(){
  var a1 = sideline.pop();
  var a2 = sideline.pop();
  ongoingGames[gameIndex] = {id: gameIndex, a1:a1, a2:a2};
  gameIndex++;
  pitch.push(a1);
  pitch.push(a2);
};