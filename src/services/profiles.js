const { Profile } = require('../models');
const { exists } = require('../utils/contracts');

/**
 * Gets Profile by id
 * @param {Number} id Profile id
 * @returns {Promise<Profile>} Profile Promise
 * @throws {ArgumentError} if the profileId is invalid
 */
async function getById(id) {
	exists(id);

	return Profile.findByPk(id);
}

module.exports = {
	getById
};
