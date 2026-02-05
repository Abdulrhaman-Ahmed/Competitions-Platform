const db = require('../config/db');

// Generate unique certificate code
const generateCertificateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'CERT-';
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// @desc    Generate certificates for competition
// @route   POST /api/certificates/generate/:competition_id
exports.generateCertificates = async (req, res) => {
  try {
    const competition_id = req.params.competition_id;

    // Get competition results
    const [results] = await db.query(
      `SELECT p.id as participant_id, p.user_id,
       AVG(s.score) as final_score
       FROM participants p
       LEFT JOIN scores s ON p.id = s.participant_id
       WHERE p.competition_id = ? AND p.status = 'participated'
       GROUP BY p.id
       HAVING final_score IS NOT NULL
       ORDER BY final_score DESC`,
      [competition_id]
    );

    if (results.length === 0) {
      return res.status(400).json({ message: 'لا توجد نتائج لإصدار شهادات' });
    }

    let certificatesGenerated = 0;

    // Generate certificate for each participant
    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      // Check if certificate already exists
      const [existing] = await db.query(
        'SELECT * FROM certificates WHERE participant_id = ?',
        [result.participant_id]
      );

      if (existing.length === 0) {
        const certificate_code = generateCertificateCode();

        await db.query(
          'INSERT INTO certificates (participant_id, certificate_code, final_score, rank_position) VALUES (?, ?, ?, ?)',
          [result.participant_id, certificate_code, result.final_score, i + 1]
        );

        // Create notification
        await db.query(
          'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
          [result.user_id, 'شهادة جديدة', 'تم إصدار شهادة مشاركتك في المسابقة', 'success']
        );

        certificatesGenerated++;
      }
    }

    res.json({
      success: true,
      message: `تم إصدار ${certificatesGenerated} شهادة بنجاح`
    });
  } catch (error) {
    console.error('Generate Certificates Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Get user certificates
// @route   GET /api/certificates/my-certificates
exports.getMyCertificates = async (req, res) => {
  try {
    const [certificates] = await db.query(
      `SELECT cert.*, c.title as competition_title, c.category
       FROM certificates cert
       JOIN participants p ON cert.participant_id = p.id
       JOIN competitions c ON p.competition_id = c.id
       WHERE p.user_id = ?
       ORDER BY cert.issued_date DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    console.error('Get My Certificates Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Get certificate by code
// @route   GET /api/certificates/verify/:code
exports.verifyCertificate = async (req, res) => {
  try {
    const [certificates] = await db.query(
      `SELECT cert.*, u.name, c.title as competition_title, c.category
       FROM certificates cert
       JOIN participants p ON cert.participant_id = p.id
       JOIN users u ON p.user_id = u.id
       JOIN competitions c ON p.competition_id = c.id
       WHERE cert.certificate_code = ?`,
      [req.params.code]
    );

    if (certificates.length === 0) {
      return res.status(404).json({ message: 'الشهادة غير موجودة' });
    }

    res.json({
      success: true,
      data: certificates[0]
    });
  } catch (error) {
    console.error('Verify Certificate Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Get all certificates (Admin)
// @route   GET /api/certificates
exports.getAllCertificates = async (req, res) => {
  try {
    const [certificates] = await db.query(
      `SELECT cert.*, u.name, u.email, c.title as competition_title
       FROM certificates cert
       JOIN participants p ON cert.participant_id = p.id
       JOIN users u ON p.user_id = u.id
       JOIN competitions c ON p.competition_id = c.id
       ORDER BY cert.issued_date DESC`
    );

    res.json({
      success: true,
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    console.error('Get All Certificates Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};