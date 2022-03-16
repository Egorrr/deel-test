const { validate } = require('express-validation');

const VALIDATION_OPTIONS = { context: true, keyByField: true };

module.exports = (schema) => validate(schema, VALIDATION_OPTIONS);
