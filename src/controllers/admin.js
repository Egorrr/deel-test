const router = require('express').Router();
const validate = require('../utils/validation');
const validations = require('./validations/admin');
const httpsErrors = require('../errors/httpErrors');
const asyncMiddleware = require('../middleware/async');
const statisticsService = require('../services/statistics');

/**
 * NOTE:
 *      1. Counts partially paid jobs and terminated Contracts along with paid ones as per discussion
 *      2. If two top professions got equal amountReceived they both should be returned
 *
 * @returns {Object|Object[]} profession or professions that earned the most money
 * for any contactor that worked in the provided date range
 */
router.get('/best-profession', validate(validations.getBestProfession), asyncMiddleware(async (req, res) => {
	const { start, end } = req.query;

	if (start >= end) {
		throw httpsErrors.badRequest;
	}

	const result = await statisticsService.getBestProfessionsInDateRange(start, end, 2);
	const [firstProfession, secondProfession] = result;

	if (firstProfession.amountReceived === secondProfession.amountReceived) {
		return res.send(result);
	}

	return res.send(firstProfession);
}));

/**
 * NOTE: Counts partially paid jobs and terminated Contracts along with paid ones as per discussion
 *
 * @returns {Object[]} clients the paid the most for Jobs in the provided date range
 */
router.get('/best-clients', validate(validations.getBestPayingClients), asyncMiddleware(async (req, res) => {
	const { start, end, limit } = req.query;

	if (start >= end) {
		throw httpsErrors.badRequest;
	}

	const bestPayingClients = await statisticsService.getBestPayingClientsInDateRange(start, end, limit);

	return res.send(bestPayingClients);
}));

module.exports = router;
