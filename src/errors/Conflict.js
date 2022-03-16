const ApplicationError = require('./applicationError');
const errorMessages = require('../resources/errorMessages');

class ConflictError extends ApplicationError {
	/**
	 * Creates an instance of ConflictError
	 * @param {String} message Error message
	 */
	constructor(message = errorMessages.CONFLICT) {
		super(message);

		this.name = this.constructor.name;
	}
}

module.exports = ConflictError;
