const { Op, fn, col, literal } = require('sequelize');
const { Job, Contract, Profile } = require('../models');
const { isValidDateRange } = require('../utils/contracts');

/**
 * Gets professions that earned most in the provided date range
 * @param {Date} startDate Start date
 * @param {Date} endDate End date
 * @param {Number} limit Number of professions taken
 * @return {Promise<Object[]>} Best paid professions Promise
 * @throws {ArgumentError} if the startDate or endDate are invalid
 */
async function getBestProfessionsInDateRange(startDate, endDate, limit = 1) {
	isValidDateRange(startDate, endDate);

	return Contract.findAll({
		attributes: ['Contractor.profession', [fn('sum', col('Jobs.price')), 'amountReceived']],
		group: ['Contractor.profession'],
		include: [{
			model: Job,
			required: true,
			attributes: [],
			where: {
				paymentDate: {
					[Op.between]: [startDate, endDate]
				}
			}
		}, {
			model: Profile,
			as: 'Contractor',
			required: true,
			attributes: []
		}],
		order: [[col('amountReceived'), 'DESC']],
		subQuery: false,
		raw: true,
		limit
	});
}

/**
 * Gets clients that paid the most for Jobs in provided date range
 * @param {Date} startDate Start date
 * @param {Date} endDate End date
 * @param {Number} limit Number of Clients taken
 * @return {Promise<Object[]>} Best paying clients Profiles
 * @throws {ArgumentError} if the startDate or endDate are invalid
 */
async function getBestPayingClientsInDateRange(startDate, endDate, limit = 2) {
	isValidDateRange(startDate, endDate);

	return Contract.findAll({
		attributes: [
			'Client.id',
			[literal('Client.firstName || " " || Client.lastName'), 'fullName'],
			[fn('sum', col('Jobs.price')), 'paid']
		],
		group: ['Client.id'],
		include: [{
			model: Job,
			required: true,
			attributes: [],
			where: {
				paymentDate: {
					[Op.between]: [startDate, endDate]
				}
			}
		}, {
			model: Profile,
			as: 'Client',
			required: true,
			attributes: []
		}],
		order: [[col('paid'), 'DESC'], 'id'],
		subQuery: false,
		raw: true,
		limit
	});
}

module.exports = {
	getBestProfessionsInDateRange,
	getBestPayingClientsInDateRange
};
