const logger = require('../utils/logger');
const { toHttpError } = require('../mappers/error');

module.exports = () => {
	return (e, req, res, _next) => {
		logger.error(e);

		const error = toHttpError(e);

		res.status(error.status).json(error);
	};
};
