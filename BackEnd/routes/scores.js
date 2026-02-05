const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

// Routes
router.post('/', scoreController.submitScore);
router.get('/participant/:id', scoreController.getParticipantScores);
router.get('/competition/:id/results', scoreController.getCompetitionResults);

module.exports = router;