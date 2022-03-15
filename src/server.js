const { http } = require('config');
const app = require('./app');

init();

async function init() {
	try {
		app.listen(http.port, () => {
			console.log(`Express App Listening on Port ${http.port}`);
		});
	} catch (error) {
		console.error(`An error occurred: ${JSON.stringify(error)}`);
		process.exit(1);
	}
}
