var express = require('../lib/node_modules/express'),
  fs = require('fs'),
  app = express(),
  server = require('http').createServer(app),
  io = require('../lib/node_modules/socket.io').listen(server, {
   "log level": 0
});

app.use('/lib', express.static(__dirname + '/../lib'));
app.use('/', express.static(__dirname + '/../sharkClient'));
var ip = '10.0.1.82';
var port = 8080;

server.listen(port, ip);
console.log('listening on 192.168.1.4:8080');

var socketHandler = require('./socketHandler')(io);
io.sockets.on('connection', socketHandler.handler);
