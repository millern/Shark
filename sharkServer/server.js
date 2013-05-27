var express = require('../lib/node_modules/express'),
  fs = require('fs'),
  app = express(),
  server = require('http').createServer(app),
  io = require('../lib/node_modules/socket.io').listen(server, {
   "log level": 0
});

app.use('/lib', express.static(__dirname + '/../lib'));
app.use('/', express.static(__dirname + '/../sharkClient'));

server.listen(8080, '10.0.1.23');
console.log('listening on 10.0.1.23:8080');

var socketHandler = require('./socketHandler')(io);
io.sockets.on('connection', socketHandler.handler);
