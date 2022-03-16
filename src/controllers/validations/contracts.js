const { Joi } = require('express-validation');

module.exports = {
	getById: {
		params: Joi.object({
			id: Joi.number().integer().positive().required()
		})
	},
	pay: {
		params: Joi.object({
			jobId: Joi.number().integer().positive().required()
		})
	}
};
