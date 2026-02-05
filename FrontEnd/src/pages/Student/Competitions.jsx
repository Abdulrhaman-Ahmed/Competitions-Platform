import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import CompetitionCard from '../../components/CompetitionCard';
import Button from '../../components/Button';

const StudentCompetitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/competitions');
      setCompetitions(res.data.data);
    } catch (error) {
      toast.error('فشل تحميل المسابقات');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (competitionId) => {
    try {
      await axios.post('http://localhost:5000/api/participants/register', {
        competition_id: competitionId
      });
      toast.success('تم التسجيل بنجاح!');
      fetchCompetitions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل التسجيل');
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
          <div className="mb-4">
            <h3 className="fw-bold mb-1">المسابقات المتاحة</h3>
            <p className="text-muted">تصفح المسابقات وسجل للمشاركة</p>
          </div>

          <div className="row g-4">
            {competitions.map(competition => (
              <div key={competition.id} className="col-md-6 col-lg-4">
                <CompetitionCard
                  competition={competition}
                  onViewDetails={handleViewDetails}
                  onRegister={handleRegister}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCompetitions;