const express = require('express');
const router = express.Router();
const issuesController = require('../controllers/issuesController');

router.post('/create',issuesController.create);
router.post('/delete/:id',issuesController.delete);

module.exports = router;