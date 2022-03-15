const router = require('express').Router();
const jobsService = require('../services/jobs');
const asyncMiddleware = require('../middleware/async');

/**
 * @returns {Array<Job>} unpaid Jobs for non-terminated Contracts
 * where requesting Profile is either a Client or a Contractor
 */
router.get('/unpaid', asyncMiddleware(async (req, res) => {
	const { id } = req.profile;

	const unpaidJobs = await jobsService.getUnpaidJobs(id);

	res.send(unpaidJobs);
}));

module.exports = router;
