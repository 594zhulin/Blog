const express = require('express');
const path = require('path');

const article = require('./api/article');
const category = require('./api/category');
const comment = require('./api/comment');
const user = require('./api/user');
const index = require('./api/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/article', article);
app.use('/api/category', category);
app.use('/api/comment', comment);
app.use('/api/user', user);
app.use('/api', index);

app.listen(3000);
console.log('success listen at port:3000......');
