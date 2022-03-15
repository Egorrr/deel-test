const { StatusCodes } = require('http-status-codes');
const HttpError = require('../errors/HttpError');
const errorMessages = require('../resources/errorMessages');

const DEFAULT_ERROR_MESSAGE = errorMessages.UNEXPECTED_ERROR;
const DEFAULT_ERROR_STATUS = StatusCodes.INTERNAL_SERVER_ERROR;
const ERRORS_HTTP_STATUS_MAP = Object.freeze({
	ValidationError: StatusCodes.BAD_REQUEST
});

/**
 * Transforms error to the Http error
 * @param {Object} e Error
 * @returns {Object} Mapped Http error
 */
function toHttpError(e) {
	let status = DEFAULT_ERROR_STATUS;
	let message = DEFAULT_ERROR_MESSAGE;

	if (e instanceof HttpError) {
		status = e.status;
		message = e.message;
	} else if (ERRORS_HTTP_STATUS_MAP[e.name]) {
		status = ERRORS_HTTP_STATUS_MAP[e.name];
		message = e.message;
	}

	return new HttpError(status, message);
}

module.exports = { toHttpError };
