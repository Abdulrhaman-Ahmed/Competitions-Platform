const express = require('express');
const router = express.Router();
const {
  generateCertificates,
  getMyCertificates,
  verifyCertificate,
  getAllCertificates
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

router.post('/generate/:competition_id', protect, authorize('admin'), generateCertificates);
router.get('/my-certificates', protect, getMyCertificates);
router.get('/verify/:code', verifyCertificate);
router.get('/', protect, authorize('admin'), getAllCertificates);

module.exports = router;