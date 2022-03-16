const { assert } = require('chai');
const contracts = require('../../src/utils/contracts');
const ArgumentError = require('../../src/errors/argumentError');

describe('contracts.js', () => {
	describe('isNumber', () => {
		it('returns undefined, when a positive number is passed', () => {
			const validValue = 4;
			const actualResult = contracts.isNumber(validValue);

			assert.isUndefined(actualResult);
		});

		it('returns undefined, when a negative number is passed', () => {
			const validValue = -14;
			const actualResult = contracts.isNumber(validValue);

			assert.isUndefined(actualResult);
		});

		it('returns undefined, when zero is passed', () => {
			const validValue = 0;
			const actualResult = contracts.isNumber(validValue);

			assert.isUndefined(actualResult);
		});

		it('throws an Error, when a number as a string is passed', () => {
			const invalidValue = '5';

			assert.throws(() => contracts.isNumber(invalidValue), ArgumentError);
		});

		it('throws an Error, when a null is passed', () => {
			const invalidValue = null;

			assert.throws(() => contracts.isNumber(invalidValue), ArgumentError);
		});

		it('throws an Error, when an undefined is passed', () => {
			const invalidValue = undefined;

			assert.throws(() => contracts.isNumber(invalidValue), ArgumentError);
		});

		it('throws an Error, when an object is passed', () => {
			const invalidValue = {};

			assert.throws(() => contracts.isNumber(invalidValue), ArgumentError);
		});
	});

	describe('isPositiveNumber', () => {
		it('returns undefined, when a positive number is passed', () => {
			const validValue = 4;
			const actualResult = contracts.isNumber(validValue);

			assert.isUndefined(actualResult);
		});

		it('throws an Error, when a negative number is passed', () => {
			const invalidValue = -14;

			assert.throws(() => contracts.isPositiveNumber(invalidValue), ArgumentError);
		});

		it('throws an Error, when zero is passed', () => {
			const invalidValue = 0;

			assert.throws(() => contracts.isPositiveNumber(invalidValue), ArgumentError);
		});

		it('throws an Error, when a number as a string is passed', () => {
			const invalidValue = '5';

			assert.throws(() => contracts.isPositiveNumber(invalidValue), ArgumentError);
		});

		it('throws an Error, when a null is passed', () => {
			const invalidValue = null;

			assert.throws(() => contracts.isPositiveNumber(invalidValue), ArgumentError);
		});

		it('throws an Error, when an undefined is passed', () => {
			const invalidValue = undefined;

			assert.throws(() => contracts.isPositiveNumber(invalidValue), ArgumentError);
		});

		it('throws an Error, when an object is passed', () => {
			const invalidValue = {};

			assert.throws(() => contracts.isPositiveNumber(invalidValue), ArgumentError);
		});
	});

	describe('isDate', () => {
		it('returns undefined, when a valid Date is passed', () => {
			const validValue = new Date();
			const actualResult = contracts.isDate(validValue);

			assert.isUndefined(actualResult);
		});

		it('throws an Error, when a number is passed', () => {
			const invalidValue = '5';

			assert.throws(() => contracts.isDate(invalidValue), ArgumentError);
		});

		it('throws an Error, when a null is passed', () => {
			const invalidValue = null;

			assert.throws(() => contracts.isDate(invalidValue), ArgumentError);
		});

		it('throws an Error, when an undefined is passed', () => {
			const invalidValue = undefined;

			assert.throws(() => contracts.isDate(invalidValue), ArgumentError);
		});

		it('throws an Error, when an object is passed', () => {
			const invalidValue = {};

			assert.throws(() => contracts.isDate(invalidValue), ArgumentError);
		});
	});

	describe('isValidDateRange', () => {
		it('returns undefined, when a valid Date range is passed', () => {
			const validStart = new Date();
			const validEnd = new Date();

			validStart.setDate(validStart.getDate() - 7);

			const actualResult = contracts.isValidDateRange(validStart, validEnd);

			assert.isUndefined(actualResult);
		});

		it('throws an Error, when invalid Date range is passed', () => {
			const validStart = new Date();
			const invalidEnd = new Date();

			invalidEnd.setDate(invalidEnd.getDate() - 7);

			assert.throws(() => contracts.isValidDateRange(validStart, invalidEnd), ArgumentError);
		});

		it('throws an Error, when a null is passed', () => {
			const invalidValue = null;

			assert.throws(() => contracts.isValidDateRange(invalidValue, invalidValue), ArgumentError);
		});

		it('throws an Error, when an undefined is passed', () => {
			const invalidValue = undefined;

			assert.throws(() => contracts.isValidDateRange(invalidValue, invalidValue), ArgumentError);
		});

		it('throws an Error, when an object is passed', () => {
			const invalidValue = {};

			assert.throws(() => contracts.isValidDateRange(invalidValue, invalidValue), ArgumentError);
		});
	});

	describe('exists', () => {
		it('returns undefined, when an object with own properties is passed', () => {
			const validValue = { name: 'John Smith' };
			const actualResult = contracts.exists(validValue);

			assert.isUndefined(actualResult);
		});

		it('returns undefined, when a positive number is passed', () => {
			const validValue = 4;
			const actualResult = contracts.exists(validValue);

			assert.isUndefined(actualResult);
		});

		it('returns undefined, when a negative number is passed', () => {
			const validValue = -8;
			const actualResult = contracts.exists(validValue);

			assert.isUndefined(actualResult);
		});

		it('returns undefined, when zero is passed', () => {
			const validValue = 0;
			const actualResult = contracts.exists(validValue);

			assert.isUndefined(actualResult);
		});

		it('returns undefined, when an empty string is passed', () => {
			const validValue = '';
			const actualResult = contracts.exists(validValue);

			assert.isUndefined(actualResult);
		});

		it('throws an Error, when a null is passed', () => {
			const invalidValue = null;

			assert.throws(() => contracts.exists(invalidValue), ArgumentError);
		});

		it('throws an Error, when an undefined is passed', () => {
			const invalidValue = null;

			assert.throws(() => contracts.exists(invalidValue), ArgumentError);
		});
	});
});
