const { Joi } = require('express-validation');

module.exports = {
	getBestProfession: {
		query: Joi.object({
			start: Joi.date().iso().required(),
			end: Joi.date().iso().required()
		})
	},
	getBestPayingClients: {
		query: Joi.object({
			start: Joi.date().iso().required(),
			end: Joi.date().iso().required(),
			limit: Joi.number().integer().positive().default(2)
		})
	}
};
