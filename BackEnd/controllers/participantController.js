const db = require('../config/db');

// @desc    Register for competition
// @route   POST /api/participants/register
exports.registerParticipant = async (req, res) => {
  try {
    const { competition_id } = req.body;
    const user_id = req.user.id;

    // Check if competition exists
    const [competitions] = await db.query('SELECT * FROM competitions WHERE id = ?', [competition_id]);

    if (competitions.length === 0) {
      return res.status(404).json({ message: 'المسابقة غير موجودة' });
    }

    // Check if already registered
    const [existing] = await db.query(
      'SELECT * FROM participants WHERE competition_id = ? AND user_id = ?',
      [competition_id, user_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'أنت مسجل بالفعل في هذه المسابقة' });
    }

    // Check max participants
    const competition = competitions[0];
    if (competition.max_participants) {
      const [count] = await db.query(
        'SELECT COUNT(*) as count FROM participants WHERE competition_id = ?',
        [competition_id]
      );

      if (count[0].count >= competition.max_participants) {
        return res.status(400).json({ message: 'وصل عدد المشاركين للحد الأقصى' });
      }
    }

    // Register participant
    await db.query(
      'INSERT INTO participants (competition_id, user_id, status) VALUES (?, ?, ?)',
      [competition_id, user_id, 'approved']
    );

    // Create notification
    await db.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [user_id, 'تسجيل في مسابقة', `تم تسجيلك بنجاح في مسابقة ${competition.title}`, 'success']
    );

    res.status(201).json({
      success: true,
      message: 'تم التسجيل في المسابقة بنجاح'
    });
  } catch (error) {
    console.error('Register Participant Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Get user participations
// @route   GET /api/participants/my-competitions
exports.getMyCompetitions = async (req, res) => {
  try {
    const [participations] = await db.query(
      `SELECT p.*, c.title, c.category, c.icon, c.start_date, c.end_date, c.status as comp_status
       FROM participants p
       JOIN competitions c ON p.competition_id = c.id
       WHERE p.user_id = ?
       ORDER BY p.registration_date DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: participations.length,
      data: participations
    });
  } catch (error) {
    console.error('Get My Competitions Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Get all participants (Admin)
// @route   GET /api/participants
exports.getAllParticipants = async (req, res) => {
  try {
    const { competition_id, status } = req.query;
    let query = `
      SELECT p.*, u.name, u.email, c.title as competition_title
      FROM participants p
      JOIN users u ON p.user_id = u.id
      JOIN competitions c ON p.competition_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (competition_id) {
      query += ' AND p.competition_id = ?';
      params.push(competition_id);
    }

    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }

    query += ' ORDER BY p.registration_date DESC';

    const [participants] = await db.query(query, params);

    res.json({
      success: true,
      count: participants.length,
      data: participants
    });
  } catch (error) {
    console.error('Get All Participants Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Update participant status
// @route   PUT /api/participants/:id
exports.updateParticipantStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const [result] = await db.query(
      'UPDATE participants SET status = ?, notes = ? WHERE id = ?',
      [status, notes, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'المشارك غير موجود' });
    }

    res.json({
      success: true,
      message: 'تم تحديث حالة المشارك بنجاح'
    });
  } catch (error) {
    console.error('Update Participant Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Submit competition work
// @route   POST /api/participants/:id/submit
exports.submitWork = async (req, res) => {
  try {
    const { submission_file, notes } = req.body;

    const [result] = await db.query(
      'UPDATE participants SET submission_file = ?, submission_date = NOW(), status = ?, notes = ? WHERE id = ? AND user_id = ?',
      [submission_file, 'participated', notes, req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'المشاركة غير موجودة' });
    }

    res.json({
      success: true,
      message: 'تم رفع العمل بنجاح'
    });
  } catch (error) {
    console.error('Submit Work Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};