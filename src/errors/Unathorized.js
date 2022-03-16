const ApplicationError = require('./applicationError');
const errorMessages = require('../resources/errorMessages');

class UnauthorizedError extends ApplicationError {
	/**
	 * Creates an instance of UnauthorizedError
	 * @param {String} message Error message
	 */
	constructor(message = errorMessages.NOT_FOUND) {
		super(message);

		this.name = this.constructor.name;
	}
}

module.exports = UnauthorizedError;
