const router = require('express').Router();
const { defaultMiddleware } = require('../middleware');

router.use('/jobs', defaultMiddleware, require('./jobs'));
router.use('/contracts', defaultMiddleware, require('./contracts'));

module.exports = router;
