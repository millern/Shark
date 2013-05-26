var express = require('../lib/node_modules/express');
var fs = require('fs');
var app = express();
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
      console.log(JSON.parse(data));
      res.setHeader('Content-Type','application/json');
      res.end(data);
    }
  });

});
app.put('/games',function(req, res){
  var body = "";
  req.on('data',function(data){
    body += data;
  });
  req.on('end',function(){
    fs.writeFile(__dirname + '/data.txt', body, function(err){
      if (err){
        console.log(err);
        res.statusCode = 400;
        res.setHeader('Content-Type','text/plain');
        res.end("Error");
      } else {
        res.setHeader('Content-Type','text/plain');
        res.end("success");
      }
    });
  });
});
app.listen(8080, '10.0.1.23');
console.log('listening on 10.0.1.23:8080');