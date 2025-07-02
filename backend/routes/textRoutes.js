const express = require('express');
const router = express.Router();
const {
  getTargetTexts,
  getTargetsByCategory,
  getTargetsByCategoryWithSizeGroup
} = require('../controllers/textController');

router.get('/target-texts', getTargetTexts);
router.get('/target-texts/:category', getTargetsByCategory);
router.get('/target-texts-by-size', getTargetsByCategoryWithSizeGroup); // ✅ route ใหม่

module.exports = router;
