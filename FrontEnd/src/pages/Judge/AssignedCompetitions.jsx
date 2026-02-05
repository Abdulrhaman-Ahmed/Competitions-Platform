import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FaGavel, FaUsers, FaCheckCircle } from 'react-icons/fa';

const JudgeCompetitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCompetitions();
  }, []);

  const fetchMyCompetitions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/judges/my-competitions');
      setCompetitions(res.data.data);
    } catch (error) {
      console.error('Error fetching competitions:', error);
    } finally {
      setLoading(false);
    }
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
            <h3 className="fw-bold mb-1">مسابقاتي</h3>
            <p className="text-muted">المسابقات المعينة للتحكيم</p>
          </div>

          {competitions.length === 0 ? (
            <div className="card-custom text-center py-5">
              <FaGavel size={64} className="text-muted mb-3" />
              <h5 className="text-muted">لم يتم تعيينك كمحكم بعد</h5>
            </div>
          ) : (
            <div className="row g-4">
              {competitions.map((comp) => (
                <div key={comp.id} className="col-md-6 col-lg-4">
                  <div className="card-custom">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="bg-primary bg-opacity-10 rounded p-3">
                        <FaGavel size={24} className="text-primary" />
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-1">{comp.title}</h5>
                        <small className="text-muted">{comp.category}</small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className={`badge-custom ${
                        comp.status === 'ongoing' ? 'badge-ongoing' :
                        comp.status === 'completed' ? 'badge-completed' :
                        'badge-open'
                      }`}>
                        {comp.status === 'ongoing' ? 'جارية' :
                         comp.status === 'completed' ? 'منتهية' : 'قادمة'}
                      </span>
                    </div>

                    <div className="bg-light rounded p-3 mb-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <FaUsers className="text-muted" />
                        <span className="text-muted">المشاركون: </span>
                        <span className="fw-semibold">0</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <FaCheckCircle className="text-success" />
                        <span className="text-muted">تم التحكيم: </span>
                        <span className="fw-semibold">0</span>
                      </div>
                    </div>

                    <button className="btn btn-custom-primary w-100">
                      بدء التحكيم
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JudgeCompetitions;