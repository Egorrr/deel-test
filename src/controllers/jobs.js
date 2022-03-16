const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const jobsService = require('../services/jobs');
const validate = require('../utils/validation');
const asyncMiddleware = require('../middleware/async');
const validations = require('./validations/contracts');

/**
 * @returns {Array<Job>} unpaid Jobs for non-terminated Contracts
 * where requesting Profile is either a Client or a Contractor
 */
router.get('/unpaid', asyncMiddleware(async (req, res) => {
	const { id } = req.profile;

	const unpaidJobs = await jobsService.getUnpaidJobs(id);

	res.send(unpaidJobs);
}));

/**
 * Performs Job payment processing
 * @returns {undefined}
 */
router.post('/:jobId/pay', validate(validations.pay), asyncMiddleware(async (req, res) => {
	const { jobId } = req.params;
	const { id: profileId } = req.profile;

	await jobsService.payForJob(jobId, profileId);

	res.sendStatus(StatusCodes.OK);
}));

module.exports = router;
