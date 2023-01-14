const express = require('express');
const router = express.Router();
const searchController = require("../controllers/searchController");

router.post('/do_search/:id', searchController.do_search);

module.exports = router;