const { StatusCodes } = require('http-status-codes');
const HttpError = require('./HttpError');
const errorMessages = require('../resources/errorMessages');

module.exports = {
	notFound: new HttpError(StatusCodes.NOT_FOUND, errorMessages.NOT_FOUND),
	badRequest: new HttpError(StatusCodes.BAD_REQUEST, errorMessages.BAD_REQUEST),
	unauthorized: new HttpError(StatusCodes.UNAUTHORIZED, errorMessages.UNAUTHORIZED)
};
