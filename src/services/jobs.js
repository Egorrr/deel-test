const { Op } = require('sequelize');
const { exists } = require('../utils/contracts');
const NotFoundError = require('../errors/NotFound');
const ConflictError = require('../errors/Conflict');
const contractStatuses = require('../enums/contractStatuses');
const { Job, Contract, Profile, sequelize } = require('../models/model');

const BALANCE_PROPERTY_NAME = 'balance';

/**
 * Gets unpaid Jobs for non-terminated Contracts that belong to a provided profileId
 * @param {Number} profileId Profile id
 * @return {Promise<Job[]>} Unpaid jobs Promise
 * @throws {ArgumentError} if the profileId is invalid
 */
async function getUnpaidJobs(profileId) {
	exists(profileId);

	return Job.findAll({
		where: {
			paid: false
		},
		include: {
			model: Contract,
			where: {
				status: { [Op.ne]: contractStatuses.TERMINATED },
				[Op.or]: [
					{ ClientId: profileId },
					{ ContractorId: profileId }
				]
			},
			required: true,
			attributes: []
		}
	});
}

/**
 * Performs Job payment processing
 * @param {Number} jobId Job id
 * @return {Promise} Payment processing Promise
 * @throws {ArgumentError} if the jobId is invalid
 * @throws {ConflictError} if Job payment cannot be performed
 */
async function payForJob(jobId) {
	exists(jobId);

	let transaction = await sequelize.transaction();

	try {
		const job = await Job.findByPk(jobId, {
			include: {
				model: Contract,
				include: [
					{
						model: Profile,
						as: 'Client'
					},
					{
						model: Profile,
						as: 'Contractor'
					}
				]
			},
			transaction
		});

		if (!job) {
			throw new NotFoundError('Job not found');
		}

		if (job.paid) {
			throw new ConflictError('Job is already paid');
		}

		const jobPrice = job.price;
		const { Client: client, Contractor: contractor } = job.Contract;

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
	getUnpaidJobs
};
