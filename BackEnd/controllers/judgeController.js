const db = require('../config/db');

// @desc    Assign judge to competition
// @route   POST /api/judges/assign
exports.assignJudge = async (req, res) => {
  try {
    const { competition_id, user_id } = req.body;

    // Check if user is a judge
    const [users] = await db.query('SELECT role FROM users WHERE id = ?', [user_id]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    if (users[0].role !== 'judge') {
      return res.status(400).json({ message: 'المستخدم ليس محكماً' });
    }

    // Check if already assigned
    const [existing] = await db.query(
      'SELECT * FROM judges WHERE competition_id = ? AND user_id = ?',
      [competition_id, user_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'المحكم مسجل بالفعل في هذه المسابقة' });
    }

    // Assign judge
    await db.query(
      'INSERT INTO judges (competition_id, user_id) VALUES (?, ?)',
      [competition_id, user_id]
    );

    res.status(201).json({
      success: true,
      message: 'تم تعيين المحكم بنجاح'
    });
  } catch (error) {
    console.error('Assign Judge Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Get judge assigned competitions
// @route   GET /api/judges/my-competitions
exports.getMyJudgingCompetitions = async (req, res) => {
  try {
    const [competitions] = await db.query(
      `SELECT j.*, c.title, c.category, c.icon, c.start_date, c.end_date, c.status
       FROM judges j
       JOIN competitions c ON j.competition_id = c.id
       WHERE j.user_id = ? AND j.status = 'active'
       ORDER BY j.assigned_date DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      count: competitions.length,
      data: competitions
    });
  } catch (error) {
    console.error('Get My Judging Competitions Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Get participants to judge
// @route   GET /api/judges/competition/:id/participants
exports.getParticipantsToJudge = async (req, res) => {
  try {
    const competition_id = req.params.id;

    // Check if judge is assigned to this competition
    const [judgeAssignment] = await db.query(
      'SELECT * FROM judges WHERE competition_id = ? AND user_id = ? AND status = "active"',
      [competition_id, req.user.id]
    );

    if (judgeAssignment.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح لك بتقييم هذه المسابقة' });
    }

    const [participants] = await db.query(
      `SELECT p.*, u.name, u.email,
       (SELECT AVG(score) FROM scores s WHERE s.participant_id = p.id) as avg_score,
       (SELECT COUNT(*) FROM scores s WHERE s.participant_id = p.id) as judges_count
       FROM participants p
       JOIN users u ON p.user_id = u.id
       WHERE p.competition_id = ? AND p.status = 'participated'
       ORDER BY p.submission_date DESC`,
      [competition_id]
    );

    res.json({
      success: true,
      count: participants.length,
      data: participants
    });
  } catch (error) {
    console.error('Get Participants To Judge Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Get all judges
// @route   GET /api/judges
exports.getAllJudges = async (req, res) => {
  try {
    const [judges] = await db.query(
      'SELECT id, name, email, avatar FROM users WHERE role = "judge"'
    );

    res.json({
      success: true,
      count: judges.length,
      data: judges
    });
  } catch (error) {
    console.error('Get All Judges Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};