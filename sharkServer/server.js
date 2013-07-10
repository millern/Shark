var express = require('express'),
  fs = require('fs'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server, {
   "log level": 0
});

app.use('/lib', express.static(__dirname + '/../lib'));
app.use('/', express.static(__dirname + '/../sharkClient'));

//port 80 requires node to be run in sudo mode
var port = 80;

var sandbox = false;
if (process.argv[2] === "sandbox"){
  sandbox = true;
}

server.listen(port);
console.log("listening on " + port);

var socketHandler = require('./socketHandler')(io,sandbox);
io.sockets.on('connection', socketHandler.handler);
