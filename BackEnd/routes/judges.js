const express = require('express');
const router = express.Router();
const {
  assignJudge,
  getMyJudgingCompetitions,
  getParticipantsToJudge,
  getAllJudges
} = require('../controllers/judgeController');
const { protect, authorize } = require('../middleware/auth');

router.post('/assign', protect, authorize('admin'), assignJudge);
router.get('/my-competitions', protect, authorize('judge', 'admin'), getMyJudgingCompetitions);
router.get('/competition/:id/participants', protect, authorize('judge', 'admin'), getParticipantsToJudge);
router.get('/', protect, authorize('admin'), getAllJudges);

module.exports = router;