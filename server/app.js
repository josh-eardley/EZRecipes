const express = require('express');
const path = require('path');
const client = require('./db/client');
require("dotenv").config();
client.connect();
const app = express();
const morgan = require('morgan');
// const cors = require('cors')


// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client', 'dist')));

app.use('/api', require('./api'));

app.use((req, res, next) => {
  try {
    res.status(404).send("Sorry, can't find that! :/");
  } catch (error) {
    console.error(error);
    throw error;
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
});

module.exports = { app };