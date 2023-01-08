const express = require('express');
const router = express.Router();
const issuesController = require('../controllers/issuesController');

router.post('/create',issuesController.create);

module.exports = router;