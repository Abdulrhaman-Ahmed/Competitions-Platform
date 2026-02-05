import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrophy, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('كلمة المرور غير متطابقة');
      return;
    }

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password, formData.role);

    if (result.success) {
      navigate('/student/competitions');
    }

    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
         style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card-custom shadow-lg border-0 p-4">
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle mb-3"
                     style={{ width: '80px', height: '80px' }}>
                  <FaTrophy size={40} className="text-white" />
                </div>
                <h2 className="fw-bold mb-2">إنشاء حساب جديد</h2>
                <p className="text-muted">انضم إلى منصة المسابقات</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">الاسم الكامل</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaUser className="text-muted" />
                    </span>
                    <input
                      type="text"
                      name="name"
                      className="form-control border-start-0 ps-0"
                      placeholder="أدخل الاسم الكامل"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

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

                <div className="mb-3">
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
                      minLength="6"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">تأكيد كلمة المرور</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <FaLock className="text-muted" />
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control border-start-0 ps-0"
                      placeholder="أعد إدخال كلمة المرور"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">نوع الحساب</label>
                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="student">طالب</option>
                    <option value="judge">محكم</option>
                    <option value="admin">مشرف </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-custom-primary w-100 py-2 fw-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm ms-2"></span>
                  ) : (
                    'إنشاء حساب'
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  لديك حساب بالفعل؟{' '}
                  <Link to="/login" className="text-decoration-none fw-semibold">
                    تسجيل الدخول
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;