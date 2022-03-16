const logger = require('../utils/logger');
const { toHttpError } = require('../mappers/error');

module.exports = function() {
	return (e, req, res, _next) => {
		logger.error(e);

		const error = toHttpError(e);

		res.status(error.status).json(error);
	};
};
