const asyncMiddleware = require('./async');
const httpErrors = require('../errors/httpErrors');
const profileService = require('../services/profiles');

const PROFILE_ID_HEADER = 'profile_id';

/**
 * Gets user Profile by profile_id header and puts it into the request
 */
module.exports = asyncMiddleware(async (req, res, next) => {
	try {
		const profileId = req.get(PROFILE_ID_HEADER);
		const profile = await profileService.getById(profileId);

		if (!profile) {
			next(httpErrors.unauthorized);
		}

		req.profile = profile.toJSON();
		next();
	} catch (e) {
		next(httpErrors.unauthorized);
	}
});
