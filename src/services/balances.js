const { Op } = require('sequelize');
const jobsService = require('./jobs');
const { exists, isPositiveNumber } = require('../utils/contracts');
const ConflictError = require('../errors/Conflict');
const { Contract, Profile, sequelize } = require('../models/model');

const DEPOSIT_MONEY_MULTIPLIER = 0.25;

/**
 * Deposits money into the balance of a client, a client can't deposit more than 25% his total of jobs to pay
 * A weird requirement, can't think of a business meaning of it, was told that it should be implemented anyway
 * @param {Number} profileId Profile id
 * @param {Number} amount deposit amount
 * @return {Promise<Object>} Deposit result Promise
 * @throws <ArgumentError> if the profileId or amount are invalid
 */
async function depositMoney(profileId, amount) {
	exists(profileId);
	isPositiveNumber(amount);

	let transaction = await sequelize.transaction();

	try {
		const currentDebt = await jobsService.getUnpaidJobsTotalAmount(profileId, transaction);
		const maxDepositAmount = currentDebt * DEPOSIT_MONEY_MULTIPLIER;

		if (amount > maxDepositAmount) {
			throw new ConflictError('Amount should not exceed 25% of profile debt');
		}

		const profile = await Profile.findByPk(profileId, { transaction });

		profile.balance += amount;
		await profile.save({ transaction });
		await transaction.commit();

		return { id: profile.id, balance: profile.balance };
	} catch (err) {
		await transaction.rollback();
		throw err;
	}
}

module.exports = {
	depositMoney
};
