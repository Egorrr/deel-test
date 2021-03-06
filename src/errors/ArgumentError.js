const ApplicationError = require('./ApplicationError');
const errorMessages = require('../resources/errorMessages');

class ArgumentError extends ApplicationError {
	/**
	 * Creates an instance of ArgumentError
	 * @param {String} message Error message
	 */
	constructor(message = errorMessages.ARGUMENT) {
		super(message);

		this.name = this.constructor.name;
	}
}

module.exports = ArgumentError;
