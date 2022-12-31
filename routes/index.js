const express = require("express");
const router = express.Router();
const homeController = require('../controllers/homeController');
const projectsController = require('../controllers/projectsController');

router.get('/', homeController.home);
router.post('/project', projectsController.create);

module.exports = router;