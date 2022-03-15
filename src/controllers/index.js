const router = require('express').Router();
const { defaultMiddleware } = require('../middleware');

router.use('/contracts', defaultMiddleware, require('./contracts'));

module.exports = router;
