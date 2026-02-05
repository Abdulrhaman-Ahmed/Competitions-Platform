import { useState, useEffect } from 'react';
import { FaTrophy, FaUsers, FaCheckCircle, FaFlag } from 'react-icons/fa';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import CompetitionCard from '../../components/CompetitionCard';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_competitions: 0,
    total_participants: 0,
    ongoing_competitions: 0,
    completed_competitions: 0
  });
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, compsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/competitions/stats'),
        axios.get('http://localhost:5000/api/competitions')
      ]);

      setStats(statsRes.data.data);
      setCompetitions(compsRes.data.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (competition) => {
    console.log('View details:', competition);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-custom"></div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar />
        <div className="container-fluid p-4">
          {/* Header */}
          <div className="mb-4">
            <h3 className="fw-bold mb-1">لوحة التحكم</h3>
            <p className="text-muted">نظرة عامة على المسابقات والإحصائيات</p>
          </div>

          {/* Stats Cards */}
          <div className="row g-4 mb-5">
            <div className="col-md-6 col-lg-3">
              <StatCard
                title="إجمالي المسابقات"
                value={stats.total_competitions}
                icon={FaTrophy}
                colorClass="blue"
              />
            </div>
            <div className="col-md-6 col-lg-3">
              <StatCard
                title="المشاركون"
                value={stats.total_participants}
                icon={FaUsers}
                colorClass="green"
              />
            </div>
            <div className="col-md-6 col-lg-3">
              <StatCard
                title="المسابقات الجارية"
                value={stats.ongoing_competitions}
                icon={FaCheckCircle}
                colorClass="orange"
              />
            </div>
            <div className="col-md-6 col-lg-3">
              <StatCard
                title="المسابقات المنتهية"
                value={stats.completed_competitions}
                icon={FaFlag}
                colorClass="red"
              />
            </div>
          </div>

          {/* Current Competitions */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">المسابقات الحالية</h4>
              <a href="/admin/competitions" className="text-decoration-none">
                عرض الكل ←
              </a>
            </div>

            <div className="row g-4">
              {competitions.map(competition => (
                <div key={competition.id} className="col-md-4">
                  <CompetitionCard
                    competition={competition}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-custom">
            <h5 className="fw-bold mb-3">النشاط الأخير</h5>
            <div className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
              <div className="bg-primary bg-opacity-10 rounded p-2">
                <FaUsers className="text-primary" />
              </div>
              <div className="flex-grow-1">
                <p className="mb-1 fw-semibold">تم تسجيل مشارك جديد</p>
                <small className="text-muted">أحمد علي انضم إلى مسابقة العلوم</small>
              </div>
              <small className="text-muted">منذ ساعة</small>
            </div>

            <div className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
              <div className="bg-success bg-opacity-10 rounded p-2">
                <FaCheckCircle className="text-success" />
              </div>
              <div className="flex-grow-1">
                <p className="mb-1 fw-semibold">تم إكمال التحكيم</p>
                <small className="text-muted">مسابقة الرسم - تم إصدار النتائج</small>
              </div>
              <small className="text-muted">منذ ساعتين</small>
            </div>

            <div className="d-flex align-items-start gap-3">
              <div className="bg-warning bg-opacity-10 rounded p-2">
                <FaTrophy className="text-warning" />
              </div>
              <div className="flex-grow-1">
                <p className="mb-1 fw-semibold">مسابقة جديدة</p>
                <small className="text-muted">تم إضافة مسابقة برمجة جديدة</small>
              </div>
              <small className="text-muted">منذ 3 ساعات</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;