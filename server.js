var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert'); // module used for writing unit tests for applications
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/quotes';
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
const JWT_SECRET = 'catsmeow';
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

//==================LOAD QUOTES==================
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
//==================INSERT QUOTE==================
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
//==================UPDATE QUOTE==================
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
//==================DELETE QUOTE==================
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
//==================LOGIN==================
app.put('/users/login', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('users');
    cursor.findOne({username: req.body.username}, function(err, user) {
      assert.equal(null, err);
      if(!user) {
        console.log('The user doesn\'t exist.');
        res.status(400).send();
      }
      else {
        console.log('Found user in database.');
        bcrypt.compare(req.body.password, user.password, function(err, result) {
          if(!result) {
            console.log('Incorrect password.');
            res.status(400).send();
          }
          else {
            var token = jwt.encode(user, JWT_SECRET);
            console.log('Correct password.');
            res.send({token: token});
          }
        });
      }
      db.close();
    });
  });
});

app.listen(3000, function() {
  console.log('Listening on port 3000.');
});