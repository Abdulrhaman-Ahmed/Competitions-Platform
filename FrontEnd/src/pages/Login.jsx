import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrophy, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      const role = result.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'judge') navigate('/judge/competitions');
      else navigate('/student/competitions');
    }

    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
         style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card-custom shadow-lg border-0 p-4">
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle mb-3"
                     style={{ width: '80px', height: '80px' }}>
                  <FaTrophy size={40} className="text-white" />
                </div>
                <h2 className="fw-bold mb-2">منصة المسابقات</h2>
                <p className="text-muted">مرحباً بك! قم بتسجيل الدخول للمتابعة</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">البريد الإلكتروني</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaEnvelope className="text-muted" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control border-start-0 ps-0"
                      placeholder="أدخل البريد الإلكتروني"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">كلمة المرور</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaLock className="text-muted" />
                    </span>
                    <input
                      type="password"
                      name="password"
                      className="form-control border-start-0 ps-0"
                      placeholder="أدخل كلمة المرور"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-custom-primary w-100 py-2 fw-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm ms-2"></span>
                  ) : (
                    'تسجيل الدخول'
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  ليس لديك حساب؟{' '}
                  <Link to="/register" className="text-decoration-none fw-semibold">
                    إنشاء حساب جديد
                  </Link>
                </p>
              </div>

              <div className="mt-4 pt-3 border-top">
                <p className="text-muted text-center small mb-2">حسابات تجريبية:</p>
                <div className="d-flex flex-column gap-2">
                  <small className="text-muted">👨‍💼 Admin: admin@competition.com / admin123</small>
                  <small className="text-muted">⚖️ Judge: judge@competition.com / judge123</small>
                  <small className="text-muted">🎓 Student: student@competition.com / student123</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;