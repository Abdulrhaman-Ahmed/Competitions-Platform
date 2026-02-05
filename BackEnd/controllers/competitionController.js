const db = require('../config/db');

// @desc    Get all competitions
// @route   GET /api/competitions
exports.getAllCompetitions = async (req, res) => {
  try {
    const { status, category } = req.query;
    let query = 'SELECT * FROM competitions WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const [competitions] = await db.query(query, params);

    // Get participant count for each competition
    for (let comp of competitions) {
      const [count] = await db.query(
        'SELECT COUNT(*) as count FROM participants WHERE competition_id = ?',
        [comp.id]
      );
      comp.participant_count = count[0].count;
    }

    res.json({
      success: true,
      count: competitions.length,
      data: competitions
    });
  } catch (error) {
    console.error('Get Competitions Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Get single competition
// @route   GET /api/competitions/:id
exports.getCompetition = async (req, res) => {
  try {
    const [competitions] = await db.query(
      'SELECT * FROM competitions WHERE id = ?',
      [req.params.id]
    );

    if (competitions.length === 0) {
      return res.status(404).json({ message: 'المسابقة غير موجودة' });
    }

    const competition = competitions[0];

    // Get participant count
    const [count] = await db.query(
      'SELECT COUNT(*) as count FROM participants WHERE competition_id = ?',
      [competition.id]
    );
    competition.participant_count = count[0].count;

    // Check if current user is participating
    if (req.user) {
      const [participation] = await db.query(
        'SELECT * FROM participants WHERE competition_id = ? AND user_id = ?',
        [competition.id, req.user.id]
      );
      competition.user_participation = participation[0] || null;
    }

    res.json({
      success: true,
      data: competition
    });
  } catch (error) {
    console.error('Get Competition Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Create competition
// @route   POST /api/competitions
// @access  Admin
exports.createCompetition = async (req, res) => {
  try {
    const { title, description, category, icon, start_date, end_date, max_participants } = req.body;

    if (!title || !category || !start_date || !end_date) {
      return res.status(400).json({ message: 'يرجى إدخال جميع الحقول المطلوبة' });
    }

    const [result] = await db.query(
      `INSERT INTO competitions
       (title, description, category, icon, start_date, end_date, max_participants, created_by, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'upcoming')`,
      [title, description, category, icon, start_date, end_date, max_participants, req.user.id]
    );

    const [newCompetition] = await db.query('SELECT * FROM competitions WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      data: newCompetition[0]
    });
  } catch (error) {
    console.error('Create Competition Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Update competition
// @route   PUT /api/competitions/:id
// @access  Admin
exports.updateCompetition = async (req, res) => {
  try {
    const { title, description, category, icon, start_date, end_date, status, max_participants } = req.body;

    const [result] = await db.query(
      `UPDATE competitions
       SET title = ?, description = ?, category = ?, icon = ?,
           start_date = ?, end_date = ?, status = ?, max_participants = ?
       WHERE id = ?`,
      [title, description, category, icon, start_date, end_date, status, max_participants, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'المسابقة غير موجودة' });
    }

    const [updated] = await db.query('SELECT * FROM competitions WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      data: updated[0]
    });
  } catch (error) {
    console.error('Update Competition Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Delete competition
// @route   DELETE /api/competitions/:id
// @access  Admin
exports.deleteCompetition = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM competitions WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'المسابقة غير موجودة' });
    }

    res.json({
      success: true,
      message: 'تم حذف المسابقة بنجاح'
    });
  } catch (error) {
    console.error('Delete Competition Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Get competition statistics
// @route   GET /api/competitions/stats
// @access  Admin
exports.getStatistics = async (req, res) => {
  try {
    const [totalComps] = await db.query('SELECT COUNT(*) as count FROM competitions');
    const [totalParticipants] = await db.query('SELECT COUNT(DISTINCT user_id) as count FROM participants');
    const [ongoingComps] = await db.query("SELECT COUNT(*) as count FROM competitions WHERE status = 'ongoing'");
    const [completedComps] = await db.query("SELECT COUNT(*) as count FROM competitions WHERE status = 'completed'");

    res.json({
      success: true,
      data: {
        total_competitions: totalComps[0].count,
        total_participants: totalParticipants[0].count,
        ongoing_competitions: ongoingComps[0].count,
        completed_competitions: completedComps[0].count
      }
    });
  } catch (error) {
    console.error('Get Statistics Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};