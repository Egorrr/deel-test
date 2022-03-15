const { StatusCodes } = require('http-status-codes');
const ApplicationError = require('./ApplicationError');
const errorMessages = require('../resources/errorMessages');

class HttpError extends ApplicationError {
	/**
	 * Creates an instance of HttpError
	 * @param {Number} status Http error status code
	 * @param {String} message Error message
	 */
	constructor(status = StatusCodes.INTERNAL_SERVER_ERROR, message = errorMessages.UNEXPECTED_ERROR) {
		super(message);

		this.status = status;
		this.name = this.constructor.name;
	}
}

module.exports = HttpError;
