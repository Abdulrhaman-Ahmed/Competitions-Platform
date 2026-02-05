const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'غير مصرح - لا يوجد توكن' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await db.query('SELECT id, name, email, role, avatar FROM users WHERE id = ?', [decoded.id]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'المستخدم غير موجود' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(401).json({ message: 'غير مصرح - توكن غير صالح' });
  }
};

// Check user role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `دور ${req.user.role} غير مصرح له بالوصول لهذا المورد`
      });
    }
    next();
  };
};