const router = require('express').Router();
const validate = require('../utils/validation');
const validations = require('./validations/admin');
const httpsErrors = require('../errors/httpErrors');
const asyncMiddleware = require('../middleware/async');
const statisticsService = require('../services/statistics');

/**
 * NOTE: Counts partially paid jobs and terminated Contracts along with paid ones as per discussion
 *
 * @returns {Object} profession that earned the most money for any contactor that worked in the provided date range
 */
router.get('/best-profession', validate(validations.getBestProfession), asyncMiddleware(async (req, res) => {
	const { start, end } = req.query;

	if (start >= end) {
		throw httpsErrors.badRequest;
	}

	const [bestProfession] = await statisticsService.getBestProfessionsInDateRange(start, end, 1);

	res.send(bestProfession);
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

	res.send(bestPayingClients);
}));

module.exports = router;
