const asyncMiddleware = require('./async');
const httpErrors = require('../errors/httpErrors');

const ADMIN_TOKEN_HEADER = 'admin_key';

/**
 * Checks if user got the admin access
 *
 * ASSUMPTION: Admin endpoint should be additionally protected and regular Profile can't have access to it
 *
 * @throws {HttpError} if requested user don't have Admin token
 */
module.exports = asyncMiddleware(async (req, res, next) => {
	try {
		const adminToken = req.get(ADMIN_TOKEN_HEADER);

		if (!adminToken) {
			next(httpErrors.unauthorized);
		}

		// ...validateAdminToken(adminToken);

		next();
	} catch (e) {
		next(httpErrors.unauthorized);
	}
});
