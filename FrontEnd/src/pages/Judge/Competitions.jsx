import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { FaTrophy, FaCalendar, FaUsers, FaGavel } from 'react-icons/fa';

const Competitions = () => {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/competitions/assigned', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setCompetitions(data);
      } catch (error) {
        console.error('Error fetching competitions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { variant: 'info', text: 'قادمة' },
      active: { variant: 'success', text: 'نشطة' },
      completed: { variant: 'secondary', text: 'منتهية' }
    };
    const config = statusConfig[status] || statusConfig.upcoming;
    return <Badge variant={config.variant}>{config.text}</Badge>;
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
      <div className="flex-grow-1">
        <Navbar />
        <div className="container-fluid p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">مسابقاتي</h2>
            <p className="text-muted mb-0">
              إجمالي المسابقات: {competitions.length}
            </p>
          </div>

          {competitions.length === 0 ? (
            <Card className="text-center py-5">
              <div className="mb-3">
                <FaGavel size={60} className="text-muted" />
              </div>
              <h4 className="mb-3">لا توجد مسابقات مخصصة للتحكيم</h4>
              <p className="text-muted mb-4">
                سيتم إخطارك عند تعيينك كمحكم في مسابقة جديدة
              </p>
            </Card>
          ) : (
            <div className="row g-4">
              {competitions.map((competition) => (
                <div key={competition._id} className="col-md-6 col-lg-4">
                  <Card 
                    className="h-100"
                    footer={
                      <Button 
                        variant="outline-primary" 
                        className="w-100"
                        onClick={() => window.location.href = `/judge/judging/${competition._id}`}
                      >
                        عرض التفاصيل
                      </Button>
                    }
                  >
                    <div className="mb-3">
                      {getStatusBadge(competition.status)}
                    </div>
                    <h4 className="mb-3">{competition.title}</h4>
                    <p className="text-muted mb-3">{competition.description}</p>
                    <div className="d-flex gap-3 text-muted">
                      <div className="d-flex align-items-center gap-2">
                        <FaCalendar />
                        <small>{new Date(competition.startDate).toLocaleDateString('ar-EG')}</small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <FaUsers />
                        <small>{competition.participants?.length || 0} مشارك</small>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Competitions;
