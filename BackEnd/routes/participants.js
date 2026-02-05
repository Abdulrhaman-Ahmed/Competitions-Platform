const express = require('express');
const router = express.Router();
const {
  registerParticipant,
  getMyCompetitions,
  getAllParticipants,
  updateParticipantStatus,
  submitWork
} = require('../controllers/participantController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', protect, registerParticipant);
router.get('/my-competitions', protect, getMyCompetitions);
router.get('/', protect, authorize('admin', 'judge'), getAllParticipants);
router.put('/:id', protect, authorize('admin'), updateParticipantStatus);
router.post('/:id/submit', protect, submitWork);

module.exports = router;