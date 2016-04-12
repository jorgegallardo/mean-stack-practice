var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/quotes', function(req, res) {
  var quotes = ['The way you do anything, should be the way you do everything.', 'It wasn\'t me.'];
  res.send(quotes);
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});