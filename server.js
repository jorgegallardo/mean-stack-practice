var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var quotes = ['The way you do anything, should be the way you do everything.',
              'It wasn\'t me.',
              'Just do it.'];

// parse application/json 
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/quotes', function(req, res) {
  res.send(quotes);
});

app.post('/quotes', function(req, res) {
  quotes.push(req.body.newQuote);
  res.send(); //server will hang if this isn't sent
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});