const express = require('express');
const router = express.Router();
const {
  getAllCompetitions,
  getCompetition,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  getStatistics
} = require('../controllers/competitionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin'), getStatistics);
router.get('/', protect, getAllCompetitions);
router.get('/:id', protect, getCompetition);
router.post('/', protect, authorize('admin'), createCompetition);
router.put('/:id', protect, authorize('admin'), updateCompetition);
router.delete('/:id', protect, authorize('admin'), deleteCompetition);

module.exports = router;