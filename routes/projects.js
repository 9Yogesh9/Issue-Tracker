const express = require("express");
const router = express.Router();
const projectsController = require('../controllers/projectsController');

router.post('/create', projectsController.create);
router.post('/delete/:id', projectsController.delete);
router.get('/deleteAll', projectsController.deleteAll);

module.exports = router;