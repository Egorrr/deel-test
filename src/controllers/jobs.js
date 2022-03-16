const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const jobsService = require('../services/jobs');
const validate = require('../utils/validation');
const profileTypes = require('../enums/profileTypes');
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
 * Assumptions:
 *      1. Only client type Profile can pay for job.
 *      2. Client can only pay for the jobs that he own
 * @returns {undefined}
 */
router.post('/:jobId/pay', validate(validations.pay), asyncMiddleware(async (req, res) => {
	const { jobId } = req.params;
	const { id: profileId, type } = req.profile;

	if (type !== profileTypes.CLIENT) {
		return res.sendStatus(StatusCodes.UNAUTHORIZED);
	}

	await jobsService.payForJob(jobId, profileId);

	res.sendStatus(StatusCodes.OK);
}));

module.exports = router;
