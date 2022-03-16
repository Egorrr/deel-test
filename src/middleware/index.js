const bodyParser = require('body-parser');
const getProfile = require('./getProfile');
const checkAdminAccess = require('./checkAdminAccess');

const bodyParserMiddleware = bodyParser.json();

module.exports = {
	publicMiddleware: [bodyParserMiddleware],
	defaultMiddleware: [bodyParserMiddleware, getProfile],
	protectedMiddleware: [bodyParserMiddleware, checkAdminAccess]
};
