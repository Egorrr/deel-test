const { Op } = require('sequelize');
const { Contract: Contracts } = require('../models/model');
const ArgumentError = require('../errors/ArgumentError');
const contractStatuses = require('../enums/contractStatuses');

/**
 * Gets single contract if it belongs to a provided profileId
 * @param {Number} id contract id
 * @param {Number} profileId profile id
 * @return {Promise<Contract>} Contract Promise
 * @throws <ArgumentError> If the contract id or profile id are invalid
 */
function getProfileContractById(id, profileId) {
	if (id === null || id === undefined || profileId === null || profileId === undefined) {
		throw new ArgumentError;
	}

	return Contracts.findOne({
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
 * Gets all non-terminated contracts that belong to a provided profile id
 * @param {Number} profileId profile id
 * @return {Promise<Contract[]>} Profile contracts Promise
 * @throws <ArgumentError> If the profile id is invalid
 */
function getAllActiveProfileContracts(profileId) {
	if (profileId === null || profileId === undefined) {
		throw new ArgumentError;
	}

	return Contracts.findAll({
		where: {
			status: { [Op.ne]: contractStatuses.TERMINATED },
			[Op.or]: [
				{ ClientId: profileId },
				{ ContractorId: profileId }
			]
		},
		raw: true
	});
}

module.exports = {
	getProfileContractById,
	getAllActiveProfileContracts
};
