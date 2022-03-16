const app = require('./app');
const logger = require('../src/utils/logger');

const HTTP_PORT = 3001;

/**
 * Starts API server
 * @returns {undefined}
 */
async function init() {
	try {
		app.listen(HTTP_PORT, () => {
			logger.info(`Express App Listening on Port ${HTTP_PORT}`);
		});
	} catch (error) {
		logger.error(`An error occurred: ${JSON.stringify(error)}`);
		process.exit(1);
	}
}

init();
