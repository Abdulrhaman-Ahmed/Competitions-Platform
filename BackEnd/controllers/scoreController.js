const db = require('../config/db');

// @desc    Submit score
// @route   POST /api/scores
exports.submitScore = async (req, res) => {
  try {
    const { participant_id, score, feedback } = req.body;

    if (!participant_id || score === undefined) {
      return res.status(400).json({ message: 'يرجى إدخال جميع الحقول المطلوبة' });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({ message: 'الدرجة يجب أن تكون بين 0 و 100' });
    }

    // Get participant details
    const [participants] = await db.query(
      'SELECT * FROM participants WHERE id = ?',
      [participant_id]
    );

    if (participants.length === 0) {
      return res.status(404).json({ message: 'المشارك غير موجود' });
    }

    // Get judge assignment
    const [judgeAssignment] = await db.query(
      'SELECT * FROM judges WHERE competition_id = ? AND user_id = ? AND status = "active"',
      [participants[0].competition_id, req.user.id]
    );

    if (judgeAssignment.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح لك بتقييم هذا المشارك' });
    }

    const judge_id = judgeAssignment[0]?.id || null;

    // Check if already scored
    const [existingScore] = await db.query(
      'SELECT * FROM scores WHERE participant_id = ? AND judge_id = ?',
      [participant_id, judge_id]
    );

    if (existingScore.length > 0) {
      // Update existing score
      await db.query(
        'UPDATE scores SET score = ?, feedback = ?, scored_at = NOW() WHERE participant_id = ? AND judge_id = ?',
        [score, feedback, participant_id, judge_id]
      );
    } else {
      // Insert new score
      await db.query(
        'INSERT INTO scores (participant_id, judge_id, score, feedback) VALUES (?, ?, ?, ?)',
        [participant_id, judge_id, score, feedback]
      );
    }

    res.json({
      success: true,
      message: 'تم إرسال التقييم بنجاح'
    });
  } catch (error) {
    console.error('Submit Score Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Get participant scores
// @route   GET /api/scores/participant/:id
exports.getParticipantScores = async (req, res) => {
  try {
    const [scores] = await db.query(
      `SELECT s.*, u.name as judge_name
       FROM scores s
       JOIN judges j ON s.judge_id = j.id
       JOIN users u ON j.user_id = u.id
       WHERE s.participant_id = ?
       ORDER BY s.scored_at DESC`,
      [req.params.id]
    );

    // Calculate average
    const avg = scores.length > 0
      ? scores.reduce((sum, s) => sum + parseFloat(s.score), 0) / scores.length
      : 0;

    res.json({
      success: true,
      count: scores.length,
      average: avg.toFixed(2),
      data: scores
    });
  } catch (error) {
    console.error('Get Participant Scores Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// @desc    Get competition results
// @route   GET /api/scores/competition/:id/results
exports.getCompetitionResults = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT p.id, p.user_id, u.name, u.email, u.avatar,
       AVG(s.score) as final_score,
       COUNT(DISTINCT s.judge_id) as judges_count
       FROM participants p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN scores s ON p.id = s.participant_id
       WHERE p.competition_id = ? AND p.status = 'participated'
       GROUP BY p.id
       HAVING final_score IS NOT NULL
       ORDER BY final_score DESC`,
      [req.params.id]
    );

    // Add rank
    results.forEach((result, index) => {
      result.rank = index + 1;
      result.final_score = parseFloat(result.final_score).toFixed(2);
    });

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Get Competition Results Error:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};