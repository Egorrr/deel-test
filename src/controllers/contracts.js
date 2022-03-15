const router = require('express').Router();
const { validate } = require('express-validation');
const { StatusCodes } = require('http-status-codes');
const asyncMiddleware = require('../middleware/async');
const validations = require('./validations/contracts');
const contractsService = require('../services/contracts');

/**
 * @returns {Array<Contract>} active Contracts where requesting Profile is either a Client or a Contractor
 */
router.get('/', asyncMiddleware(async (req, res) => {
	const { id } = req.profile;
	const profileContracts = await contractsService.getAllActiveProfileContracts(id);

	res.send(profileContracts);
}));

/**
 * @returns {Contract} Contract by id if requesting Profile is either a Client or a Contractor
 */
router.get('/:id', validate(validations.getById), asyncMiddleware(async (req, res) => {
	const { id } = req.params;
	const { id: profileId } = req.profile;
	const contract = await contractsService.getProfileContractById(id, profileId);

	if (!contract) {
		return res.sendStatus(StatusCodes.NOT_FOUND);
	}

	res.send(contract);
}));

module.exports = router;
