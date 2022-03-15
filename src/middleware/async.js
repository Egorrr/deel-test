/**
 * Makes a safe async middleware
 * @param {Function} middleware middleware to wrap to as safe execution try/catch block and propagate an error if any
 * @returns {Function} higher order function
 */
module.exports = (middleware) => async (req, res, next) => {
	try {
		return await middleware(req, res, next);
	} catch (e) {
		next(e);
	}
};
