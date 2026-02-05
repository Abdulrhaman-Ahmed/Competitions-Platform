import { FaBell, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="top-navbar mt-3 mb-4 py-3 px-4 bg-white shadow-sm rounded-3">
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center justify-content-between h-100">
          <div>
            <h4 className="mb-0 fw-bold">أهلاً، {user?.name?.split(' ')[0]} 👋</h4>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="position-relative" style={{ cursor: 'pointer' }}>
              <FaEnvelope size={20} className="text-secondary" />
              <span className="notification-badge">1</span>
            </div>

            <div className="position-relative" style={{ cursor: 'pointer' }}>
              <FaBell size={20} className="text-secondary" />
              <span className="notification-badge">2</span>
            </div>

            <div className="vr" style={{ height: '30px' }}></div>

            <button onClick={handleLogout} className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
              <FaSignOutAlt />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;