const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const validate = require('../utils/validation');
const asyncMiddleware = require('../middleware/async');
const validations = require('./validations/balances');
const balancesService = require('../services/balances');
const profileTypes = require('../enums/profileTypes');

/**
 * Deposits money into the balance of a client, a client can't deposit more than 25% his total of jobs to pay
 *
 * ASSUMPTIONS:
 *      1. Only client type Profile can deposit money
 *      2. Client can only deposit on his account
 *
 *  NOTE: A weird requirement regarding 25%, can't think of a business meaning of it,
 *  as per discussion it should be implemented the way it's described in README
 *
 * @returns {undefined}
 */
router.post('/deposit/:userId', validate(validations.deposit), asyncMiddleware(async (req, res) => {
	const { amount } = req.body;
	const { userId } = req.params;
	const { id: profileId, type } = req.profile;

	if (userId !== profileId || type !== profileTypes.CLIENT) {
		return res.sendStatus(StatusCodes.UNAUTHORIZED);
	}

	const result = await balancesService.depositMoney(userId, amount);

	return res.send(result);
}));

module.exports = router;
