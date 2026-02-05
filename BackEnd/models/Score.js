const express = require('express');
const router = express.Router();
const {
  submitScore,
  getParticipantScores,
  getCompetitionResults
} = require('../controllers/scoreController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('judge', 'admin'), submitScore);
router.get('/participant/:id', protect, getParticipantScores);
router.get('/competition/:id/results', protect, getCompetitionResults);

module.exports = router;