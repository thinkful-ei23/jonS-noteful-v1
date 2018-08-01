'use strict';

const express = require('express');
const morgan = require('morgan');
const itemsRouter = require('./router/notes.router');
const app = express();

app.use(morgan('dev'));

// INSERT EXPRESS APP CODE HERE...
app.use(express.static('public'));

// mount the router with app.use(...)
app.use(itemsRouter);

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});