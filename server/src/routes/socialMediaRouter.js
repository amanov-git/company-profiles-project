const router = require('express').Router();
const { getAllSocialMediaTypes } = require('../controllers/socialLinksController');

router.get('/get-all-social-media-types', getAllSocialMediaTypes);

module.exports = router;