const express = require('express');
const router = express.Router();
const { getTargetTexts, getTargetsByCategory } = require('../controllers/textController');

router.get('/target-texts', getTargetTexts);
router.get('/target-texts/:category', getTargetsByCategory);

module.exports = router;
