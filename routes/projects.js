const express = require("express");
const router = express.Router();
const projectsController = require('../controllers/projectsController');

router.post('/create', projectsController.create);
router.post('/delete/:id', projectsController.delete);
router.get('/project_details/:id', projectsController.details);
router.get('/deleteAll', projectsController.deleteAll);

module.exports = router;