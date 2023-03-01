console.log('May the server be with you.');
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const app = express();

const connectionString = process.env.MDB_KEY;
MongoClient.connect(connectionString, { useUnifiedTopology: true }).then(
  (client) => {
    console.log('Connected to Database');
    const db = client.db('star-wars-quotes');

    // Creating a collection named quotes
    const quotesCollections = db.collection('quotes');
    app.use(express.static('public'));

    // Tells express we're jusing ejs as template engine
    app.set('view enginer', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));

    // Middleware that allows server to read JSON
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
      // res.sendFile(__dirname + '/index.html');
      db.collection('quotes')
        .find()
        .toArray()
        .then((results) => {
          //          (name of file rendering, data passed to file)
          res.render('index.ejs', { quotes: results });
        })
        .catch((err) => console.error(err));
    });

    app.post('/quotes', (req, res) => {
      quotesCollections
        .insertOne(req.body)
        .then((result) => {
          res.redirect('/');
        })
        .catch((err) => console.error(err));
    });

    app.put('/quotes', (req, res) => {
      // findOneAndUpdate -- method to find and change one item in the db
      // query, - query - yoda
      // update, - [$set], $inc, $push - changes yodas "" to dvs ""
      // options - upsert - insert a doc
      quotesCollections
        .findOneAndUpdate(
          { name: 'Yoda' },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          res.json('success');
        })
        .catch((error) => console.error(error));
    });

    app.delete('/quotes', (req, res) => {
      quotesCollections
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete');
          }
          res.json(`Deleted Darth Vader's quote`);
        })
        .catch(err => console.error(err));
    });

    app.listen(8000, () => {
      console.log('Listening on 8000');
    });
  }
);
