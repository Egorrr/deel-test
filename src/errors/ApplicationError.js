const errorMessages = require('../resources/errorMessages');

class ApplicationError extends Error {
	/**
	 * Creates an instance of ApplicationError
	 * @param {String} message Error message
	 */
	constructor(message = errorMessages.UNEXPECTED_ERROR) {
		super();

		this.message = message;

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = ApplicationError;
