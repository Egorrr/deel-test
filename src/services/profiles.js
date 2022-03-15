const { Profile } = require('../models/model');
const ArgumentError = require('../errors/ArgumentError');

/**
 * Gets Profile by id
 * @param {Number} id Profile id
 * @return {Promise<Profile>} Profile Promise
 * @throws <ArgumentError> if the profileId is invalid
 */
async function getById(id) {
	if (id === null || id === undefined) {
		throw new ArgumentError;
	}

	return Profile.findByPk(id);
}

module.exports = {
	getById
};
