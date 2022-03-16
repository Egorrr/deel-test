const express = require('express');
const responseTime = require('response-time')
const controllers = require('./controllers');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(responseTime());
app.use('/api', controllers);
app.use(errorHandler());

module.exports = app;
