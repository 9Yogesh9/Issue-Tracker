const express = require("express");
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.home);
router.use('/project', require('./projects'));
router.use('/issues', require('./issues'));
router.use('/search', require('./search'));

module.exports = router;