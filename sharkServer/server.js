var express = require('../lib/node_modules/express');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('../lib/node_modules/socket.io').listen(server, {
   "log level": 0
});

app.use('/lib', express.static(__dirname + '/../lib'));
app.use('/', express.static(__dirname + '/../sharkClient'));
app.get('/games',function(req,res){
  fs.readFile(__dirname + '/data.txt', function(err,data){
    if (err){
      res.statusCode = 404;
      res.setHeader('Content-Type','text/plain');
      res.end("Error");
      console.log(err);
    } else{
      res.setHeader('Content-Type','application/json');
      res.end(data);
    }
  });

});

server.listen(8080, '10.0.1.23');

io.sockets.on('connection', function(socket){

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

});
console.log('listening on 10.0.1.23:8080');