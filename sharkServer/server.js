var express = require('../lib/node_modules/express');
var app = express();
app.use('/lib', express.static(__dirname + '/../lib'));
app.use('/', express.static(__dirname + '/../sharkClient'));
app.listen(8080);
console.log('listening on 127.0.0.1:8080');