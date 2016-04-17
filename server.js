var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert'); // module used for writing unit tests for applications
var url = 'mongodb://localhost:27017/quotes';

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  //ensure that we've connected
  assert.equal(null, err);
  console.log("Successfully connected to database server.");
  db.close();
});

// parse application/json 
app.use(bodyParser.json());

app.use(express.static('public'));

// app.get('/', function(req, res) {
//   res.send('Hello World!');
// });

app.get('/quotes', function(req, res) {
  var quotesArray = [];
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('quotes').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      quotesArray.push(doc);
    }, function() {
      res.send(quotesArray);
      db.close();
    });
  });
});

app.post('/quotes', function(req, res) {
  var item = {
    text: req.body.newQuote
  };
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('quotes').insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Quote inserted.');
      db.close();
    });
  });
  res.send(); //server will hang if this isn't sent
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});