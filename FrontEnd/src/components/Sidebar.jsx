import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaTrophy,
  FaUsers,
  FaGavel,
  FaCertificate,
  FaChartBar
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, isAdmin, isJudge, isStudent } = useAuth();

  const adminMenu = [
    { path: '/admin/dashboard', icon: FaHome, label: 'الرئيسية' },
    { path: '/admin/competitions', icon: FaTrophy, label: 'المسابقات' },
    { path: '/admin/participants', icon: FaUsers, label: 'المشاركون' },
    { path: '/admin/judges', icon: FaGavel, label: 'المحكمون' },
    { path: '/admin/results', icon: FaChartBar, label: 'النتائج' },
    { path: '/admin/certificates', icon: FaCertificate, label: 'الشهادات' }
  ];

  const judgeMenu = [
    { path: '/judge/competitions', icon: FaTrophy, label: 'مسابقاتي' },
    { path: '/judge/judging', icon: FaGavel, label: 'التحكيم' }
  ];

  const studentMenu = [
    { path: '/student/competitions', icon: FaTrophy, label: 'المسابقات' },
    { path: '/student/my-competitions', icon: FaUsers, label: 'مسابقاتي' },
    { path: '/student/results', icon: FaChartBar, label: 'النتائج' },
    { path: '/student/certificates', icon: FaCertificate, label: 'الشهادات' }
  ];

  const getMenu = () => {
    if (isAdmin) return adminMenu;
    if (isJudge) return judgeMenu;
    if (isStudent) return studentMenu;
    return [];
  };

  const menu = getMenu();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-header d-flex align-items-center gap-3">
        <FaTrophy className="sidebar-logo" />
        <h2 className="sidebar-title">منصة المسابقات</h2>
      </div>

      <nav className="sidebar-nav">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
               style={{ width: '45px', height: '45px', fontSize: '18px' }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div className="text-white fw-semibold">{user?.name}</div>
            <small className="text-white opacity-75">
              {isAdmin && 'مدير'}
              {isJudge && 'محكم'}
              {isStudent && 'طالب'}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;