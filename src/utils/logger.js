const { format, transports, createLogger } = require('winston');

module.exports = createLogger({
	format: format.simple(),
	transports: [
		new transports.Console(),
		//Add custom logging here
	]
});
