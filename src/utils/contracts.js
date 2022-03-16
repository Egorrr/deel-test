const ArgumentError = require('../errors/argumentError');
const contractMessages = require('../resources/contractMessages');

/**
 * Checks if the value is not null or undefined
 * @param {*} value The value to check
 * @throws {ArgumentError} If the value is invalid
 * @returns {undefined} If the value is valid
 */
function exists(value) {
	if (value === null || value === undefined) {
		throw new ArgumentError(contractMessages.SHOULD_EXIST);
	}
}

/**
 * Checks if the value is a valid Date
 * @param {*} value The value to check
 * @throws {ArgumentError} If the value is invalid
 * @returns {undefined} If the value is valid
 */
function isDate(value) {
	exists(value);

	if (!(value instanceof Date)) {
		throw new ArgumentError(contractMessages.SHOULD_BE_DATE);
	}
}

/**
 * Checks if the values are a valid Date range
 * @param {*} start Start value
 * @param {*} end End value
 * @throws {ArgumentError} If the values are not a valid Date range
 * @returns {undefined} If the values are valid
 */
function isValidDateRange(start, end) {
	isDate(start);
	isDate(end);

	if (start >= end) {
		throw new ArgumentError(contractMessages.SHOULD_BE_DATE_RANGE);
	}
}

module.exports = {
	exists,
	isDate,
	isValidDateRange
};