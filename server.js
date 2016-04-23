var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert'); // module used for writing unit tests for applications
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/quotes';
var bcrypt = require('bcryptjs');
const saltRounds = 10;

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

//==================GET==================
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
//==================INSERT==================
app.post('/insert', function(req, res) {
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
//==================CREATE USER==================
app.post('/users', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      var newUser = {
        username: req.body.username,
        password: hash
      };

      db.collection('users').insertOne(newUser, function(err, result) {
        assert.equal(null, err);
        console.log('User created.');
        db.close();
      });
    });
  });
  res.send();
});
//==================UPDATE==================
app.put('/update', function(req, res) {
  var item =  {
    text: req.body.updatedQuote
  };
  var id = req.body.id;

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('quotes').updateOne({"_id": ObjectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Quote updated.');
      db.close();
    });
  });
  res.send();
});
//==================DELETE==================
app.put('/delete', function(req, res) {
  var id = req.body.id;

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('quotes').deleteOne({"_id": ObjectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Quote deleted.');
      db.close();
    });
  });
  res.send();
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});