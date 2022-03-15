const express = require('express');
const controllers = require('./controllers');
const { sequelize } = require('./models/model');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use('/api', controllers);
app.use(errorHandler());

module.exports = app;
