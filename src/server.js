const app = require('./app');

init();

const HTTP_PORT = 3001;

async function init() {
	try {
		app.listen(HTTP_PORT, () => {
			console.log(`Express App Listening on Port ${HTTP_PORT}`);
		});
	} catch (error) {
		console.error(`An error occurred: ${JSON.stringify(error)}`);
		process.exit(1);
	}
}
