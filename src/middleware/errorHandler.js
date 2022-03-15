const { toHttpError } = require('../mappers/error');

module.exports = function() {
	return (e, req, res, _next) => {
		console.log(e);

		const error = toHttpError(e);

		res.status(error.status).json(error);
	};
};
