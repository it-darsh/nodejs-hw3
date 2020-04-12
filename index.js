'use strict';

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/index'));

app.listen(3000, () => {
  console.log('work on port 3000');
});
