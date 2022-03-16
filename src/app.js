const express = require('express');
const controllers = require('./controllers');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use('/api', controllers);
app.use(errorHandler());

module.exports = app;
