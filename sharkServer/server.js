var express = require('../lib/node_modules/express'),
  fs = require('fs'),
  app = express(),
  server = require('http').createServer(app),
  io = require('../lib/node_modules/socket.io').listen(server, {
   "log level": 0
});

app.use('/lib', express.static(__dirname + '/../lib'));
app.use('/', express.static(__dirname + '/../sharkClient'));
var ip = '10.0.1.23';
var port = 8080;

process.argv.forEach(function(val,index,array){
  console.log(index + ": " + val);
});

server.listen(port, ip);
console.log('listening on ' + ip + ':' + port);

var socketHandler = require('./socketHandler')(io);
io.sockets.on('connection', socketHandler.handler);
