const { Joi } = require('express-validation');

module.exports = {
	deposit: {
		params: Joi.object({
			userId: Joi.number().integer().positive().required()
		}),
		body: Joi.object({
			amount: Joi.number().positive().required()
		})
	}
};
