const { Op } = require('sequelize');
const { exists } = require('../utils/contracts');
const NotFoundError = require('../errors/NotFound');
const ConflictError = require('../errors/Conflict');
const UnauthorizedError = require('../errors/Unathorized');
const contractStatuses = require('../enums/contractStatuses');
const { Job, Contract, Profile, sequelize } = require('../models');

const BALANCE_PROPERTY_NAME = 'balance';

/**
 * Gets unpaid Jobs for non-terminated Contracts that belong to a provided profileId
 * @param {Number} profileId Profile id
 * @returns {Promise<Job[]>} Unpaid jobs Promise
 * @throws {ArgumentError} if the profileId is invalid
 */
function getUnpaidJobs(profileId) {
	exists(profileId);

	return sequelize.transaction((transaction) => {
		return Job.findAll({
			where: {
				paid: false
			},
			include: {
				model: Contract,
				where: {
					status: contractStatuses.IN_PROGRESS,
					[Op.or]: [
						{ ClientId: profileId },
						{ ContractorId: profileId }
					]
				},
				required: true,
				attributes: []
			},
			transaction,
			skipLocked: true
		});
	});
}

/**
 * Gets total amount of prices for all profile unpaid jobs as a client
 * @param {Number} clientId Client id
 * @param {transaction} transaction Transaction
 * @returns {Promise<Number>} Profile total debt
 */
function getUnpaidJobsTotalAmount(clientId, transaction) {
	return Job.sum('price', {
		include: {
			model: Contract,
			where: {
				status: contractStatuses.IN_PROGRESS,
				[Op.or]: [
					{ ClientId: clientId }
				]
			},
			required: true,
			attributes: []
		},
		transaction,
		skipLocked: true
	});
}

/**
 * Performs Job payment processing
 * @param {Number} jobId Job id
 * @param {Number} profileId Profile id
 * @returns {Promise} Payment processing Promise
 * @throws {ArgumentError} if the jobId is invalid
 * @throws {ConflictError} if Job payment cannot be performed
 */
async function payForJob(jobId, profileId) {
	exists(jobId);

	const transaction = await sequelize.transaction();

	try {
		const job = await Job.findByPk(jobId, {
			include: {
				model: Contract,
				include: [{
					model: Profile,
					as: 'Client'
				}, {
					model: Profile,
					as: 'Contractor'
				}]
			},
			transaction,
			lock: true,
			skipLocked: true
		});

		if (!job) {
			throw new NotFoundError('Job not found');
		}

		if (job.paid) {
			throw new ConflictError('Job is already paid');
		}

		const jobPrice = job.price;
		const { Client: client, Contractor: contractor } = job.Contract;

		if (client.id !== profileId) {
			throw new UnauthorizedError('User is not allowed to update this entity');
		}

		if (client.balance < jobPrice) {
			throw new ConflictError('Not enough money');
		}

		await client.decrement(BALANCE_PROPERTY_NAME, { by: jobPrice, transaction });
		await contractor.increment(BALANCE_PROPERTY_NAME, { by: jobPrice, transaction });
		await job.update({ paid: true, paymentDate: new Date() }, { transaction });

		await transaction.commit();
	} catch (err) {
		await transaction.rollback();
		throw err;
	}
}

module.exports = {
	payForJob,
	getUnpaidJobs,
	getUnpaidJobsTotalAmount
};
