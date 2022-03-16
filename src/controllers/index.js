const router = require('express').Router();
const { defaultMiddleware, protectedMiddleware } = require('../middleware');

router.use('/jobs', defaultMiddleware, require('./jobs'));
router.use('/contracts', defaultMiddleware, require('./contracts'));

router.use('/admin', protectedMiddleware, require('./admin'));

module.exports = router;
