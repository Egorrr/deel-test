const { Op } = require('sequelize');
const { exists } = require('../utils/contracts');
const { Job, Contract } = require('../models/model');
const contractStatuses = require('../enums/contractStatuses');

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

module.exports = {
	getUnpaidJobs
};
