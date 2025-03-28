const router = require('express').Router();
const { getAllTitles } = require('../controllers/titlesController');

router.get('/get-all-titles', getAllTitles);

module.exports = router;