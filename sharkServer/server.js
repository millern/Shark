var express = require('express'),
  fs = require('fs'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server, {
   "log level": 0
});

app.use('/lib', express.static(__dirname + '/../lib'));
app.use('/', express.static(__dirname + '/../sharkClient'));
var ip = '10.0.1.25';
var port = 8080;

var sandbox = false;
if (process.argv[2] === "sandbox"){
  sandbox = true;
}

server.listen(port, ip);
console.log('listening on ' + ip + ':' + port);

var socketHandler = require('./socketHandler')(io,sandbox);
io.sockets.on('connection', socketHandler.handler);
