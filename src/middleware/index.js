const bodyParser = require('body-parser');
const getProfile = require('./getProfile');

const bodyParserMiddleware = bodyParser.json();

module.exports = {
	publicMiddleware: [bodyParserMiddleware],
	defaultMiddleware: [bodyParserMiddleware, getProfile]
};
