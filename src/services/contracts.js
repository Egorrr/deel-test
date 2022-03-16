const { Op } = require('sequelize');
const { Contract } = require('../models');
const { exists } = require('../utils/contracts');
const contractStatuses = require('../enums/contractStatuses');

/**
 * Gets single Contract if it belongs to a provided profileId
 *
 * NOTE: Terminated Contract should still be available by id as per discussion
 *
 * @param {Number} id Contract id
 * @param {Number} profileId Profile id
 * @returns {Promise<Contract>} Contract Promise
 * @throws <ArgumentError> if the contractId or profileId are invalid
 */
function getProfileContractById(id, profileId) {
	exists(id);
	exists(profileId);

	return Contract.findOne({
		where: {
			id,
			[Op.or]: [
				{ ClientId: profileId },
				{ ContractorId: profileId }
			]
		}
	});
}

/**
 * Gets all non-terminated Contracts that belong to a provided profileId
 * @param {Number} profileId profile id
 * @returns {Promise<Contract[]>} Profile Contracts Promise
 * @throws <ArgumentError> if the profileId is invalid
 */
function getAllNonTerminatedProfileContracts(profileId) {
	exists(profileId);

	return Contract.findAll({
		where: {
			status: { [Op.ne]: contractStatuses.TERMINATED },
			[Op.or]: [
				{ ClientId: profileId },
				{ ContractorId: profileId }
			]
		}
	});
}

module.exports = {
	getProfileContractById,
	getAllNonTerminatedProfileContracts
};
